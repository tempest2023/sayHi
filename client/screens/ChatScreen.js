import React, { memo, useState, useEffect } from 'react';
import { TouchableOpacity, StyleSheet, View, Text } from 'react-native';
import { Avatar, TextInput } from 'react-native-paper';
import PropTypes from 'prop-types';
import Background from '../components/Background';
import Header from '../components/Header';
import MsgModal, { showModal, hideModal } from '../components/MsgModal';
import Paragraph from '../components/Paragraph';
import theme from '../theme';
import sendMessage from '../apis/sendMessage';
import queryFriendsInfo from '../apis/queryFriendsInfo';
import queryAllMessageBySenderId from '../apis/queryAllMessageBySenderId';
import queryAllMessageByReceiverId from '../apis/queryAllMessageByReceiverId';
import checkUserAuth from '../apis/checkUserAuth';

const defaultAvatar = require('../assets/default_avatar.png');

const styles = StyleSheet.create({
  messageListContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    height: '80%',
    width: '100%',
  },
  messageListItem1: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    margin: 5,
    width: '100%',
  },
  messageListItem2: {
    display: 'flex',
    flexDirection: 'row-reverse',
    justifyContent: 'flex-start',
    alignItems: 'center',
    margin: 5,
    width: '100%',
  },
  messageBubble: {
    backgroundColor: theme.colors.primary,
    borderRadius: 10,
    padding: 8,
    marginLeft: 10,
    marginRight: 10,
    width: 'auto',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  messageBubbleWhite: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 8,
    marginLeft: 10,
    marginRight: 10,
    width: 'auto',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  senderContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    height: 80,
    flexWrap: 'no-wrap',
  },
  senderInput: {
    width: '100%',
  }
});

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
          <View key={`message_me_${item.id}_${item.time}`} style={styles.messageListItem2}>
            <Avatar.Image size={40} source={myInfo.avatar ? {uri: myInfo.avatar} : defaultAvatar} />
            <View style={styles.messageBubble}>
              <Text style={{color:'#fff'}}>{item.text}</Text>
            </View>
          </View>
        )
      } else {
        tmp.push(
          <View key={`message_receiver_${item.id}_${item.time}`} style={styles.messageListItem1}>
            <Avatar.Image size={40} source={receiverInfo.avatar ? {uri: receiverInfo.avatar} : defaultAvatar} />
            <View style={styles.messageBubbleWhite}>
              <Text style={{color: '#555'}}>{item.text}</Text>
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
    {receiverInfo && <Header style={styles.receiverName}>{receiverInfo.realname || 'Unknown'}</Header>}
    <View style={styles.messageListContainer}>
      {messageListView}
    </View>
    <View style={styles.senderContainer}>
      <TextInput
        label="message"
        returnKeyType="next"
        value={messageText}
        onChangeText={text => setMessageText(text)}
        style={styles.senderInput}
        right={<TextInput.Icon icon="send" onPress={send} />}
      />
    </View>
  </Background>);
}


ChatScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
  route: PropTypes.object.isRequired,
}

export default memo(ChatScreen);
