package com.asistens;
import java.net.URISyntaxException;
import com.github.nkzawa.socketio.client.IO;
import com.github.nkzawa.socketio.client.Socket;
import com.github.nkzawa.emitter.Emitter;
import android.util.Log;
import android.content.Context;
import com.facebook.react.bridge.ReactApplicationContext;
import org.json.JSONException;
import org.json.JSONObject;

public class SocketIO {
    private static final String protocol = "https:";
    private static final String ADDRESS = "gowtechno.com/akbar-app/web-API";
    private static final String SOCKET_ADDRESS = "asistensi.gowtehcno.com/socket.io";
    private static final String SOCKET_PORT = "3000";
    private static final String comeFrom = "mobile";
    StorageReact storageReact;
    Context mContext;
    String token = "";
    String loginAs = "";

    public SocketIO(Context mContext) {
        this.mContext = mContext;
        this.storageReact = new StorageReact(this.mContext);
        this.token = storageReact.get_value("token");
        this.loginAs = storageReact.get_value("loginAs");
    }

    public Socket configSocket()
    {
        Socket mSocket = null;
        try {
            IO.Options opts = new IO.Options();
            opts.timeout = 25 * 1000;
            opts.reconnection = true;
            opts.forceNew = true;
            opts.query  = "loginAs=" + this.loginAs + "&token=" + this.token +"&comeFrom=mobile";
            opts.transports = new String[] {"websocket"};
            opts.upgrade = false;
            mSocket = IO.socket("http://103.55.216.17:3000", opts);
        } catch (URISyntaxException e) {
        }
        return mSocket;
    }

    public Boolean allowConnect() {
        if(this.token == "") {
            return false;
        }
        else{
            return true;
        }
    }

    public String api_path() {
        return protocol + "//" + ADDRESS + "/public/api/";
    }
}