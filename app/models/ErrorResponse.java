package models;

public class ErrorResponse extends JsonEntity {
    
    public String reason;
    
    public int code;
    
    public ErrorResponse() {}
    
    public ErrorResponse(int code) {
    	this(code, null);
    }
    
    public ErrorResponse(String reason) {
    	this(400, reason);
    }
    
    public ErrorResponse(int code, String reason) {
    	this.code = code;
    	this.reason = reason;
    }
    
}