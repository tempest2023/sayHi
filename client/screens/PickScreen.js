import React, { memo, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { View, Image, Text } from 'react-native';
import MsgModal, { showModal, hideModal } from '../components/MsgModal';
import randomPickUp from '../apis/pickup';
import Background from '../components/Background';
import Paragraph from '../components/Paragraph';
import Button from '../components/Button';
import TabNavigation from '../components/TabNavigation';
import tabs from './tabs';
import { getData } from '../apis/localStorage';

const defaultAvatar = require('../assets/default_avatar.png');

function PickScreen({ navigation }) {
  const [stranger, setStranger] = useState(null);
  const [msgTitle, setMsgTitle] = useState('');
  const [msg, setMsg] = useState('');
  const [visible, setVisible] = useState(false);

  const skip = async () => {
    const randomPickUpExceptMe = async () => {
      const res = await randomPickUp();
      if(!res || !res.success) {
        setMsgTitle('Error');
        setMsg(res.errmsg || 'Network Error');
        showModal(setVisible);
        return null;
      }
      const userid = await getData('userid');
      const info = res.data[0];
      if (info.userid === userid) {
        const nextOne = await randomPickUpExceptMe();
        return nextOne;
      }
      return info;
    }
    const info = await randomPickUpExceptMe();
    setStranger(info);
  }

  const chat = () => {
    navigation.navigate('ChatScreen', { userid: stranger.userid });
  }

  useEffect(() => {
    const randomPickUpExceptMe = async () => {
      const res = await randomPickUp();
      if (!res || !res.success) {
        setMsgTitle('Error');
        setMsg(res.errmsg || 'Network Error');
        showModal(setVisible);
        return null;
      }
      const userid = await getData('userid');
      if (res.data.length === 1 && res.data[0].userid === userid) {
        return null;
      }
      const info = res.data.find(u => u.userid !== userid);
      return info || null;
    };
    const pickUpStranger = async () => {
      const info = await randomPickUpExceptMe();
      setStranger(info);
    };
    pickUpStranger();
  }, []);

  return (
    <Background position="containerCenterWithTab">
      <MsgModal title={msgTitle} msg={msg} type='normal' okText='Got it' okCallback={() => hideModal(setVisible)} visible={visible} />
      {stranger ? (
        <View className="w-[90%] flex flex-col justify-center">
          <View className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Card Header */}
            <View className="p-4 border-b border-gray-200">
              <Text className="text-lg font-semibold text-gray-800">{stranger.realname || 'unknown'}</Text>
              <Text className="text-sm text-gray-600">{stranger.username || 'unknown'}</Text>
            </View>
            
            {/* Card Content */}
            <View className="p-4">
              <View className="items-center mb-4">
                <Image 
                  source={stranger.avatar ? {uri: stranger.avatar} : defaultAvatar}
                  className="w-16 h-16 rounded-full"
                />
              </View>
              <Text className="text-xl font-bold text-gray-800 mb-3">Introduction</Text>
              <Text className="text-base text-gray-700 mb-2">Gender: {stranger.gender || 'unknown'}</Text>
              <Text className="text-base text-gray-700 mb-2">Age: {stranger.age || 'unknown'}</Text>
              <Text className="text-base text-gray-700 mb-2">Email: {stranger.email || 'unknown'}</Text>
            </View>
            
            {/* Card Actions */}
            <View className="p-4 flex flex-col justify-center items-center">
              <Button 
                mode="outlined" 
                onPress={skip}
                style={{ backgroundColor: '#6677CC', width: '100%', marginBottom: 10 }}
              >
                Skip
              </Button>
              <Button 
                mode="contained" 
                onPress={chat}
                style={{ width: '100%' }}
              >
                Chat
              </Button>
            </View>
          </View>
        </View>
      ) : (
        <Paragraph>No one to recommend</Paragraph>
      )}
      <TabNavigation navigation={navigation} tabs={tabs} active="PickScreen" />
    </Background>
  );
}

PickScreen.propTypes = {
  navigation: PropTypes.object.isRequired
}

export default memo(PickScreen);
