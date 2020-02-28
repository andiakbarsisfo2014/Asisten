package com.asistens;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.util.Log;
import android.widget.Toast;
import com.facebook.react.bridge.WritableMap;

import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import android.os.Bundle;
import javax.annotation.Nullable;
import com.facebook.react.bridge.Arguments;
import android.preference.PreferenceManager;
import android.os.Build;
import android.content.Intent;
import android.app.ActivityManager;
import android.app.ActivityManager.RunningServiceInfo;


public class BootUpReceiver extends BroadcastReceiver {

	private ReactContext reactContext;
    private Boolean isActive;

    @Override
    public void onReceive(Context context, Intent intent) {
        if (!isMyServiceRunning(AsistensService.class, context)) {
            context.startService(new Intent(context, AsistensService.class));   
        }
        String fromNotif  = intent.getStringExtra("data");
        String praktikum = intent.getStringExtra("praktikum");
        if (fromNotif != null) {
            if (fromNotif.equals("yes")) {   
                WritableMap params = Arguments.createMap();
                params.putBoolean("fromNotif", true);
                params.putString("praktikum", praktikum);
                sendEvent(context, "notification-press", params, praktikum);
            }   
        }
    }

    private void sendEvent(Context context, String eventName, @Nullable WritableMap params, String praktikum) {
    	reactContext = AsistensModule.reactContext;
    	isActive = PreferenceManager.getDefaultSharedPreferences(context).getBoolean("isActive",false);
    	if (isActive) {
        	reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName, params);
    	}
    	else{
    		Intent notificationIntent = new Intent(context, NotificationActifity.class);
    		notificationIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            notificationIntent.putExtra("praktikum", praktikum);
    		context.startActivity(notificationIntent);
    	}
    } 
    public boolean isMyServiceRunning(Class<?> serviceClass, Context context) {
        ActivityManager manager = (ActivityManager) context.getSystemService(context.ACTIVITY_SERVICE);
        for (RunningServiceInfo service : manager.getRunningServices(Integer.MAX_VALUE)) {
            if (serviceClass.getName().equals(service.service.getClassName())) {
                return true;
            }
        }
        return false;
    }
}
