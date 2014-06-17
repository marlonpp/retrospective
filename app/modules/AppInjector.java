package modules;

import com.google.common.collect.Lists;
import com.google.inject.Guice;
import com.google.inject.Injector;
import com.google.inject.Module;
import com.google.inject.Stage;

import java.util.List;

public class AppInjector {

	private static Injector injector;

	public synchronized static void init() {
		if (injector == null) {
			List<Module> modules = Lists.newArrayList();
			modules.add(new AppModule());
			injector = Guice.createInjector(Stage.DEVELOPMENT, modules);
		}
	}

	public static <T> T getInstance(Class<T> entityClass) {
		if (injector == null) {
			init();
		}
		return injector.getInstance(entityClass);
	}
	
	public static void reset() {
		injector = null;
	}
}
