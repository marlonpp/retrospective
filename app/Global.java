import com.mongodb.Mongo;
import modules.AppInjector;
import play.Application;
import play.GlobalSettings;
import play.Logger;
import play.api.mvc.EssentialFilter;
import play.api.mvc.Handler;
import play.filters.gzip.GzipFilter;
import play.mvc.Http.RequestHeader;

import java.io.IOException;

public class Global extends GlobalSettings {

    @Override
    public <A> A getControllerInstance(Class<A> controllerClass) throws Exception {
        return AppInjector.getInstance(controllerClass);
    }

    @Override
    public void beforeStart(Application application) {

    }

    @SuppressWarnings("unchecked")
    @Override
    public <T extends EssentialFilter> Class<T>[] filters() {
        return new Class[]{GzipFilter.class};
    }

    @Override
    public void onStart(Application application) {
        super.onStart(application);
        AppInjector.reset();
    }

    @Override
    public void onStop(Application application) {
        super.onStop(application);
        AppInjector.getInstance(Mongo.class).close();
    }

    @Override
    public Handler onRouteRequest(RequestHeader req) {
        return super.onRouteRequest(req);
    }
}