package filters;

import org.apache.commons.lang3.StringUtils;
import play.Logger;
import play.Logger.ALogger;
import play.libs.F.Function0;
import play.libs.F.Promise;
import play.mvc.Action;
import play.mvc.Http.Context;
import play.mvc.Http.Request;
import play.mvc.SimpleResult;
import play.mvc.With;

import java.io.UnsupportedEncodingException;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import java.net.URLEncoder;
import java.util.Map;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicLong;

@With(LoggingFilterAction.class)
@Target({ ElementType.TYPE, ElementType.METHOD })
@Retention(RetentionPolicy.RUNTIME)
public @interface LoggingFilter {

}

class LoggingFilterAction extends Action<LoggingFilter> {

    private static final String NOTIFICATION_PREFIX = "* ";
    private static final String REQUEST_PREFIX = "> ";
    private static final String RESPONSE_PREFIX = "< ";

    private final ALogger logger = Logger.of(getClass());
    private final AtomicLong _id = new AtomicLong(0);
    private final String newLine = System.getProperty("line.separator");

    @Override
    public Promise<SimpleResult> call(Context ctx) throws Throwable {
        long id = _id.incrementAndGet();
        StringBuilder b = new StringBuilder();
        printRequestLine(b, id, ctx.request().method(), ctx.request().uri());
        printRequestHeaders(b, id, REQUEST_PREFIX, ctx.request().headers());
        String requestContent = contentAsString(ctx.request(), b);
        if (!StringUtils.isEmpty(requestContent)) {
            b.append(requestContent);
        }
        b.append(newLine);
        final SimpleResult result = delegate.call(ctx).get(5, TimeUnit.SECONDS);
        printResponseLine(b, id, getStatus(result));
        printResponseHeaders(b, id, RESPONSE_PREFIX, headers(result));
        String responseContent = contentAsString(result);
        if (!StringUtils.isEmpty(responseContent)) {
            b.append(responseContent);
        }
        b.append(newLine);
        logger.debug(b.toString());
        
        return Promise.promise(new Function0<SimpleResult>() {
            public SimpleResult apply() throws Throwable {
                return result;
            }
        });
    }

    private String header(String header, SimpleResult result) {
        return play.core.j.JavaResultExtractor.getHeaders(result).get(header);
    }

    private String charset(SimpleResult result) {
        String h = header("Content-Type", result);
        if (h == null) return null;
        if (h.contains("; charset=")) {
            return h.substring(h.indexOf("; charset=") + 10, h.length()).trim();
        }
        else {
            return null;
        }
    }

    private byte[] contentAsBytes(SimpleResult result) {
        return play.core.j.JavaResultExtractor.getBody(result);
    }

    private String contentAsString(Request request, StringBuilder b) {
        try {
            if (request.body() == null) {
                return "request has no body";
            }
        } catch (ClassCastException e) {
            return "request has no body";
        }
        if (request.body().asText() != null) {
            logger.debug("getting request body as text");
            return request.body().asText();
        }
        if (request.body().asRaw() != null) {
            logger.debug("getting request body as raw");
            try {
                return new String(request.body().asRaw().asBytes(), "utf-8");
            }
            catch (UnsupportedEncodingException e) {
                throw new RuntimeException(e);
            }
        }
        if (request.body().asJson() != null) {
            logger.debug("getting request body as json");
            return request.body().asJson().toString();
        }
        if (request.body().asFormUrlEncoded() != null) {
            logger.debug("getting request body as as formUrlEncoded");
            return toString(request.body().asFormUrlEncoded());
        }
        if (request.body().asMultipartFormData() != null) {
            logger.debug("getting request body as multipartFormData");
            return request.body().asMultipartFormData().toString();
        }
        if (request.body().asXml() != null) {
            logger.debug("getting request body as xml");
            return request.body().asXml().toString();
        }
        logger.debug("getting request body as default");
        return request.body().toString();
    }

    private String toString(Map<String, String[]> data) {
        StringBuilder sb = new StringBuilder();
        for (Map.Entry<String, String[]> e : data.entrySet()) {
            String[] val = e.getValue();
            String key = e.getKey();
            if (sb.length() > 0) {
                sb.append("&");
            }
            try {
                sb.append(key).append("=").append(URLEncoder.encode(val[0], "utf-8"));
            }
            catch (UnsupportedEncodingException e1) {
                throw new RuntimeException(e1);
            }
        }
        return sb.toString();
    }

    private String contentAsString(SimpleResult result) {
        try {
            String charset = charset(result);
            if (charset == null) {
                charset = "utf-8";
            }
            return new String(contentAsBytes(result), charset);
        }
        catch (RuntimeException e) {
            throw e;
        }
        catch (Throwable t) {
            throw new RuntimeException(t);
        }
    }

    private Map<String, String> headers(SimpleResult result) {
        return play.core.j.JavaResultExtractor.getHeaders(result);
    }

    private int getStatus(SimpleResult result) {
    	return result.getWrappedSimpleResult().header().status();
    }

    private StringBuilder prefixId(StringBuilder b, long id) {
        b.append(Long.toString(id)).append(" ");
        return b;
    }

    private void printRequestLine(StringBuilder b, long id, String method, String uri) {
        prefixId(b, id).append(NOTIFICATION_PREFIX)
                .append("LoggingFilter - Request received on thread ")
                .append(Thread.currentThread().getName()).append("\n");
        prefixId(b, id).append(REQUEST_PREFIX).append(method).append(" ").append(uri).append("\n");
    }

    private void printResponseLine(StringBuilder b, long id, int status) {
        prefixId(b, id).append(NOTIFICATION_PREFIX)
                .append("LoggingFilter - Response received on thread ")
                .append(Thread.currentThread().getName()).append("\n");
        prefixId(b, id).append(RESPONSE_PREFIX).append(Integer.toString(status)).append("\n");
    }

    private void printResponseHeaders(StringBuilder b, long id, final String prefix,
            Map<String, String> headers) {
        for (Map.Entry<String, String> e : headers.entrySet()) {
            String val = e.getValue();
            String header = e.getKey();
            printPrefixedHeader(b, id, prefix, header, new String[] { val });
        }

    }

    private void printRequestHeaders(StringBuilder b, long id, final String prefix,
            Map<String, String[]> headers) {
        for (Map.Entry<String, String[]> e : headers.entrySet()) {
            String[] val = e.getValue();
            String header = e.getKey();
            printPrefixedHeader(b, id, prefix, header, val);
        }
    }

    private void printPrefixedHeader(StringBuilder b, long id, final String prefix, String header,
            String[] val) {
        if (val.length == 1) {
            prefixId(b, id).append(prefix).append(header).append(": ").append(val[0]).append("\n");
        }
        else {
            StringBuilder sb = new StringBuilder();
            boolean add = false;
            for (Object s : val) {
                if (add) {
                    sb.append(',');
                }
                add = true;
                sb.append(s);
            }
            prefixId(b, id).append(prefix).append(header).append(": ").append(sb.toString())
                    .append("\n");
        }
    }

}
