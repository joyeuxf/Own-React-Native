import { Keyboard } from 'react-native';

const helpers = {
    dismissKeyboard: function() {
        Keyboard.dismiss();
    },

    capitalize: function (s)  {
        if (s != undefined) {
            if (s.search('-') > 0) {
                var split = s.split('-');
                for (var i in split) {
                    split[i] = split[i].charAt(0).toUpperCase() + split[i].substring(1);
                }

                return split.join('-')
            }

            return s[0].toUpperCase() + s.slice(1);
        }
    }
}

export default helpers



