package modules;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.inject.AbstractModule;
import com.google.inject.Provides;
import com.google.inject.Singleton;
import com.mongodb.DBAddress;
import com.mongodb.Mongo;
import com.mongodb.MongoURI;
import org.jongo.Jongo;
import org.jongo.Mapper;
import org.jongo.ObjectIdUpdater;
import org.jongo.ReflectiveObjectIdUpdater;
import org.jongo.bson.BsonDocument;
import org.jongo.marshall.Marshaller;
import org.jongo.marshall.MarshallingException;
import org.jongo.marshall.Unmarshaller;
import org.jongo.marshall.jackson.JacksonEngine;
import org.jongo.marshall.jackson.JacksonIdFieldSelector;
import org.jongo.marshall.jackson.bson4jackson.BsonModule;
import org.jongo.marshall.jackson.bson4jackson.MongoBsonFactory;
import org.jongo.marshall.jackson.configuration.AbstractMappingBuilder;
import org.jongo.marshall.jackson.configuration.Mapping;
import org.jongo.marshall.jackson.configuration.PropertyModifier;
import org.jongo.query.BsonQueryFactory;
import org.jongo.query.QueryFactory;
import utils.Config;

import java.io.IOException;
import java.net.UnknownHostException;

public class AppModule extends AbstractModule {

    @Override
    protected void configure() {
        
    }
    
    @Provides
    @Singleton
    public Mongo provideMongo() throws UnknownHostException {
        String mongoHost = Config.getString("mongodb.host");
        String dbName = Config.getString("mongodb.dbname");

        if (mongoHost == null || mongoHost.isEmpty()) {
            mongoHost = "127.0.0.1:27017";
        }
        if(mongoHost.contains("heroku")){
            MongoURI uri = new MongoURI(mongoHost);
            return new Mongo(uri);
        } else{
            DBAddress address = new DBAddress(mongoHost, dbName);
            return Mongo.connect(address).getMongo();
        }

    }
    
    @Provides
    @Singleton
    public Jongo provideJongo(Mongo mongo) {
    	String dbName = Config.getString("mongodb.dbname");
    	ObjectMapper mapper = new ObjectMapper(MongoBsonFactory.createFactory());
        Mapper jongoMapper = new JacksonMapper.Builder(mapper).registerModule(new BsonModule())
                .addModifier(new PropertyModifier()).build();
        return new Jongo(mongo.getDB(dbName), jongoMapper);
    }

    public static class JacksonMapper implements Mapper {

        private final JacksonEngine engine;
        private final ObjectIdUpdater objectIdUpdater;
        private final QueryFactory queryFactory;

        private JacksonMapper(JacksonEngine engine, QueryFactory queryFactory, ObjectIdUpdater objectIdUpdater) {
            this.engine = engine;
            this.queryFactory = queryFactory;
            this.objectIdUpdater = objectIdUpdater;
        }

        public Marshaller getMarshaller() {
            return engine;
        }

        public Unmarshaller getUnmarshaller() {
            return engine;
        }

        public ObjectIdUpdater getObjectIdUpdater() {
            return objectIdUpdater;
        }

        public QueryFactory getQueryFactory() {
            return queryFactory;
        }

        public static class Builder extends AbstractMappingBuilder<Builder> {

            private QueryFactory queryFactory;
            private ObjectIdUpdater objectIdUpdater;

            public Builder() {
                super();
            }

            public Builder(ObjectMapper mapper) {
                super(mapper);
            }

            public Mapper build() {
            	final Mapping mapping = createMapping();
                JacksonEngine jacksonEngine = new JacksonEngine(mapping) {
                	@Override
                	public <T> T unmarshall(BsonDocument document, Class<T> clazz) throws MarshallingException {
                        try {
                            return (T) mapping.getReader(clazz).readValue(document.toByteArray(), 0, document.getSize());
                        } catch (IOException e) {
                        	
                        	e.printStackTrace();
                        	
                            String message = String.format("Unable to unmarshall result to %s from content %s", clazz, document.toString());
                            throw new MarshallingException(message, e);
                        }
                	}
                };
                if (queryFactory == null) {
                    queryFactory = new BsonQueryFactory(jacksonEngine);
                }
                if (objectIdUpdater == null) {
                    objectIdUpdater = new ReflectiveObjectIdUpdater(new JacksonIdFieldSelector());
                }
                return new JacksonMapper(jacksonEngine, queryFactory, objectIdUpdater);
            }

            public Builder withQueryFactory(QueryFactory factory) {
                this.queryFactory = factory;
                return getBuilderInstance();
            }

            public Builder withObjectIdUpdater(ObjectIdUpdater objectIdUpdater) {
                this.objectIdUpdater = objectIdUpdater;
                return getBuilderInstance();
            }

            @Override
            protected Builder getBuilderInstance() {
                return this;
            }
        }
    }
}
