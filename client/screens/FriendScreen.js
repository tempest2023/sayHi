import React, { memo, useState, useEffect } from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import { Avatar, Text } from 'react-native-paper';
import Background from '../components/Background';
import Header from '../components/Header';
import Button from '../components/Button';
import MsgModal, { showModal, hideModal } from '../components/MsgModal';
import TabNavigation from '../components/TabNavigation';
import Paragraph from '../components/Paragraph';
import theme from '../theme';
import tabs from './tabs';
import queryFriends from '../apis/queryFriends';
import queryFriendsInfo from '../apis/queryFriendsInfo'

const defaultAvatar = require('../assets/default_avatar.png');

const AvatarIconSize = 48;

const styles = StyleSheet.create({
  chatRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'space-between',
    width: '100%',
    height: 60,
  },
  chatAvatar: {
    margin: 5,
    width: AvatarIconSize,
    height: AvatarIconSize,
    backgroundColor: '#fff',
  },
  chatContent: {
    flex: 7,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    height: 60,
    marginLeft: 10,
  },
  chatTitle: {
    fontSize: 14,
  },
  chatText: {
    fontSize: 10,
  }
});

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
      tmp.push(<TouchableOpacity onPress={()=>{chat(item.userid)}} key={`chat_${item.userid}`} style={styles.chatRow}>
          <Avatar.Image size={AvatarIconSize} style={styles.chatAvatar} source={item.avatar ? {uri: item.avatar} : defaultAvatar} />
          <View style={styles.chatContent}>
            <Text style={styles.chatTitle}>{item.realname || 'Unknown'}</Text>
            <Text style={styles.chatText}>New Message Here!</Text>
          </View>
      </TouchableOpacity>)
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
  </Background>);
}


FriendScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
}

export default memo(FriendScreen);
