import React, { memo, useEffect } from 'react';
import PropTypes from 'prop-types';
import Background from '../components/Background';
import Logo from '../components/Logo';
import Header from '../components/Header';
import Button from '../components/Button';
import Paragraph from '../components/Paragraph';
import checkUserAuth from '../apis/checkUserAuth';

function HomeScreen({ navigation }) {

  useEffect(()=>{
    // auto login with token
    const autoLogin = async () => {
      const res = await checkUserAuth();
      console.log('[debug] auto login', res);
      if(res && res.success) {
        navigation.navigate('PickScreen');
      }
    }
    autoLogin();
  }, [navigation])

  return <Background position="containerCenter">
    <Logo />
    <Header>Say Hi</Header>

    <Paragraph>
      The easiest way to start your social.
    </Paragraph>
    <Button mode="contained" onPress={() => navigation.navigate('LoginScreen')}>
      Login
    </Button>
    <Button
      mode="outlined"
      onPress={() => navigation.navigate('RegisterScreen')}
    >
      Sign Up
    </Button>
  </Background>
}

HomeScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default memo(HomeScreen);
