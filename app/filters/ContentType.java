package filters;

public enum ContentType {

	JSON("application/json; charset=utf-8"),

	IMAGE_GIF("image/gif"),
	
	FORM_URLENCODED("application/x-www-form-urlencoded; charset=utf-8"),
	
	NULL; //for internal purposes only 
	
    private final String val;
    
    ContentType() {
    	val = null;
    }
    
    ContentType(String val) {
        this.val = val;
    }
    
    @Override
    public String toString() {
    	return val;
    }
	
    
}
