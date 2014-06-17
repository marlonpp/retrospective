package filters;

import models.ErrorResponse;
import play.Logger;
import play.libs.F.Function0;
import play.libs.F.Promise;
import play.mvc.Action;
import play.mvc.Http;
import play.mvc.SimpleResult;
import play.mvc.With;

import java.io.IOException;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@With(EnsureContentTypeJsonAction.class)
@Target({ ElementType.METHOD })
@Retention(RetentionPolicy.RUNTIME)
public @interface EnsureContentType {
    
    ContentType request() default ContentType.NULL;
    ContentType response() default ContentType.NULL;
    ContentType value() default ContentType.NULL;
}

class EnsureContentTypeJsonAction extends Action<EnsureContentType> {

    @Override
    public Promise<SimpleResult> call(Http.Context ctx) throws Throwable {
        if (configuration.request().equals(ContentType.NULL)
                && configuration.response().equals(ContentType.NULL)
                && configuration.value().equals(ContentType.NULL)) {

            Logger.warn("Annotation @EnsureContentType is missing parameters");
        }
        String ct = ctx.request().getHeader("Content-Type");
        if (!isContentTypeCorrect(ct)) {
            return contentTypeNotCorrect(ctx.response(), ct);
        }
        setContentType(ctx.response());
        return delegate.call(ctx);
    }

    private Promise<SimpleResult> contentTypeNotCorrect(Http.Response response, String ct) throws IOException {
        ContentType validCT = configuration.value().toString() == null ? configuration.request()
                : configuration.value();
        String msg = "Content-Type is " + ct + ", it must be " + validCT;
        Logger.error(msg);
        final ErrorResponse er = new ErrorResponse(400, msg);
        response.setContentType("application/json");
        return Promise.promise(new Function0<SimpleResult>() {
            public SimpleResult apply() throws Throwable {
            	return status(er.code, er.toJson());
            }
        });	
    }

    private boolean isContentTypeCorrect(String ct) {
        if (configuration.request().toString() != null) {
            return ct != null && (isEquals(ct, configuration.request().toString()));
        }
        if (configuration.value().toString() != null) {
            return ct != null && (isEquals(ct, configuration.value().toString()));
        }
        return true;
    }

    private boolean isEquals(String ct1, String ct2) {
        String a = ct1.replaceAll(" ", "").toLowerCase();
        String b = ct2.replaceAll(" ", "").toLowerCase();
        return a.equals(b);
    }
    
    private void setContentType(Http.Response response) {
        if (!configuration.response().equals(ContentType.NULL)) {
            response.setContentType(configuration.response().toString());
        }
        else {
            response.setContentType(configuration.value().toString());
        }
    }
}