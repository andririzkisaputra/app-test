import color from '../json/custom-theme.json';
import { StyleSheet } from 'react-native';

export default {
  containerInner : {
    paddingHorizontal : 16
  },
  containerHome : {
    marginTop : 16
  },
  row : {
    flexDirection : 'row',
    justifyContent : 'space-between'
  },
  containerHeader2 : {
    flexDirection : 'row',
    alignItems : 'center',
  },
  containerHeaderTop : {
    flexDirection : 'row',
    alignItems : 'center',
    justifyContent : 'space-between',
    marginBottom : 16
  },
  iconRekomen : {
    height: 22,
    width : 22,
    marginRight : 6,
    color : color['color-danger-500']
  },
  iconProfile : {
    height: 15,
    width : 15,
    color : '#adadad'
  },
  containerList : {
    marginVertical : 8
  },
  containerInnerList : {
    flexDirection : 'row',
    alignItems : 'center',
    flex : 1
  },
  rowCenter : {
    flexDirection : 'row',
    justifyContent : 'space-between',
    alignItems : 'center',
  },
  iconUser : {
    height : 16,
    color : '#8F9BB3',
  },
  shadow : {
    paddingHorizontal : 15,
    paddingVertical : 8,
    backgroundColor : 'white',
    marginVertical:10,
    borderRadius:5
  },
  buttonBayar : {
    alignItems: 'flex-end',
    borderTopWidth : 1,
    borderColor : '#EDF1F7'
  },
  marginTop7 : {
    marginTop : 7
  },
  headerTagihan : {
    flexDirection: "row",
    justifyContent : 'space-between',
    marginBottom: 4,
    alignItems: 'center'
  },
  bottomList : {
    paddingVertical : 4,
    flexDirection : 'row',
    justifyContent : 'space-between',
    alignItems : 'center',
    borderTopWidth : 1,
    borderColor : '#EDF1F7'
  },
  listTagihan : {
    flexDirection: "row",
    justifyContent : 'space-between',
    marginVertical: 5
  },
  paddingVertical2 : {
    paddingVertical : 2
  },
  avatarImg2 : {
    width : 45,
    height : 45,
    resizeMode : 'contain'
  },
  listItemImg : {
    marginRight : 16,
    width : 140,
    height : 100,
    borderRadius : 12
  },
  listItemImgSewa : {
    marginRight : 16,
    width : 120,
    height : 90,
    borderRadius : 12
  },
  containerItem  : {
    flexDirection : 'column',
    justifyContent : 'space-between',
    flex : 1
  },
  listTitle : {
    fontSize : 15,
    marginBottom : 6
  },
  containerListGame : {
    flexDirection : 'row',
    alignItems : 'center'
  },
  imgListGame : {
    width : 40,
    height : 40,
    resizeMode : 'contain'
  },
  listDesc : {
    lineHeight : 20
  },
  containerCoin : {
    marginTop : 6,
    flexDirection : 'row',
    justifyContent : 'flex-start',
    alignItems : 'center'
  },
  iconCoin : {
    height: 16,
    width : 16,
    color : color['color-primary-500'],
    marginRight : 2
  },
  iconFilter : {
    height: 20,
    width : 20,
    color : color['color-primary-500'],
    marginRight : 2
  },
  iconCoin2 : {
    height: 16,
    width : 16,
    color : color['color-danger-500'],
    marginRight : 2
  },
  iconStar : {
    height: 14,
    width : 14,
    color : color['color-warning-500']
  },
  coin : {
    color : '#ff9e11'
  },
  pageIndicator : {
    position : 'absolute',
    right : 10
  },
  indicatorActive : {
    backgroundColor : 'white'
  },
  headerIcon : {
    width : 24,
    height : 24,
    color : '#303033'
  },
  containerIconHome1 : {
    marginRight : 8
  },
  containerIconHome2 : {
    marginHorizontal : 8
  },
  containerIconHome : {
    flexDirection : 'row',
    alignItems : 'center'
  },
  containerRating : {
    position : 'absolute',
    bottom : 8,
    left : 8,
    backgroundColor : 'rgba(0,0,0,0.5)',
    borderRadius : 6,
    flexDirection : 'row',
    alignItems  : 'center',
    paddingHorizontal : 6
  },
  containerListKamar : {
    position : 'absolute',
    bottom : 0,
    left : 0,
    backgroundColor : 'rgba(0,0,0,0.5)',
    borderBottomLeftRadius : 6,
    flexDirection : 'row',
    alignItems  : 'center',
    paddingHorizontal : 6
  },
  containerRatingFix : {
    backgroundColor : 'rgba(0,0,0,0.5)',
    borderRadius : 6,
    flexDirection : 'row',
    alignItems  : 'center',
    justifyContent : 'center',
    paddingHorizontal : 6,
    paddingVertical : 4,
    alignSelf : 'flex-start'
  },
  iconStarMargin : {
    marginRight : 2
  },
  sumRating : {
    color : 'white'
  },
  textCoin : {
    color : 'white',
    lineHeight : 16.5
  },
  containerSearchHome : {
    backgroundColor : '#eef4f9',
    paddingHorizontal : 16,
    paddingVertical : 8,
    borderRadius : 18,
    marginBottom : 16,
    flexDirection : 'row',
    alignItems : 'center',
    justifyContent : 'space-between'
  },
  iconSearch : {
    width : 20,
    height : 20,
    marginRight : 8,
    color : '#8F9BB3'
  },
  containerGridGame : {
    flexDirection : 'row',
    justifyContent : 'space-between',
    alignItems : 'center',
    flexWrap : 'wrap',
    marginHorizontal : -16
  },
  containerGame : {
    flexDirection : 'column',
    justifyContent : 'center',
    alignItems : 'center',
    marginHorizontal : 16,
    marginBottom : 16
  },
  containerImgGame : {
    backgroundColor : '#eef4f9',
    borderRadius : 30,
    marginBottom : 6,
    justifyContent : 'center',
    alignItems : 'center',
    width : 85,
    height : 85,
  },
  containerImg : {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    marginHorizontal: 5,
    width: 105,
    height: 105,
    borderWidth: 2,
    borderRadius: 18,
    borderStyle: 'dashed'
  },
  imgGame : {
    width : 70,
    height : 70,
    resizeMode : 'contain'
  },
  iconMore : {
    width : 40,
    height : 40,
    color : '#f6c724'
  },
  iconController : {
    color : '#f6c724'
  },
  loginPage : {
    marginBottom : '40%'
  },
  loginHeader : {
    flexDirection : 'column',
    justifyContent : 'space-around',
    alignItems : 'center'
  },
  loginImg : {
    width : 200,
    height : 200
  },
  registerInput : {
    borderRadius : 18,
    paddingVertical : 12,
    flex : 1
  },
  alamatInput : {
    textAlignVertical : 'top',
    paddingVertical : 4,
    fontSize : 18,
    height : 100
  },
  peraturanInput : {
    textAlignVertical : 'top',
    paddingVertical : 4,
    fontSize : 18,
    maxHeight : 100
  },
  loginText : {
    textAlign : 'center',
    marginVertical : 20
  },
  loginInputContainer : {
    flexDirection : 'row',
    alignItems : 'center'
  },
  loginCodeCountryContainer : {
    marginLeft : 8,
    flexDirection : 'row',
    alignItems : 'center'
  },
  loginImgCountry : {
    width : 30,
    height : 19,
    borderWidth : 1,
    borderColor : '#d0d0d0'
  },
  loginTextCountry  : {
    paddingLeft : 4,
    fontSize : 18
  },
  loginInput : {
    borderRadius : 18,
    paddingVertical : 10,
    flex : 1
  },
  loginTextInput : {
    paddingVertical : 4,
    fontSize : 18
  },
  loginUnderlineStyleBase: {
    width: 40,
    height: 60,
    borderWidth: 0,
    borderBottomWidth: 2,
    fontSize : 30,
    fontWeight : 'normal',
    fontFamily : 'OpenSans-Bold',
    color : '#303033',
  },
  loginUnderlineStyleHighLighted: {
    borderColor: color['color-primary-500'],
  },
  pinContainer : {
    marginTop : '10%',
    marginHorizontal : 16
  },
  containerList : {
    marginTop : '3%',
    marginHorizontal : 16
  },
  btnKirim : {
    textAlign : 'right'
  },
  iconTextHome : {
    marginTop : 0,
    marginBottom : 6
  },
  pb16 : {
    paddingBottom : 16
  },
  pb8 : {
    paddingBottom : 10
  },
  containerHeader : {
    flexDirection : 'row',
    justifyContent : 'space-between',
    alignItems : 'center',
    backgroundColor : '#eef4f9',
    borderRadius : 12,
    padding : 14,
    marginBottom : 16
  },
  containerHeaderLeft : {
    flexDirection : 'row',
    alignItems : 'center'
  },
  containerHeaderIcon : {
    backgroundColor : '#60B8D6',
    justifyContent : 'center',
    alignItems : 'center',
    borderRadius : 60,
    height : 60,
    width : 60
  },
  containerManagementIcon : {
    backgroundColor : '#60B8D6',
    justifyContent : 'center',
    alignItems : 'center',
    borderRadius : 18,
    height : 80,
    width : 80
  },
  containerHeaderImage : {
    justifyContent : 'center',
    alignItems : 'center',
    marginVertical: 10,
    width: 105,
    height: 105,
    borderWidth: 2,
    borderRadius: 18,
    borderStyle: 'dashed'
  },
  iconAvatarProfile : {
    height : 28,
    width : 28,
    color : 'white'
  },
  containerTextHeader : {
    flexDirection : 'column',
    justifyContent : 'center',
    marginLeft : 16,
    width: '55%'
  },
  iconHeaderRight  : {
    height : 28,
    width : 28,
    color : '#303033'
  },
  iconAvatarProfileImg : {
    height : 60,
    width : 60,
    borderRadius : 60,
  },
  iconSewaKosan : {
    height : 20,
    width : 20,
    borderRadius : 5,
    marginRight: 10,
  },
  iconSearchPage : {
    width : 20,
    height : 20,
  },
  containerIconSearch : {
    alignItems: 'center',
    flexDirection : 'row',
    marginRight : 10
  },
  textPrimary : {
    color : color['color-primary-500'],
  },
  containerHeaderSearch : {
    flexDirection : 'row',
    justifyContent : 'space-between',
    alignItems : 'center'
  },
  searchTextInput : {
    paddingVertical : 0,
    fontSize : 15
  },
  searchInput : {
    borderRadius : 90,
    marginRight : 5,
    flex : 1
  },
  imgKamar : {
    height : 60,
    width : 100,
    borderRadius : 5,
  },
  listHeader : {
    fontSize : 16
  },
  containerMenuProf : {
    flexDirection : 'row',
    alignItems : 'center',
    justifyContent : 'space-between',
    marginVertical : 12,
  },
  containerIconProf : {
    alignItems : 'center',
    justifyContent : 'center',
  },
  containerIconMenu : {
    backgroundColor : '#eef4f9',
    height : 60,
    width : 60,
    borderRadius : 16,
    alignItems : 'center',
    justifyContent : 'center',
    marginBottom : 4
  },
  iconMenuProf : {
    height : 34,
    width : 34,
    color : '#60B8D6'
  },
  iconKomplain : {
    color : color['color-danger-500']
  },
  iconPengeluaran : {
    color : color['color-info-500']
  },
  iconBukti : {
    color : color['color-success-500']
  },
  containerKamarku : {
    flex : 1,
    borderRadius : 12,
    padding : 14,
    marginBottom : 16,
    backgroundColor : 'white',
    borderWidth : 1,
    borderColor : '#eef4f9',
    flexDirection : 'column'
  },
  imgKamarku : {
    height : 70,
    width : 70,
    borderRadius : 70/2
  },
  imgKamarku2 : {
    height : 80,
    width : 80,
    borderRadius : 8
  },
  footerKamarku : {
    paddingHorizontal: 14,
    paddingVertical : 6,
    backgroundColor : '#eef4f9',
    borderBottomLeftRadius : 12,
    borderBottomRightRadius : 12,
    marginBottom : -14,
    marginHorizontal : -14,
    flexDirection : 'row',
    justifyContent : 'space-between',
    alignItems : 'center'
  },
  iconInfo : {
    height : 18,
    width : 18,
    color : color['color-primary-500']
  },
  containerInfo : {
    flexDirection : 'row',
    alignItems : 'center'
  },
  containerInfoIcon : {
    backgroundColor : '#eef4f9',
    padding : 8,
    height : 36,
    width : 36,
    borderRadius : 36,
    marginRight : 8,
    alignItems : 'center',
    justifyContent : 'center'
  },
  containerInfoketer : {
    flexDirection : 'row',
    alignItems : 'center'
  },
  btnCheckin : {
    width : '100%',
    paddingVertical : -20
  },
  containerBottomBtn : {
    flexDirection : 'row',
    alignItems : 'center',
    justifyContent : 'space-between',
    marginHorizontal : 14
  },
  containerBottomKosKiri : {
    flexDirection : 'row',
    alignItems : 'center',
    justifyContent : 'space-between',
    marginRight : 5,
    marginLeft : 10
  },
  containerBottomKosKanan : {
    flexDirection : 'row',
    alignItems : 'center',
    justifyContent : 'space-between',
    marginLeft : 5,
    marginRight : 10
  },
  avatarComment : {
    tintColor : null,
    height : 40,
    width : 40
  },
  listComment : {
    marginHorizontal : -7
  },
  pageRegister : {
    borderWidth: 1,
    borderRadius: 50,
    paddingHorizontal: 7,
    paddingVertical: 2,
    fontSize: 13,
    borderColor: '#ebeef5',
    color: '#8F9BB3',
    backgroundColor: '#f7f9fc',
    fontWeight: 'bold'
  },
  button : {
    marginHorizontal: 25,
    borderColor: '#77c2dc',
    backgroundColor: '#60b8d6',
    borderWidth: 1,
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5
  },
  listFasilitas : {
    borderWidth: 1,
    maxHeight: 145,
    borderRadius: 18,
    paddingLeft: 15,
    marginVertical: 10,
    borderColor: '#ebeef5',
    backgroundColor: '#f7f9fc'
  },
  itemFasilitas : {
    flexDirection: 'row',
    marginVertical: 7
  },
  imgList : {
    marginVertical: 10,
    width: 90,
    padding: 30,
    borderWidth: 2,
    borderRadius: 18,
    borderStyle: 'dashed'
  },
  iconList : {
    width: 35,
    color: '#8F9BB3'
  },
  iconKamar : {
    height: 16,
    width : 16,
    color : color['color-primary-500'],
    marginRight : 2
  },
  containerFilter : {
    paddingBottom : 10,
    flexDirection : 'row',
    alignItems : 'center',
    justifyContent : 'space-between',
    // borderTopWidth : 1,
    borderBottomWidth : 1,
    borderColor : '#f0f0f0'
  },
  buttonFilter : {
    flexDirection : 'row',
    marginLeft : 16,
  },
  textBasic : {
    color : '#aab3c5'
  },
  borderFilterRight : {
    height : 35,
    width : 1,
    marginRight : 8
  },
  borderFilter : {
    height : 20,
    width : 1,
    marginLeft : 8
  },
  containerFilterList : {
    paddingHorizontal : 4
  },
  containerInputBersih : {
    borderWidth: 1,
    borderRadius: 18,
    backgroundColor: '#f7f9fc',
    marginVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  buttonMenuFilter : Platform.select({
    ios: {
      borderRadius : 16,
      marginHorizontal : 5,
      paddingHorizontal : 14,
      paddingVertical : 4,
      fontSize : 11,
      fontFamily : 'opensans-regular',
      borderWidth : 1,
      borderColor : '#a1a1a1',
      color : '#979ead',
      overflow: 'hidden'
    },
    android: {
      borderRadius : 25,
      marginHorizontal : 5,
      paddingHorizontal : 14,
      paddingVertical : 4,
      fontSize : 11,
      fontFamily : 'opensans-regular',
      borderWidth : 1,
      borderColor : '#a1a1a1',
      color : '#979ead',
    },
  }),
  buttonMenuFilterActive : {
    backgroundColor : color['color-primary-transparent-200'],
    color: color['color-primary-500'],
    borderColor: color['color-primary-transparent-200'],
    fontFamily : 'opensans-semibold'
  },
  dotNotif : {
    height : 8,
    width : 8,
    borderRadius : 8,
    backgroundColor : 'red',
    position : 'absolute',
    top : 8,
    right : 8
  },
  listTipeKamar : {
    marginRight: 9, 
    marginBottom: 16, 
    padding: 5,  
    borderRadius: 10,
    backgroundColor: '#eef4f9'
  }
}
