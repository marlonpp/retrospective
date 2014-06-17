package dao;

import models.BaseEntity;
import org.jongo.Jongo;
import org.jongo.MongoCollection;
import play.Logger;
import play.Logger.ALogger;

import java.io.Serializable;
import java.util.Iterator;

public abstract class MongoDao<T, PK extends Serializable> {
	
	protected final Class<T> collectionType;
    protected final MongoCollection collection;
    
    protected ALogger logger = Logger.of(getClass());

    public final Jongo jongo;
    
    public MongoDao(Jongo jongo, Class<T> clazz) {
        collectionType = clazz;
        collection = jongo.getCollection(clazz.getSimpleName());
        this.jongo = jongo;
    }

    public Iterator<T> find() {
    	return collection.find().as(collectionType);
    }
    
    public T findById(PK id) {
    	return collection.findOne("{_id:#}", id).as(collectionType);
    }
    
    public <T extends BaseEntity> void save(T object) {
        collection.save(object);
    }
	
    public void remove(PK id) {
    	collection.remove("{_id:#}", id);
    }
}
