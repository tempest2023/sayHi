import React, { memo, useState } from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import PropTypes from 'prop-types';
import Background from '../components/Background';
import Logo from '../components/Logo';
import Header from '../components/Header';
import Button from '../components/Button';
import MsgModal, { showModal, hideModal } from '../components/MsgModal';
import TextInput from '../components/TextInput';
import { emailValidator, passwordValidator } from '../utils';
import login from '../apis/login';
import { saveData, secureSave } from '../apis/localStorage';

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
      <View className="w-full items-end mb-6">
        <TouchableOpacity
          onPress={() => {
            setMsg('Please contact with the operator: tar118@pitt.edu');
            setMsgTitle('Info');
            showModal(setVisible)
          }}
        >
          <Text className="text-secondary">Forgot your password?</Text>
        </TouchableOpacity>
      </View>
      <Button mode="contained" onPress={onLoginPressed}>
        Login
      </Button>
      <View className="flex-row mt-1">
        <Text className="text-secondary">Don&apos;t have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('RegisterScreen')}>
          <Text className="font-bold text-primary">Sign up</Text>
        </TouchableOpacity>
      </View>
    </Background>
  );
}

LoginScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
}

export default memo(LoginScreen);
