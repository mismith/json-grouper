import moment from 'moment-mini';
import {
  firebase,
  db,
} from '@/helpers/firebase';

export default {
  data() {
    return {
      meRaw: undefined,
      meLoaded: false,
    };
  },
  computed: {
    me() {
      return this.meRaw;
    },
  },
  methods: {
    login() {
      return firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider());
    },
    logout() {
      return firebase.auth().signOut();
    },
  },
  created() {
    // handle user
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.$bindAsObject('meRaw', db.child(`users/${user.uid}`));
        // store/update user info
        const providerData = {
          ...user.providerData[0],
          _loggedin: moment().format(),
        };
        this.$firebaseRefs.meRaw.update(providerData);
        this.$firebaseRefs.meRaw.once('value').then(() => {
          this.meLoaded = true;
        });

        this.$emit('login');
      } else {
        if (this.$firebaseRefs && this.$firebaseRefs.meRaw) {
          this.$unbind('meRaw');
        }
        this.meLoaded = true;

        this.$emit('logout');
      }
    });
  },
};
