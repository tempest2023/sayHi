import React, { memo, useState, useEffect } from 'react';
import { TouchableOpacity, View, Text, TextInput, Image } from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Background from '../components/Background';
import Header from '../components/Header';
import MsgModal, { showModal, hideModal } from '../components/MsgModal';
import sendMessage from '../apis/sendMessage';
import queryFriendsInfo from '../apis/queryFriendsInfo';
import queryAllMessageBySenderId from '../apis/queryAllMessageBySenderId';
import queryAllMessageByReceiverId from '../apis/queryAllMessageByReceiverId';
import checkUserAuth from '../apis/checkUserAuth';

const defaultAvatar = require('../assets/default_avatar.png');

function ChatScreen({ navigation, route }) {
  const [receiver, setReceiver] = useState(route.params.userid);
  const [receiverInfo, setReceiverInfo] = useState(null);
  const [myInfo, setMyInfo] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [messageList, setMessageList] = useState([]);
  const [messageListView, setMessageListView] = useState([]);
  
  const [msgTitle, setMsgTitle] = useState('');
  const [msg, setMsg] = useState('');
  const [visible, setVisible] = useState(false);
  
  const send = async () =>  {
    if(messageText === '') {
      return;
    }
    console.log('[debug] send message', receiver, messageText);
    const res = await sendMessage(messageText, receiver);
    if (!res || !res.success) {
      setMsgTitle('Error');
      setMsg(res.errmsg || 'Network Error');
      showModal(setVisible);
      return;
    }
    const tmp = JSON.parse(JSON.stringify(messageList));
    tmp.push({id: messageList.length, sender: 'me', text: messageText, time: new Date().getTime()});
    setMessageList(tmp);
    // clear message text
    setMessageText('');
  }
  
  // set receiver id from router params
  useEffect(()=>{
    const chatUserid = route.params.userid;
    if (!chatUserid) {
      setMsgTitle('Error');
      setMsg('Invalid Operations without userid');
      showModal(setVisible);
    }
    if(chatUserid !== receiver) {
      setReceiver(chatUserid);
    }
  }, [route, receiver])
  
  // get user info and receiver info
  useEffect(()=>{
    const getUserAndReceiverInfo = async () => {
      const friendsInfoList = await queryFriendsInfo([receiver]);
      if(friendsInfoList.length < 1 || !friendsInfoList[0] || !friendsInfoList[0].success) {
        console.log('[debug] query friends info error', friendsInfoList);
        setMsgTitle('Error');
        setMsg('Network Error');
        showModal(setVisible);
        return
      }
      const { data: receiverData } = friendsInfoList[0];
      console.log('[debug] request friends info', JSON.stringify(receiverData));
      
      const res = await checkUserAuth();
      if(!res || !res.success) {
        // retrieve user profile failed, navigate to login page
        console.log(`[debug] getUserInfo failed in ChatScreen, ${res.errno} ${res.errmsg}`);
        setMsgTitle('Error');
        setMsg('Network Error');
        showModal(setVisible);
        return;  
      }
      console.log(`[debug] getUserProfile success, ${JSON.stringify(res)}`);
      const { data = {} } = res;
      setMyInfo(data);
      setReceiverInfo(receiverData);
    }
    getUserAndReceiverInfo();
  }, [receiver])

  // query history message 
  useEffect(()=>{
    const getHistoryMessage = async () => {
      const messages = [];
      const sentMessageRes = await queryAllMessageByReceiverId(receiver);
      if (!sentMessageRes || !sentMessageRes.success) {
        setMsgTitle('Error');
        setMsg(sentMessageRes.errmsg || 'Network Error');
        showModal(setVisible);
        return;
      }
      const sentMessage = sentMessageRes.data || [];
      
      const receivedMessageRes = await queryAllMessageBySenderId(receiver);

      const receivedMessage = receivedMessageRes.data || [];
      
      console.log('[debug] getHistoryMessage', sentMessage, receivedMessage);

      sentMessage.forEach((item) => {
        messages.push({
          id: item.id,
          sender: 'me',
          text: item.message,
          time: item.edit_time,
        });
      });
      receivedMessage.forEach((item) => {
        messages.push({
          id: item.id,
          sender: 'other',
          text: item.message,
          time: item.edit_time,
        });
      });
      messages.sort((a, b) => parseInt(a.time, 10) - parseInt(b.time, 10));
      setMessageList(messages);
    }
    getHistoryMessage();
  }, [receiver]);
  
  // generate message list view
  useEffect(()=>{
    if(!myInfo || !receiverInfo) {
      return;
    }
    const tmp = [];
    messageList.forEach((item) => {
      if(item.sender === 'me') {
        tmp.push(
          <View key={`message_me_${item.id}_${item.time}`} className="flex flex-row-reverse justify-start items-center m-1 w-full">
            <Image 
              source={myInfo.avatar ? {uri: myInfo.avatar} : defaultAvatar}
              className="w-10 h-10 rounded-full"
            />
            <View className="bg-primary rounded-lg p-2 mx-2 self-center">
              <Text className="text-white">{item.text}</Text>
            </View>
          </View>
        )
      } else {
        tmp.push(
          <View key={`message_receiver_${item.id}_${item.time}`} className="flex flex-row justify-start items-center m-1 w-full">
            <Image 
              source={receiverInfo.avatar ? {uri: receiverInfo.avatar} : defaultAvatar}
              className="w-10 h-10 rounded-full"
            />
            <View className="bg-white rounded-lg p-2 mx-2 self-center">
              <Text className="text-gray-700">{item.text}</Text>
            </View>
          </View>
        )
      }
    });
    setMessageListView(tmp);
  }, [messageList, myInfo, receiverInfo]);
  
  return (
    <Background>
      <MsgModal title={msgTitle} msg={msg} type='normal' okText='Got it' okCallback={() => {hideModal(setVisible); navigation.goBack();}} visible={visible} />
      {receiverInfo && <Header>{receiverInfo.realname || 'Unknown'}</Header>}
      <View className="flex flex-col justify-start items-start h-[80%] w-full">
        {messageListView}
      </View>
      <View className="flex flex-row justify-between items-center w-full h-20">
        <View className="flex-1 flex-row items-center bg-white rounded-md border border-gray-300 mx-1">
          <TextInput
            placeholder="message"
            returnKeyType="send"
            value={messageText}
            onChangeText={text => setMessageText(text)}
            className="flex-1 py-3 px-4 text-base"
            placeholderTextColor="#999"
            onSubmitEditing={send}
          />
          <TouchableOpacity onPress={send} className="p-3">
            <Icon name="send" size={24} color="#2A93D5" />
          </TouchableOpacity>
        </View>
      </View>
    </Background>
  );
}

ChatScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
  route: PropTypes.object.isRequired,
}

export default memo(ChatScreen);
