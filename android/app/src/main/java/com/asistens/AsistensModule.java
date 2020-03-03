package com.asistens;

import android.content.Intent;

import com.facebook.react.bridge.Callback;
import android.app.Notification;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
// import android.support.v4.app.NotificationCompat;
import android.app.NotificationManager;
import androidx.core.app.NotificationCompat;
import android.app.PendingIntent;
import android.app.NotificationChannel;
import javax.annotation.Nonnull;
import android.util.Log;
import android.app.ActivityManager;
import android.app.ActivityManager.RunningServiceInfo;
import java.io.File;
import android.os.Environment;
import org.json.JSONObject;
import org.json.JSONArray;
import org.json.JSONException;

import android.provider.MediaStore;
import java.util.ArrayList;
import android.database.Cursor;
import android.util.Log;

import android.graphics.Bitmap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;
import javax.annotation.Nullable;

import androidx.localbroadcastmanager.content.LocalBroadcastManager;
import android.content.IntentFilter;
import com.facebook.react.bridge.ActivityEventListener;
import android.app.Activity;
import android.widget.Toast;
import android.preference.PreferenceManager;
import android.content.Context;
import com.github.nkzawa.socketio.client.Socket;

public class AsistensModule extends ReactContextBaseJavaModule implements ActivityEventListener{
    ConterSession conterSession;
    public static final String REACT_CLASS = "AsistensService";
    public static final int QRcodeWidth = 500;
    public static ReactApplicationContext reactContext;
    Context mContext;
    NotificationManager notificationManager;
    StorageReact storageReact;
    BootUpReceiver mBootUpReceiver;
    CounterReciver mCounterReciver;

    public AsistensModule(@Nonnull ReactApplicationContext reactContext, Context mContext) {
        super(reactContext);
        this.reactContext = reactContext;
        this.mContext = mContext;
        this.mBootUpReceiver = new BootUpReceiver();
        this.mCounterReciver = new CounterReciver();
        LocalBroadcastManager localBroadcastManager = LocalBroadcastManager.getInstance(reactContext);
        localBroadcastManager.registerReceiver(mBootUpReceiver, new IntentFilter("notification-press"));

    }

    @Nonnull
    @Override
    public String getName() {
        return REACT_CLASS;
    }

    public static String Akbar(){
        return "Akbar";
    }

    @ReactMethod
    public void startService() {
        if (!isMyServiceRunning(AsistensService.class)) {
            this.reactContext.startService(new Intent(this.reactContext, AsistensService.class));
        }
    }

    public void sendEvent (String eventName, @Nullable WritableMap params) {
        this.reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName, params);
    }   

    @ReactMethod
    public void panggilKa() {
        WritableMap params = Arguments.createMap();
        params.putString("eventProperty", "someValue");
    }

    @ReactMethod
    public void stopService() {
        this.reactContext.stopService(new Intent(this.reactContext, AsistensService.class));
    }

    @ReactMethod 
    public void sendDataSocket (String eventName, String dataEmit) {
        SocketIO mSocketIO = new SocketIO(this.mContext);
        Socket socket = mSocketIO.configSocket();
        socket.connect();
        socket.emit(eventName, dataEmit);
    }

    @ReactMethod
    public void startCounter() {
        conterSession = new ConterSession(this.reactContext); 
           if (!isMyServiceRunning(ConterService.class)) {
               this.reactContext.startService(new Intent(this.reactContext, ConterService.class)); 
           }
    }

    @ReactMethod
    public void getPertemuan(Callback booleanCallback) {
        storageReact = new StorageReact(this.reactContext);
        booleanCallback.invoke(storageReact.get_value("pertemuan"));
    }

    @ReactMethod
    public void getListImage(Callback fileCallBack) {
        JSONObject allFile = new JSONObject();
        JSONArray arrFileName = new JSONArray();
        final String[] columns = {MediaStore.Images.Media.DATA, MediaStore.Images.Media._ID};
        final String orderBy = MediaStore.Images.Media.DATE_TAKEN;
        Cursor imagecursor = reactContext.getContentResolver().query(
            MediaStore.Images.Media.EXTERNAL_CONTENT_URI, 
            columns, 
            null,
            null, 
            orderBy + " DESC"
        );
        
        try {
            for (int i = 0; i < imagecursor.getCount(); i++) {
                JSONObject fileNames = new JSONObject();
                imagecursor.moveToPosition(i);
                int dataColumnIndex = imagecursor.getColumnIndex(MediaStore.Images.Media.DATA);//get column index
                fileNames.put("name", imagecursor.getString(dataColumnIndex));
                arrFileName.put(fileNames);
                Log.e("Useless-Dev", fileNames.toString());
            }
            allFile.put("files", arrFileName);
        }catch (JSONException e) {
            e.printStackTrace();
        }
        fileCallBack.invoke(allFile.toString());
    }

    @ReactMethod
    public void setPertemuan(String value) {
        storageReact = new StorageReact(this.mContext);
        storageReact.set_value ("pertemuan", value);
    }

    @ReactMethod 
    public void setDataSocket(String key, String value){
        storageReact = new StorageReact(this.mContext);
        storageReact.set_value (key, value);
    }

    @ReactMethod
    public void deleteDataSocket() {
        storageReact = new StorageReact(this.mContext);
        storageReact.delete_value();
    }

    @ReactMethod 
    public void connectSocket() {
        // SocketIO mSocketIO = new SocketIO(this.mContext);
        // Socket socket = mSocketIO.configSocket();
        // socket.disconnect();
        // socket.connect();
        this.reactContext.startService(new Intent(this.reactContext, AsistensService.class));
    }

    @ReactMethod
    public void showNotif() {
        Intent notificationIntent = new Intent(this.reactContext, NotificationActifity.class);
        notificationIntent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TASK); 
        notificationIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        PendingIntent contentIntent = PendingIntent.getActivity(this.reactContext, 0, notificationIntent, PendingIntent.FLAG_CANCEL_CURRENT);
        NotificationCompat.Builder mBuilder = new NotificationCompat.Builder(this.reactContext)
            .setSmallIcon(R.drawable.logo)
            .setContentIntent(contentIntent)
            .setPriority(1)
            .setDefaults(Notification.DEFAULT_ALL)
            .setOngoing(true)
            .setContentTitle("My notification")
            .setContentText("Hello World!");
        NotificationManager mNotificationManager = (NotificationManager) this.reactContext.getSystemService(this.reactContext.NOTIFICATION_SERVICE);
        mNotificationManager.notify(001, mBuilder.build());
    }

    // @ReactMethod 
    public boolean isMyServiceRunning(Class<?> serviceClass) {
        ActivityManager manager = (ActivityManager) this.reactContext.getSystemService(this.reactContext.ACTIVITY_SERVICE);
        for (RunningServiceInfo service : manager.getRunningServices(Integer.MAX_VALUE)) {
            if (serviceClass.getName().equals(service.service.getClassName())) {
                return true;
            }
        }
        return false;
    }

    @ReactMethod 
    public void set_session_by_java (String key, String value) {
        storageReact = new StorageReact(this.reactContext);
        storageReact.set_value(key, value);
    }

    @ReactMethod 
    public void active(Boolean active) {
        PreferenceManager.getDefaultSharedPreferences(this.reactContext).edit().putBoolean("isActive", active).commit();
    }

    @Override
    public void onNewIntent(Intent intent) {}

    @Override
    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {}
}
