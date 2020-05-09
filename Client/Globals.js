import { Header } from 'react-navigation-stack';
import { Dimensions } from 'react-native';

export default {
  monthList: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ],
    windowHeightSize: (Dimensions.get('window').height)-(Header.HEIGHT),
};