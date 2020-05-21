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
    windowHeightSize: (Dimensions.get('window').height)/*-(Header.HEIGHT)*/,
    windowWidthSize: Dimensions.get('window').width,
    styles: {
      touchAble: {
        marginTop: 32,
        marginHorizontal: 40,
        paddingHorizontal: 24,
        backgroundColor: '#2C3E50',
        borderRadius: 25,
        paddingVertical: 5,
      },
    },
    colors: {
      BackGround: '#1AACBC',
      Negative: '#BD1128',
      Positive: '#2FAD86',
      Neutral: '#D5B00C',
      Button: '#2C3E50',
      ButtonTextColor: '#AED6F1',
      ButtonText: '#AED6F1',
      ModalBackGround: '#14B1F8',
    },
};