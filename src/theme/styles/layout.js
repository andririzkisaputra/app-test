import color from '../json/custom-theme.json';
import { StyleSheet } from 'react-native';
export const hairlineWidth = StyleSheet.hairlineWidth;

export default {
  offlineContainer: {
    backgroundColor: color['color-primary-500'],
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    zIndex : 999,
    position: 'absolute',
    bottom: 0
  },
  offlineText: {
    color: '#fff'
  },
  container : {
    flex : 1
  },
  containerScroll : {
    flexGrow: 1,
    justifyContent: 'center'
  },
  title : {
    fontSize : 20,
    fontFamily : 'OpenSans-Bold',
    color : '#303033',
    marginLeft : 8,
    lineHeight : 28
  },
  navBottom : {
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity:  0.4,
    shadowRadius: 3,
    elevation: 5,
  },
  bold : {
    fontFamily : 'OpenSans-Bold'
  },
  semiBold : {
    fontFamily : 'OpenSans-SemiBold'
  },
  medium : {
    fontFamily : 'OpenSans-Medium'
  },
  regular : {
    fontFamily : 'OpenSans-Regular'
  },
  spinner : {
    flex : 1,
    justifyContent : 'center',
    alignItems : 'center',
    padding : 16
  },
  actionSheetHeader : {
    height : 8,
    width : 50,
    backgroundColor: '#f8f9fd',
    borderWidth : 1,
    borderColor : '#eaebef',
    borderRadius : 18
  },
  actionSheet : {
    overlay: {
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      opacity: 0.4,
      backgroundColor: '#000'
    },
    wrapper: {
      flex: 1,
      flexDirection: 'row'
    },
    body: {
      flex: 1,
      alignSelf: 'flex-end',
      backgroundColor: '#fff',
      borderTopLeftRadius : 16,
      borderTopRightRadius : 16,
      paddingHorizontal: 15
    },
    titleBox: {
      height : 40,
      paddingHorizontal : 16,
      backgroundColor: '#fff',
      borderTopLeftRadius : 16,
      borderTopRightRadius : 16
    },
    titleText: {
      color: '#8F9BB3',
      fontFamily: 'OpenSans-SemiBold',
      fontSize: 13
    },
    buttonBox: {
      height: 55,
      // paddingHorizontal : 16,
      marginTop: 0,
      alignItems: 'flex-start',
      justifyContent: 'center',
      backgroundColor: '#fff'
    },
    buttonText: {
      fontFamily: 'OpenSans-SemiBold',
      fontSize: 16
    },
    cancelButtonBox: {
      height : 40,
      marginTop : 10,
      marginBottom : 10,
      marginHorizontal : 16,
      borderRadius : 50,
      backgroundColor: '#f8f9fd',
      borderWidth : 1,
      borderColor : '#eaebef'
    }
  },
  tabbar: {
    backgroundColor: '#fff',
    elevation: 0,
  },
  label: {
    fontFamily: 'OpenSans-SemiBold',
    textTransform:'capitalize',
    color: '#8F9BB3',
  },
  indicator: {
    backgroundColor: color['color-primary-500'],
    height : 3,
    borderRadius : 4
  },
  btnFloating : color['color-primary-500']
}
