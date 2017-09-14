import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

export const config = {
  apiKey: 'AIzaSyASPkpXZUbiW2d9Zim08qBrPaFFn9LraOI',
  authDomain: 'list-grouper.firebaseapp.com',
  databaseURL: 'https://list-grouper.firebaseio.com',
  projectId: 'list-grouper',
};
export const idKey = '.key';

export { firebase };
export const firebaseApp = firebase.initializeApp(config);
export const db = firebaseApp.database().ref('data');
