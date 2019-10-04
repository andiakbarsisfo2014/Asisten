package com.asistens;

import android.app.Notification;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.os.Handler;
import android.os.IBinder;
// import androidx.appcompat.app.NotificationCompat;
import androidx.core.app.NotificationCompat;
import android.app.NotificationManager;
import android.app.NotificationChannel;
import android.os.Build;
import android.os.Bundle;

import com.facebook.react.HeadlessJsTaskService;

public class AsistensService extends Service {

    private static final int SERVICE_NOTIFICATION_ID = 12345;
    private static final String CHANNEL_ID = "Asistens";

    private Handler handler = new Handler();
    private Runnable runnableCode = new Runnable() {
        @Override
        public void run() {
            Context context = getApplicationContext();
            Intent myIntent = new Intent(context, AsistensEventService.class);
            Bundle bundle = new Bundle();
            bundle.putString("foo", "bar");
            myIntent.putExtras(bundle);
            context.startService(myIntent);
            HeadlessJsTaskService.acquireWakeLockNow(context);
            // handler.postDelayed(this, 1000);
        }
    };
    private void createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            // int importance = NotificationManager.IMPORTANCE_DEFAULT;
            // NotificationChannel channel = new NotificationChannel(CHANNEL_ID, "HEARTBEAT", importance);
            // channel.setDescription("CHANEL DESCRIPTION");
            // NotificationManager notificationManager = getSystemService(NotificationManager.class);
            // notificationManager.createNotificationChannel(channel);
        }
    }

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @Override
    public void onCreate() {
        super.onCreate();

    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        this.handler.removeCallbacks(this.runnableCode);
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        this.handler.post(this.runnableCode);
        // createNotificationChannel();
        // Intent notificationIntent = new Intent(this, MainActivity.class);
        // PendingIntent contentIntent = PendingIntent.getActivity(this, 0, notificationIntent, PendingIntent.FLAG_CANCEL_CURRENT);
        // Notification notification = new NotificationCompat.Builder(this, CHANNEL_ID)
        //         .setContentTitle("Heartbeat service")
        //         .setContentText("Running...")
        //         .setSmallIcon(R.mipmap.ic_launcher)
        //         // .setContentIntent(contentIntent)
        //         .setPriority(1)
        //         .build();
        // // NotificationManager notificationManager = getSystemService(NotificationManager.class);
        // // notificationManager.notify(0,notification);
        // startForeground(SERVICE_NOTIFICATION_ID, notification);
        //cuma muncul d status bar
        return START_STICKY;
    }

}
