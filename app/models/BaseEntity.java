package models;


import com.fasterxml.jackson.annotation.JsonProperty;
import org.bson.types.ObjectId;

import javax.validation.ConstraintViolation;
import javax.validation.Validator;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

public abstract class BaseEntity extends JsonEntity {

    @JsonProperty("_id")
	public ObjectId id;

    public Date createdTime;
    public Date lastUpdatedTime;

    public static Set<String> validate(Object object, Validator validator) {
        Set<ConstraintViolation<Object>> constraintViolations = validator.validate(object);
        Set<String> errors = new HashSet<String>();
        for(ConstraintViolation<Object> cv : constraintViolations) {
            errors.add(cv.getMessage());
        }
        return errors;
    }
}
