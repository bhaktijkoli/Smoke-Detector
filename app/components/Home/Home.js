import React, { Component } from 'react';
import { Alert, StatusBar } from 'react-native';
import RNExitApp from 'react-native-exit-app';
import { Container, Header, Content, Button, Text, Icon } from 'native-base';
import { Grid, Row, Col, H3 } from 'native-base';
import { Spinner} from 'native-base';
import { NavigationActions } from 'react-navigation'

import axios from 'axios'

import Mqtt from './../../utils/mqtt';
import Styles from './../../utils/styles';

const WifiScanAction = NavigationActions.reset({ index: 0, actions: [ NavigationActions.navigate({ routeName: 'WifiScan' }) ] })

class Home extends Component {
  static navigationOptions = {
    header: null,
  };
  constructor(props) {
    super(props);
    this.state = {
      address: '',
      connectionState: 0,
      data: {}
    };
  }
  componentDidMount() {
    global.errorShow = false;
    this.setState({connectionState: 0});
    axios.get('http://192.168.4.1/').then((res)=>{
      if(res.data == "1") { this.props.navigation.dispatch(WifiScanAction) }
    });
    setTimeout(function () {
      this.setState({connectionState: 2});
      Mqtt.init();
    }.bind(this), 5000);
  }
  componentWillUnmount() {

  }
  render() {
    if(this.state.connectionState == 0) {
      return(
        <Container style={Styles.container}>
          <StatusBar barStyle="light-content"/>
          <Grid>
            <Col style={{marginTop:'50%'}}>
              <Spinner color="white"/>
            </Col>
          </Grid>
        </Container>
      )
    }
    if(this.state.connectionState == 1) {
      return(
        <Container style={Styles.container}>
          <StatusBar barStyle="light-content"/>
        </Container>
      )
    }
    return(
      <Container style={Styles.container}>
        <StatusBar barStyle="light-content"/>
        <Content style={Styles.mgtop}>
          <Grid>
            <Col style={{marginTop:'50%', alignItems:'center'}}>
              <Text>You will now recieve notification.</Text>
            </Col>
          </Grid>
        </Content>
      </Container>
    )
  }
  callForError() {
    this.setState({connectionState: 1});
    if(global.errorShow == true) return;
    global.ws = null;
    global.zeroconf = null;
    global.errorShow = true;
    Alert.alert(
      'No Device Found',
      'We where not able to find any switch devices.',
      [
        {text: 'Retry', onPress: () => {
          global.errorShow = false;
          this.componentDidMount();
        }},
        {text: 'Cancel', onPress: () => RNExitApp.exitApp(), style: 'cancel'},
      ],
      { cancelable: false }
    )
  }
}

export default Home;
