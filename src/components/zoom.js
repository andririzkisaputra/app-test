import React, { PureComponent } from 'react';
import { View, Image, StyleSheet, ScrollView } from 'react-native';
import { Layout, Icon, Input, Button, Text, Spinner } from '@ui-kitten/components';
import { Header, Container } from '../theme';
import { URL_UPLOAD } from '../config';
import ImageViewer from 'react-native-image-zoom-viewer';
import t from '../lang';

export default class Zoom extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      currentPicture : '',
      currentIndex   : ((this.props.params.currentIndex) ? this.props.params.currentIndex : 0)
    }

    this.source = this.props.params.source;
    this.images = [];

    if (this.source) {
      if (typeof this.source == 'string' || this.source instanceof String) {
        this.source = ((this.source.indexOf('thumb_') !== -1) ? this.source.replace('thumb_', '') : this.source);
        this.images[0] = {url : ((this.source.indexOf(URL_UPLOAD) !== -1) ? this.source : URL_UPLOAD+'/'+this.source)}
      }else {
        this.source.forEach((row, index) => {
          row = ((row.indexOf('thumb_') !== -1) ? row.replace('thumb_', '') : row);
          this.images[index] = {url : ((row.indexOf(URL_UPLOAD) !== -1) ? row : URL_UPLOAD+'/'+row)};
        });
      }
    }
  }

  render() {
    return (
      <Container>
          <ImageViewer
            imageUrls={this.images}
            loadingRender={this.loader}
            renderHeader={() => this.renderHeader()}
            renderFooter={() => this.renderFooter(this.images)}
            index={this.state.currentIndex}
            renderIndicator={(currentIndex?: number, allSize?) => {}}
            onChange={async (index) => {
              this.setState({ currentPicture: this.images[index], currentIndex: index });
            }}
            enableSwipeDown={true}
            backgroundColor={'black'}
            onCancel={() => this.props.navigation.pop()}
          />
      </Container>
    );
  }

  renderFooter = (img) => {
    return (
      <View style={{margin : 10, paddingVertical: 4, paddingHorizontal : 10, backgroundColor : 'rgba(226,226,226,0.7)', borderRadius : 20}}>
        <Text style={{fontFamily : 'opensans-regular'}} category="c2">{(this.state.currentIndex+1)}/{img.length}</Text>
      </View>
    );
  }

  renderHeader = (type) => {
    return (
      <View/>
    );
  }

  loader = () => {
    return (
      <View style={{ height: 240 }}>
        <Spinner />
      </View>
    )
  }

}

const stylex = StyleSheet.create({
  image: {
    flex:1,
    height: undefined,
    width: undefined,
    resizeMode: 'cover',
  },
  container_left_right : {
    flexDirection: 'row'
  },
  left_content : {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  right_content : {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop:2
  },
  container: {
    flex: 1,
    marginTop:10,
    marginLeft:20,
    marginRight:20,
    marginBottom:20
  },
  container_video : {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:'transparent'
  }
});
