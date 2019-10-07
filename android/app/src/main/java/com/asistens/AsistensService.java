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
import android.util.Log;
import android.widget.Toast;
import com.github.nkzawa.socketio.client.IO;
import com.github.nkzawa.socketio.client.Socket;
import com.github.nkzawa.emitter.Emitter;
import com.facebook.react.HeadlessJsTaskService;
import org.json.JSONException;
import org.json.JSONObject;
import java.net.URISyntaxException;
import java.text.SimpleDateFormat;
import java.util.Date;


public class AsistensService extends Service {

    private static final int SERVICE_NOTIFICATION_ID = 12345;
    private static final String CHANNEL_ID = "Asistens";
    
    private String EVENT_DATE_TIME = "2019-12-31 02:44:00";
    private String DATE_FORMAT = "yyyy-MM-dd HH:mm:ss";
    
    private Handler handler = new Handler();
    private Runnable runnableCode = new Runnable() {
        @Override
        public void run() {
            
            
            try{
                SimpleDateFormat dateFormat = new SimpleDateFormat(DATE_FORMAT);
                Date event_date = dateFormat.parse(EVENT_DATE_TIME);
                Date current_date = new Date();
                long diff;
                long Days = 0;
                long Hours = 0;
                long Minutes = 0;
                long Seconds = 0;
                if (!current_date.after(event_date)) {
                    diff = event_date.getTime() - current_date.getTime();
                    Days = diff / (24 * 60 * 60 * 1000);
                    Hours = diff / (60 * 60 * 1000) % 24;
                    Minutes = diff / (60 * 1000) % 60;
                    Seconds = diff / 1000 % 60;
                }
                else{
                    Minutes = 0 ;
                    Seconds = 0;
                    handler.removeCallbacks(runnableCode);
                }
                Context context = getApplicationContext();
                Intent myIntent = new Intent(context, AsistensEventService.class);
                Bundle bundle = new Bundle();
                bundle.putString("Seconds", Seconds+"");
                bundle.putString("Minutes", Minutes+"");
                myIntent.putExtras(bundle);
                context.startService(myIntent);
                HeadlessJsTaskService.acquireWakeLockNow(context);
                handler.postDelayed(this, 1000); 
            }
            catch (Exception e) {
                e.printStackTrace();
            }

            
        }
    };

    private Socket mSocket;
    {
        try {
            mSocket = IO.socket("http://103.55.216.17:3000/");
        } catch (URISyntaxException e) {}
    }

    private void createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            // int importance = NotificationManager.IMPORTANCE_DEFAULT;
            // NotificationChannel channel = new NotificationChannel(CHANNEL_ID, "HEARTBEAT", importance);
            // channel.setDescription("CHANEL DESCRIPTION");
            // NotificationManager notificationManager = getSystemService(NotificationManager.class);
            // notificationManager.createNotificationChannel(channel);
        }
    }

    private void generateNotif (){
        Intent notificationIntent = new Intent(this, NotificationActifity.class);
        notificationIntent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TASK); 
        notificationIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        PendingIntent contentIntent = PendingIntent.getActivity(this, 0, notificationIntent, PendingIntent.FLAG_CANCEL_CURRENT);
        Notification notification = new NotificationCompat.Builder(this, "Tagal")
                .setContentTitle("Asistens")
                .setContentText("Kelas dimulai")
                .setSmallIcon(R.mipmap.ic_launcher)
                .setContentIntent(contentIntent)
                .setPriority(1)
                .setDefaults(Notification.DEFAULT_ALL)
                .setOngoing(true)
                .build();
        NotificationManager notificationManager = getSystemService(NotificationManager.class);
        notificationManager.notify(0,notification);
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
        // this.handler.removeCallbacks(this.runnableCode);
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        mSocket.connect();
        mSocket.on("new_regist_client", new Emitter.Listener(){
            @Override
            public void call(Object... args){
                generateNotif();
                handler.post(runnableCode);
            }
        });
        // 
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
