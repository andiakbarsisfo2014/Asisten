package com.asistens;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import android.os.Bundle;

public class NotificationActifity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
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
  			initialProperties.putBoolean("fromNotifi",true);
       			return initialProperties;
            }
        };
    }
}
