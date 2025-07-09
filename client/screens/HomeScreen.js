import React, { useEffect, memo } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import PropTypes from 'prop-types';
import Background from '../components/Background';
import Logo from '../components/Logo';
import Header from '../components/Header';
import Button from '../components/Button';
import Paragraph from '../components/Paragraph';
import checkUserAuth from '../apis/checkUserAuth';
import { spacing, colors } from '../theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
  },
  title: {
    marginBottom: spacing.lg,
  },
  description: {
    marginBottom: spacing.xl,
  },
  loginButton: {
    marginBottom: spacing.md,
  },
  signupButton: {
    marginBottom: spacing.md,
  },
});

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

  return (
    <Background position="containerCenter" style={styles.container}>
      <Logo />
      <Header variant="h1" style={styles.title}>Say Hi</Header>

      <Paragraph variant="body1" style={styles.description}>
        The easiest way to start your social journey and connect with amazing people.
      </Paragraph>
      
      <Button 
        mode="contained" 
        size="large"
        onPress={() => navigation.navigate('LoginScreen')}
        style={styles.loginButton}
        accessibilityLabel="Login to your account"
      >
        Login
      </Button>
      
      <Button
        mode="outlined"
        size="large"
        onPress={() => navigation.navigate('RegisterScreen')}
        style={styles.signupButton}
        accessibilityLabel="Create a new account"
      >
        Sign Up
      </Button>
    </Background>
  );
}

HomeScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default memo(HomeScreen);
