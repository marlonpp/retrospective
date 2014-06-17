package controllers;

import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.fasterxml.jackson.databind.node.ObjectNode;
import mapper.CustomObjectMapper;
import org.jongo.MongoCursor;
import play.Logger;
import play.Logger.ALogger;
import play.mvc.Controller;

import java.io.IOException;
import java.util.Iterator;
import java.util.List;

public class BaseController extends Controller {

    public static final String CTX_ARG_USER = "USER";
 
    protected static final CustomObjectMapper mapper = new CustomObjectMapper();
    
    static {
        mapper.setSerializationInclusion(Include.NON_NULL);
    }

    protected ALogger logger = Logger.of(getClass());
    
    public <T> String toJsonString(Iterator<T> data) throws IOException {
    	try {
    		return mapper.writeValueAsString(data);
    	}
        finally {
        	if (data instanceof MongoCursor) {
        		((MongoCursor<T>) data).close();
        	}
        }
    }
    
    public JsonNode toJsonNode(Object data) throws IOException {
    	return mapper.valueToTree(data);
    }

    public <T> List<T> bindJsonArray(TypeReference<List<T>> type) throws IOException {
        return mapper.convertValue(request().body().asJson(), type);
    }

    public <T> T bindObject(Class<T> entityClass) throws IOException {
        return mapper.convertValue(request().body().asJson(), entityClass);
    }

    public ObjectNode newObjectNode() {
    	return new ObjectNode(JsonNodeFactory.instance);
    }
    
    public ArrayNode newArrayNode() {
    	return new ArrayNode(JsonNodeFactory.instance);
    }
}
