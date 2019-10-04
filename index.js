/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import AsistensService from './AsistensService';
// import Other from './src/screens/Praktikum';
const AsistenHeadless = async () => {
  // var socket = await SocketIOClient('http://103.55.216.17:3000', {transports: ['websocket'], pingTimeout: 30000});
  // socket.on('new_regist_client', (data) => {
  //   console.warn('msg','connected!');
  //   Heartbeat.showNotif();
  // });
  alert('fuck');
  AsistensService.showNotif();

  // store.dispatch(setHeartBeat(true));
  // setTimeout(() => {
    // Heartbeat.showNotif();
    // store.dispatch(setHeartBeat(false));
  // }, 1000);
};
const Other = () => {
  console.warn('msg',this.props)
  return (
    null
  )
}
AsistensService.startService();
AppRegistry.registerHeadlessTask('AsistensService', () => AsistenHeadless);
AppRegistry.registerComponent(appName, () => App);
AppRegistry.registerComponent('Coba', () => Other);
