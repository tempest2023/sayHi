import React, { memo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types' ;
import Background from '../components/Background';
import Logo from '../components/Logo';
import Header from '../components/Header';
import Button from '../components/Button';
import TextInput from '../components/TextInput';
import MsgModal, { showModal, hideModal } from '../components/MsgModal';
import theme from '../theme';
import {
  emailValidator,
  passwordValidator,
  nameValidator,
} from '../utils';
import registry from '../apis/registry';

const styles = StyleSheet.create({
  label: {
    color: theme.colors.secondary,
  },
  button: {
    marginTop: 24,
  },
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  link: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
});

function RegisterScreen({ navigation }) {
  const [name, setName] = useState({ value: '', error: '' });
  const [email, setEmail] = useState({ value: '', error: '' });
  const [password, setPassword] = useState({ value: '', error: '' });
  const [msgTitle, setMsgTitle] = useState('');
  const [msg, setMsg] = useState('');
  const [visible, setVisible] = useState(false);
  const onSignUpPressed = async () => {
    const nameError = nameValidator(name.value);
    const emailError = emailValidator(email.value);
    const passwordError = passwordValidator(password.value);

    if (emailError || passwordError || nameError) {
      setName({ ...name, error: nameError });
      setEmail({ ...email, error: emailError });
      setPassword({ ...password, error: passwordError });
      return;
    }
    const res = await registry(email.value, password.value, name.value);
    if(!res || !res.success) {
      setMsg(res.errmsg || 'Network Error');
      setMsgTitle('Error');
      showModal(setVisible)
      return;
    }
    // registry success, navigate to login page
    setMsg('Registry Success');
    setMsgTitle('Info');
    showModal(setVisible)

    setTimeout(()=>{
      navigation.navigate('LoginScreen');
    },1500);
  };

  return (
    <Background position="containerCenter">
      <Logo />
      <Header>Create Account</Header>
      <MsgModal title={msgTitle} msg={msg} type='normal' okText='Got it' okCallback={() => hideModal(setVisible)} visible={visible} />
      <TextInput
        label="Name"
        returnKeyType="next"
        value={name.value}
        onChangeText={text => setName({ value: text, error: '' })}
        error={!!name.error}
        errorText={name.error}
      />

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

      <Button mode="contained" onPress={onSignUpPressed} style={styles.button}>
        Sign Up
      </Button>

      <View style={styles.row}>
        <Text style={styles.label}>Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
          <Text style={styles.link}>Login</Text>
        </TouchableOpacity>
      </View>
    </Background>
  );
}

RegisterScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
}

export default memo(RegisterScreen);
