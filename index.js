/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import AsistenService from './AsistenService';
const AsistenHeadless = async () => {
  var socket = await SocketIOClient('http://103.55.216.17:3000', {transports: ['websocket'], pingTimeout: 30000});
  socket.on('new_regist_client', (data) => {
    console.warn('msg','connected!');
    Heartbeat.showNotif();
  });


  // store.dispatch(setHeartBeat(true));
  // setTimeout(() => {
    // Heartbeat.showNotif();
    // store.dispatch(setHeartBeat(false));
  // }, 1000);
};
// AppRegistry.registerHeadlessTask('AsistenService', () => AsistenHeadless);
AppRegistry.registerComponent(appName, () => App);
