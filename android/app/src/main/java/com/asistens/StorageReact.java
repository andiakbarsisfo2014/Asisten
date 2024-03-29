package com.asistens;
import android.content.Context;
import android.content.Intent;
import com.facebook.react.bridge.ReactApplicationContext;
import android.content.SharedPreferences;

public class StorageReact {
    
    SharedPreferences sharedPreferences;
    SharedPreferences.Editor editor;
    Context context;

    public StorageReact (Context context){
        this.context = context;
        sharedPreferences = this.context.getSharedPreferences("Asistens", 0);
        editor = sharedPreferences.edit();
    }

    public void set_value (String key, String value){
        editor.putString(key,value);
        editor.commit();
    }

    public String get_value (String key) {
        return sharedPreferences.getString(key, "").toString();
    }

    public void delete_value() {
        sharedPreferences.edit().clear().commit();
    }
}