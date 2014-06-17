package utils;

import play.Logger;
import play.Logger.ALogger;

import java.io.FileInputStream;
import java.io.InputStream;
import java.util.Properties;

public class Config {

    private final static ALogger logger = Logger.of(Config.class);
    
    private static Properties props;
    
    public static String getString(String name) {
        return getProperty(name);
    }
    
    public static boolean getBoolean(String name) {
        return Boolean.parseBoolean(getProperty(name));
    }
    
    public static int getInt(String name) {
        return Integer.parseInt(getProperty(name));
    }
 
    private static String getProperty(String name) {
        try {
            return play.Play.application().configuration().getString(name);
        }
        catch (Exception e) {
            logger.error("Failed to read application.conf using Play becuase: " + e.getMessage());
            logger.info("Reading application.conf by not using Play instead");
            return getPropertyNotUsingPlay(name);
        }
    }
    
    private static String getPropertyNotUsingPlay(String name) {
        String p = getProperties().getProperty(name);
        if (p != null) {
            return p.replaceAll("\"", "");
        }
        return null;
    }
    
    private static synchronized Properties getProperties() {
        if (props == null) {
            try {
                String path = System.getProperty("user.dir") + "/conf/application.conf";
                logger.info("Reading application.conf from location: " + path);
                InputStream is = new FileInputStream(path);
                props = new Properties();
                props.load(is);
                is.close();
                return props;
            }
            catch (Exception e) {
                throw new RuntimeException(e);
            }
        }
        return props;
    }
}
