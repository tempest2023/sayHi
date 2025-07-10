import React, { memo, useState, useEffect } from 'react';
import { TouchableOpacity, View, Image, Text } from 'react-native';
import PropTypes from 'prop-types';
import Background from '../components/Background';
import MsgModal, { showModal, hideModal } from '../components/MsgModal';
import TabNavigation from '../components/TabNavigation';
import Paragraph from '../components/Paragraph';
import tabs from './tabs';
import queryFriends from '../apis/queryFriends';
import queryFriendsInfo from '../apis/queryFriendsInfo'

const defaultAvatar = require('../assets/default_avatar.png');

function FriendScreen({ navigation }) {
  const [friendList, setFriendList] = useState([]);
  const [friendListView, setFriendListView] = useState([]);
  const [msgTitle, setMsgTitle] = useState('');
  const [msg, setMsg] = useState('');
  const [visible, setVisible] = useState(false);

  useEffect(()=>{
    const requestFriend = async () => {
      const friendsList = await queryFriends();
      console.log('[debug] friends list', friendsList);
      const friendsInfoList = await queryFriendsInfo(friendsList);
      const errorRes = friendsInfoList.filter(item => !item || !item.success);
      if(errorRes.length > 0) {
        console.log('[debug] query friends info error', friendsInfoList);
        setMsgTitle('Error');
        setMsg(errorRes[0].errmsg || 'Network Error');
        showModal(setVisible);
        return
      }
      console.log('[debug] request friends info', JSON.stringify(friendsInfoList));
      const tmp = [];
      friendsInfoList.forEach(item => {
        tmp.push(item.data);
      })
      setFriendList(tmp);
    }
    requestFriend();
  }, [])
  
  useEffect(()=>{
    // [TODO] Friends ScrollView
    const chat = (userid) => {
      navigation.navigate('ChatScreen', { userid });
    }
    console.log('[debug] updated friendList to generate friend list View', friendList);
    const tmp = [];
    friendList.forEach(item => {
      tmp.push(
        <TouchableOpacity 
          onPress={()=>{chat(item.userid)}} 
          key={`chat_${item.userid}`} 
          className="flex flex-row justify-start items-center w-full h-15 py-2 px-1"
        >
          <Image 
            source={item.avatar ? {uri: item.avatar} : defaultAvatar}
            className="w-12 h-12 rounded-full bg-white m-1"
          />
          <View className="flex-1 flex flex-col justify-center items-start h-15 ml-2">
            <Text className="text-sm font-medium text-gray-800">{item.realname || 'Unknown'}</Text>
            <Text className="text-xs text-gray-600">New Message Here!</Text>
          </View>
        </TouchableOpacity>
      )
    })
    setFriendListView(tmp);
  }, [friendList, navigation])
  
  return (
    <Background>
      <MsgModal title={msgTitle} msg={msg} type='normal' okText='Got it' okCallback={() => hideModal(setVisible)} visible={visible} />
      {friendListView}
      {friendListView.length === 0 && 
        <View>
          <Paragraph>You have no Friends, try to know more kindly people in Pick Tab.</Paragraph>
        </View>
      }
      <TabNavigation navigation={navigation} tabs={tabs} active="FriendScreen" />
    </Background>
  );
}

FriendScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
}

export default memo(FriendScreen);
