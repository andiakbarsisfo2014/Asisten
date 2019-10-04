package com.asistens;

import android.content.Intent;


import android.app.Notification;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
// import android.support.v4.app.NotificationCompat;
import android.app.NotificationManager;
import androidx.core.app.NotificationCompat;
import android.app.PendingIntent;
import android.app.NotificationChannel;

import javax.annotation.Nonnull;

public class AsistensModule extends ReactContextBaseJavaModule {

    public static final String REACT_CLASS = "AsistensService";
    private static ReactApplicationContext reactContext;
    NotificationManager notificationManager;

    public AsistensModule(@Nonnull ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Nonnull
    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @ReactMethod
    public void startService() {
        this.reactContext.startService(new Intent(this.reactContext, AsistensService.class));
    }

    @ReactMethod
    public void stopService() {
        this.reactContext.stopService(new Intent(this.reactContext, AsistensService.class));
    }

    @ReactMethod
    public void showNotif () {
        // NotificationCompat.Builder mBuilder = new NotificationCompat.Builder(this.reactContext);
        // mBuilder.setSmallIcon(R.mipmap.ic_launcher);
        // mBuilder.setContentTitle("My notification");
        // mBuilder.setContentText("Hello World!");
        // mBuilder.setDefaults(Notification.DEFAULT_ALL);
        // NotificationManager mNotificationManager = (NotificationManager) this.reactContext.getSystemService(this.reactContext.NOTIFICATION_SERVICE);
        // mNotificationManager.notify(001, mBuilder.build());
        Intent notificationIntent = new Intent(this.reactContext, NotificationActifity.class);
        PendingIntent contentIntent = PendingIntent.getActivity(this.reactContext, 0, notificationIntent, PendingIntent.FLAG_CANCEL_CURRENT);
        Notification notification = new NotificationCompat.Builder(this.reactContext, "Tagal")
                .setContentTitle("Heartbeat service")
                .setContentText("Running...")
                .setSmallIcon(R.mipmap.ic_launcher)
                .setContentIntent(contentIntent)
                .setPriority(1)
                .build();
        NotificationManager notificationManager = this.reactContext.getSystemService(NotificationManager.class);
        notificationManager.notify(0,notification);
    }

    // @ReactMethod 
    // public boolean isMyServiceRunning(Class<?> serviceClass) {
    //     ActivityManager manager = (ActivityManager) getSystemService(Context.ACTIVITY_SERVICE);
    //     for (RunningServiceInfo service : manager.getRunningServices(Integer.MAX_VALUE)) {
    //         if (serviceClass.getName().equals(service.service.getClassName())) {
    //             return true;
    //         }
    //     }
    //     return false;
    // }
}
