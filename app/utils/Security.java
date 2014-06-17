package utils;

import org.apache.commons.codec.binary.Base64;

import java.security.MessageDigest;

public class Security {
    
    private static final String paddingSecret = "TYM0UI4omIzI2OYsmIzMoayAEESeTQY";
    
    public static String generateSessionSignature(String userId, String passwordHash,
            String timestamp) {
        StringBuffer stringToSign = new StringBuffer().append(userId == null ? "" : userId)
                .append('|').append(passwordHash == null ? "" : passwordHash).append('|')
                .append(timestamp == null ? "" : timestamp).append('|').append(paddingSecret);
        return getBase64EncodedMD5Hash(stringToSign.toString());
    }
    
    public static String getBase64EncodedMD5Hash(String val) {
        try {
            MessageDigest md = MessageDigest.getInstance("MD5");
            byte[] hash = md.digest(val.toString().getBytes("UTF-8"));
            return new String(Base64.encodeBase64(hash));
        }
        catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

}
