import React, { memo, useState } from 'react';
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import PropTypes from 'prop-types';
import Background from '../components/Background';
import Logo from '../components/Logo';
import Header from '../components/Header';
import Button from '../components/Button';
import MsgModal, { showModal, hideModal } from '../components/MsgModal';
import TextInput from '../components/TextInput';
import theme from '../theme';
import { emailValidator, passwordValidator } from '../utils';
import login from '../apis/login';
import { saveData, secureSave } from '../apis/localStorage';

const styles = StyleSheet.create({
  forgotPassword: {
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  label: {
    color: theme.colors.secondary,
  },
  link: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
});

function LoginScreen({ navigation }) {
  const [email, setEmail] = useState({ value: '', error: '' });
  const [password, setPassword] = useState({ value: '', error: '' });
  const [msgTitle, setMsgTitle] = useState('');
  const [msg, setMsg] = useState('');
  const [visible, setVisible] = useState(false);
  
  const onLoginPressed = async () => {
    const emailError = emailValidator(email.value);
    const passwordError = passwordValidator(password.value);

    if (emailError || passwordError) {
      setEmail({ ...email, error: emailError });
      setPassword({ ...password, error: passwordError });
      return;
    }
    const loginRes = await login(email.value, password.value);
    
    if(!loginRes || !loginRes.success) {
      setMsg('Wrong Password or Email.');
      setMsgTitle('Error');
      showModal(setVisible)
      // setNotification('Wrong Password or Email.');
      return;
    }
    // login success, set token and userid
    await saveData('userid', loginRes.data.userid);
    await secureSave('token', loginRes.data.token);
    navigation.navigate('PickScreen');
  };

  return (
    <Background position="containerCenter">
      <MsgModal title={msgTitle} msg={msg} type='normal' okText='Got it' okCallback={() => hideModal(setVisible)} visible={visible} />
      <Logo />
      <Header>Welcome back.</Header>
      <TextInput
        label="Email"
        returnKeyType="next"
        value={email.value}
        onChangeText={text => setEmail({ value: text, error: '' })}
        error={!!email.error}
        errorText={email.error}
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType="email-address"
      />
      <TextInput
        label="Password"
        returnKeyType="done"
        value={password.value}
        onChangeText={text => setPassword({ value: text, error: '' })}
        error={!!password.error}
        errorText={password.error}
        secureTextEntry
      />
      <View style={styles.forgotPassword}>
        <TouchableOpacity
          onPress={() => {
            setMsg('Please contact with the operator: tar118@pitt.edu');
            setMsgTitle('Info');
            showModal(setVisible)
          }}
        >
          <Text style={styles.label}>Forgot your password?</Text>
        </TouchableOpacity>
      </View>
      <Button mode="contained" onPress={onLoginPressed}>
        Login
      </Button>
      <View style={styles.row}>
        <Text style={styles.label}>Don’t have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('RegisterScreen')}>
          <Text style={styles.link}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </Background>
  );
}


LoginScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
}

export default memo(LoginScreen);
