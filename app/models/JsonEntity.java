package models;

import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import mapper.CustomObjectMapper;
import play.Logger;

import java.io.IOException;

public abstract class JsonEntity {

    protected static final ObjectMapper mapper = new CustomObjectMapper();
    static {
        mapper.setSerializationInclusion(Include.NON_NULL);
    }
    
    public JsonNode toJson() throws IOException {
        return mapper.valueToTree(this);
    }

    @Override
    public String toString() {
        try {
            return mapper.writeValueAsString(this);
        }
        catch (IOException e) {
            Logger.error("Failed to put object to json-string: " + this.getClass().getName());
            e.printStackTrace();
            return super.toString();
        }
    }

}
