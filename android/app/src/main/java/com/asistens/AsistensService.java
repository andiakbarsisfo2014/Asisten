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

import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.bridge.ReactApplicationContext;
import androidx.localbroadcastmanager.content.LocalBroadcastManager;

import java.net.HttpURLConnection;
import javax.net.ssl.HttpsURLConnection;
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.net.URL;
import android.os.AsyncTask;
import org.json.JSONArray;
import org.json.JSONException;
import java.util.HashMap;
import android.os.Build;



public class AsistensService extends Service {

    private static final int SERVICE_NOTIFICATION_ID = 12345;
    private static final String CHANNEL_ID = "Asistens";
    ConterSession conterSession;
    StorageReact storageReact;
    ReactApplicationContext reactApplicationContext;
    private String EVENT_DATE_TIME = "2020-12-31 02:44:00";
    private String DATE_FORMAT = "yyyy-MM-dd HH:mm:ss";
    private Handler handler = new Handler();

    private Runnable runnableCode = new Runnable() {
        @Override
        public void run() {
            try{
                Context context = getApplicationContext();
                Intent myIntent = new Intent(context, AsistensEventService.class);
                Bundle bundle = new Bundle();
                bundle.putString("Service", "Yes");
                myIntent.putExtras(bundle);
                context.startService(myIntent);
                HeadlessJsTaskService.acquireWakeLockNow(context);                
            }
            catch (Exception e) {
                e.printStackTrace();
            }
        }
    };
    

    private void generateNotif (String msg){
        if(Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            int importance = NotificationManager.IMPORTANCE_DEFAULT;
            NotificationChannel channel = new NotificationChannel("Asistens", "Asistens", importance);
            channel.setDescription("Asistens");
            NotificationManager notificationManager = getSystemService(NotificationManager.class);
            notificationManager.createNotificationChannel(channel);
        }
        Intent notificationIntent = new Intent(this, BootUpReceiver.class);
        notificationIntent.addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP | Intent.FLAG_ACTIVITY_CLEAR_TOP); 
        notificationIntent.putExtra("data", "yes");
        notificationIntent.putExtra("praktikum", msg);
        PendingIntent contentIntent = PendingIntent.getBroadcast(this, 0, notificationIntent, PendingIntent.FLAG_CANCEL_CURRENT);
        NotificationCompat.Builder mBuilder = new NotificationCompat.Builder(this)
            .setSmallIcon(R.drawable.logo)
            .setContentIntent(contentIntent)
            .setPriority(1)
            .setDefaults(Notification.DEFAULT_ALL)
            // .setOngoing(true)
            .setAutoCancel(true)
            .setContentTitle("Asistens")
            .setContentText(msg);
        NotificationManager mNotificationManager = (NotificationManager) getSystemService(NOTIFICATION_SERVICE);
        mNotificationManager.notify(001, mBuilder.build());

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
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        Log.w("Asistensi: ", "Hai Socket");
        Context mContext = getApplicationContext();
        SocketIO mSocketIO = new SocketIO(mContext);
        Socket socket = mSocketIO.configSocket();
        socket.on("ping", new Emitter.Listener() {
            @Override
            public void call(final Object... dataRespopn) {
                socket.emit("pong");
            }
        });
        socket.on("connect", new Emitter.Listener() {
            @Override
            public void call(final Object... dataRespopn) {
                socket.emit("checkMyNotif");
            }
        });

        socket.on("notifikasi", new Emitter.Listener() {
            @Override
            public void call(final Object... dataRespopn) {
                JSONObject data = (JSONObject) dataRespopn[0];
                Log.w("Asistensi: ", "Notifikasi");
                try {
                    if(data.getBoolean("allow_count")) {
                        generateNotif(data.getString("praktikum"));
                        Intent intent = new Intent(mContext, ConterService.class);
                        intent.putExtra("time", data.getString("time"));
                        intent.putExtra("praktikum", data.getString("praktikum"));
                        mContext.stopService(new Intent(mContext, ConterService.class));
                        mContext.startService(intent);
                    }
                    else{
                        mContext.stopService(new Intent(mContext, ConterService.class));
                    }

                } catch (JSONException e) {
                    return;
                }
            }
        });
        if(mSocketIO.allowConnect()) {
            socket.connect();
        }
        else{
            socket.disconnect();
        }
        return START_STICKY;
    }

}
