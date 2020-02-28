package com.asistens;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import android.os.Bundle;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.facebook.react.ReactRootView;
import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView;

public class NotificationActifity extends ReactActivity {
    @Override
    protected String getMainComponentName() {
        return "Asistens";
    }

    @Override
    protected ReactActivityDelegate createReactActivityDelegate() {
        return new ReactActivityDelegate(this, getMainComponentName()) {
  		    @Override
  		    protected Bundle getLaunchOptions() {
  			   Bundle initialProperties = new Bundle();
           Bundle extras = getIntent().getExtras(); 
           initialProperties.putString("praktikum", extras.getString("praktikum"));
  			   initialProperties.putBoolean("fromNotifi",true);
       		   return initialProperties;
            }
            @Override
            protected ReactRootView createRootView() {
                return new RNGestureHandlerEnabledRootView(NotificationActifity.this);
            }
        };
    }
}
