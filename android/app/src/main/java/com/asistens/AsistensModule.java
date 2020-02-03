package com.asistens;

import android.content.Intent;

import com.facebook.react.bridge.Callback;
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

import com.google.zxing.BarcodeFormat;
import com.google.zxing.MultiFormatWriter;
import com.google.zxing.WriterException;
import com.google.zxing.common.BitMatrix;

import android.graphics.Bitmap;

public class AsistensModule extends ReactContextBaseJavaModule {
    ConterSession conterSession;
    public static final String REACT_CLASS = "AsistensService";
    public static final int QRcodeWidth = 500;
    private static ReactApplicationContext reactContext;
    NotificationManager notificationManager;
    StorageReact storageReact;

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
    public void getMyQrCode(Callback bitmapCallBack){
       BitMatrix bitMatrix;
        try {
            bitMatrix = new MultiFormatWriter().encode("Akbar", BarcodeFormat.DATA_MATRIX.QR_CODE, this.QRcodeWidth, this.QRcodeWidth, null);
            int bitMatrixWidth = bitMatrix.getWidth();
            int bitMatrixHeight = bitMatrix.getHeight();
            int[] pixels = new int[bitMatrixWidth * bitMatrixHeight];
            for (int y = 0; y < bitMatrixHeight; y++) {
                int offset = y * bitMatrixWidth;
                for (int x = 0; x < bitMatrixWidth; x++) {
                    pixels[offset + x] = bitMatrix.get(x, y) ?
                            reactContext.getResources().getColor(R.color.QRCodeBlackColor): reactContext.getResources().getColor(R.color.QRCodeWhiteColor);
                }
            }
            Bitmap bitmap = Bitmap.createBitmap(bitMatrixWidth, bitMatrixHeight, Bitmap.Config.ARGB_4444);
            bitmap.setPixels(pixels, 0, 500, 0, 0, bitMatrixWidth, bitMatrixHeight);
            bitmapCallBack.invoke(bitmap);
        } catch (Exception e) {

        }
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
        // String path = Environment.getExternalStorageDirectory().toString()+"/Pictures";
        // File directory = new File(path);
        // File[] files = directory.listFiles();
        
        JSONObject allFile = new JSONObject();
        JSONArray arrFileName = new JSONArray();
        // try {
        //     for (int i = 0; i < files.length; i++){
        //         fileNames.put("fileName", files[i].getName());
        //         arrFileName.put(fileNames);
        //     }
        //     allFile.put("files", arrFileName);
        // } catch (JSONException e) {
        //     e.printStackTrace();
        // }
        // fileCallBack.invoke(allFile.toString());

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
        storageReact = new StorageReact(this.reactContext);
        storageReact.set_value ("pertemuan", value);
    }

    @ReactMethod
    public void showNotif () {
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

    @ReactMethod 
    public boolean isMyServiceRunning(Class<?> serviceClass) {
        ActivityManager manager = (ActivityManager) this.reactContext.getSystemService(this.reactContext.ACTIVITY_SERVICE);
        for (RunningServiceInfo service : manager.getRunningServices(Integer.MAX_VALUE)) {
            if (serviceClass.getName().equals(service.service.getClassName())) {
                return true;
            }
        }
        return false;
    }
}
