import {Toast} from 'native-base';

class Notify {
  error(text, e) {
    console.log(e);
    Toast.show({
      text,
      type: 'danger',
      textStyle: {
        textAlign: 'center',
      },
    });
  }
}

export default new Notify();
