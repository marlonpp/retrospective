package dao;

import com.google.inject.Inject;
import models.Retrospective;
import org.bson.types.ObjectId;
import org.jongo.Jongo;

public class RetrospectiveDao extends MongoDao<Retrospective, ObjectId>{

    @Inject
    public RetrospectiveDao(Jongo jongo) {
        super(jongo, Retrospective.class);
    }


}
