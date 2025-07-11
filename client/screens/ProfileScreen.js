import React, { memo, useEffect, useState } from 'react';
import { View, Image } from 'react-native';
import PropTypes from 'prop-types';
import { emailValidator, nameValidator, ageValidator, genderValidator, usernameValidator } from '../utils';
import MsgModal, { showModal, hideModal } from '../components/MsgModal';
import Background from '../components/Background';
import Header from '../components/Header';
import TextInput from '../components/TextInput';
import tabs from './tabs';
import Button from '../components/Button';
import TabNavigation from '../components/TabNavigation';
import checkUserAuth from '../apis/checkUserAuth';
import updateProfile from '../apis/updateProfile';
import { saveData, secureSave } from '../apis/localStorage';

const defaultAvatar = require('../assets/default_avatar.png');

function ProfileScreen({ navigation }) {
  const [avatar, setAvatar] = useState(null);
  const [username, setUsername] = useState({ value: 'Username', error: '' });
  const [realname, setRealname] = useState({ value: 'RealName', error: '' });
  const [email, setEmail] = useState({ value: 'Email', error: '' });
  const [gender, setGender] = useState({ value: 'female', error: '' });
  const [age, setAge] = useState({ value: '0', error: '' });

  const [msgTitle, setMsgTitle] = useState('');
  const [msg, setMsg] = useState('');
  const [visible, setVisible] = useState(false);

  useEffect(()=>{
    const getUserProfile = async () => {
      const res = await checkUserAuth();
      if(!res || !res.success) {
        // retrieve user profile failed, navigate to login page
        console.log(`[debug] getUserProfile failed, navigate to login page, ${res.errno} ${res.errmsg}`);
        navigation.navigate('LoginScreen');
        return;  
      }
      console.log(`[debug] getUserProfile success, ${JSON.stringify(res)}`);
      const { data = {} } = res;
      if (data.avatar) {
        setAvatar(data.avatar);
      } 
      if (data.username) {
        setUsername({ value: data.username, error: '' });
      }
      if (data.realname) {
        setRealname({ value: data.realname, error: '' });
      }
      if (data.gender) {
        setGender({ value: data.gender, error: '' });
      }
      if (data.email) {
        setEmail({ value: data.email, error: '' });
      }
      if (data.age) {
        setAge({ value: String(data.age), error: '' });
      }
     }
    getUserProfile();
  }, [navigation])
  
  const onSendPressed = async () => {
    const emailError = emailValidator(email.value);
    const usernameError = usernameValidator(username.value);
    const realnameError = nameValidator(realname.value);
    const genderError = genderValidator(gender.value);
    const ageError = ageValidator(age.value);
    if (emailError) {
      setEmail({ ...email, error: emailError });
      return;
    }
    if (usernameError) {
      setUsername({ ...username, error: usernameError });
      return;
    }
    if (realnameError) {
      setRealname({ ...realname, error: realnameError });
      return;
    }
    if (genderError) {
      setGender({ ...gender, error: genderError });
      return;
    }
    if (ageError) {
      setAge({ ...age, error: ageError });
      return;
    }
    const res = await updateProfile({
      username: username.value,
      realname: realname.value,
      email: email.value,
      gender: gender.value,
      age: parseInt(age.value, 10),
    })
    if(!res || !res.success) {
      // update profile failed
      setMsg('Fail to update user profile.');
      setMsgTitle('Error');
      showModal(setVisible)
    }
    setMsg('Update user profile successfully.');
    setMsgTitle('Info');
    showModal(setVisible)
  };

  const onLogout = async () => {
    // login success, set token and userid
    await saveData('userid', '');
    await secureSave('token', '');
    navigation.navigate('HomeScreen');
  }

  return (
    <Background>
      <View className="flex-col justify-center items-center w-full h-20">
        <Image 
          source={avatar ? {uri: avatar} : defaultAvatar}
          className="w-16 h-16 rounded-full"
        />
      </View>
      
      <Header>{username.value}</Header>
      <TextInput label="UserName" value={username.value} onChangeText={text => setUsername({ value: text, error: '' })} autoCapitalize="none" error={!!username.error} errorText={username.error}/>
      <TextInput label="Real Name" value={realname.value} onChangeText={text => setRealname({ value: text, error: '' })} autoCapitalize="none" error={!!realname.error} errorText={realname.error}/>
      
      <TextInput
        label="email"
        returnKeyType="done"
        value={email.value}
        onChangeText={text => setEmail({ value: text, error: '' })}
        error={!!email.error}
        errorText={email.error}
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType="email-address"
      />

      <TextInput label="Gender" value={gender.value} onChangeText={text => setGender({ value: text, error: '' })} autoCapitalize="none" error={!!gender.error} errorText={gender.error}/>
      
      <TextInput label="Age" value={age.value} onChangeText={text => setAge({ value: text, error: '' })} autoCapitalize="none" error={!!age.error} errorText={age.error}/>

      <Button mode="contained" onPress={onSendPressed} style={{ marginTop: 12 }}>
        Update Profile
      </Button>
      <Button mode="contained" onPress={onLogout} style={{ marginTop: 12 }}>
        Logout
      </Button>
      <TabNavigation navigation={navigation} tabs={tabs} active="ProfileScreen" />
      <MsgModal title={msgTitle} msg={msg} type='normal' okText='Got it' okCallback={() => hideModal(setVisible)} visible={visible} />
    </Background>
  );
}

ProfileScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
}

export default memo(ProfileScreen);
