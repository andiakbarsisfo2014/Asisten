package com.asistens;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;


public class ConterSession {
    SharedPreferences sharedPreferences;
    SharedPreferences.Editor editor;
     Context context;

    int mode = 0;
    private static final String SESS_NAME = "Conter";
    private static final String isCount = "isCount";

    public ConterSession(Context context_){
        this.context = context_;
        sharedPreferences = context.getSharedPreferences(SESS_NAME,mode);
        editor = sharedPreferences.edit();
    }

    public void setSession(){
        editor.putInt(isCount,1);
        editor.commit();
    }

    public boolean checkSession(){
        if (this.isCount() == 1){
            return true;
        }
        else
            return false;
    }

    private Integer isCount(){
        return sharedPreferences.getInt(isCount, 1);
    }
}