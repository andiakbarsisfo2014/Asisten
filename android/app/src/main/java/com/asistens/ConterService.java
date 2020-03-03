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
import com.facebook.react.HeadlessJsTaskService;
import org.json.JSONException;
import org.json.JSONObject;
import java.net.URISyntaxException;
import java.text.SimpleDateFormat;
import java.util.Date;
import  android.util.Log;

public class ConterService extends Service {

    private Handler handler = new Handler();
    private String EVENT_DATE_TIME = "2020-02-22 23:51:00";
    private String DATE_FORMAT = "yyyy-MM-dd HH:mm:ss";
    private String PRAKTIKUM = "";
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
                Context context = getApplicationContext();
                Intent myIntent = new Intent(context, ConterEvent.class);
                Bundle bundle = new Bundle();
                if (!current_date.after(event_date)) {
                    diff = event_date.getTime() - current_date.getTime();
                    Days = diff / (24 * 60 * 60 * 1000);
                    Hours = diff / (60 * 60 * 1000) % 24;
                    Minutes = diff / (60 * 1000) % 60;
                    Seconds = diff / 1000 % 60;
                    bundle.putString("Seconds", Seconds+"");
                    bundle.putString("Minutes", Minutes+"");
                    bundle.putString("praktikum", PRAKTIKUM);
                    myIntent.putExtras(bundle);
                    context.startService(myIntent);
                    HeadlessJsTaskService.acquireWakeLockNow(context);
                    handler.postDelayed(this, 1000); 
                }
                else{
                    Minutes = 0 ;
                    Seconds = 0;
                    bundle.putString("Seconds", Seconds+"");
                    bundle.putString("Minutes", Minutes+"");
                    bundle.putString("praktikum", "Tidak ada  praktikum");
                    handler.removeCallbacks(runnableCode);
                    stopSelf();
                }
            }
            catch (Exception e) {
                e.printStackTrace();
            }
        }
    };

    public IBinder onBind(Intent intent) {
        return null;
    }

    public void onCreate() {
        super.onCreate();
    }

    public void onDestroy() {
        super.onDestroy();
        this.handler.removeCallbacks(this.runnableCode);
    }

    public int onStartCommand(Intent intent, int flags, int startId) {
        if(intent != null){
            String time  = intent.getStringExtra("time");
            String praktikum = intent.getStringExtra("praktikum");
            if(time != null){
                EVENT_DATE_TIME = time;
                PRAKTIKUM = praktikum;
                this.handler.post(this.runnableCode);
            }
            else{
                stopSelf();
            }
        }

        // 
        return START_STICKY;
    }
}