import React, { Component } from 'react';
import { View } from 'react-native';
import { Container, Header } from '../../theme';
import { Layout, Text } from '@ui-kitten/components';
import { connect } from 'react-redux';
import t from '../../lang';

class Bantuan extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Container>

      </Container>
    )
  }

}

const mapStateToProps = state => ({state: state});
const mapDispatchToProps = dispatch => ({

});
export default connect(mapStateToProps, mapDispatchToProps)(Bantuan);
