package com.asistens;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.util.Log;
import android.app.ActivityManager;
import android.app.ActivityManager.RunningServiceInfo;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.modules.core.DeviceEventManagerModule;

public class CounterReciver extends BroadcastReceiver {
    private ReactContext reactContext;
    @Override
    public void onReceive(Context context, Intent intent) {
        if(intent.getAction() == "android.intent.action.CONTER_RECIVER"){
            if(!isMyServiceRunning(ConterService.class, context)){
                String time  = intent.getStringExtra("time");
                Intent counterIntent = new Intent(context, ConterService.class);
                counterIntent.putExtra("time", time);
                context.startService(counterIntent);
            }
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
