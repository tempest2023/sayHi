import React, { memo, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';
import { Card, Title, Avatar, Text } from 'react-native-paper';
import MsgModal, { showModal, hideModal } from '../components/MsgModal';
import randomPickUp from '../apis/pickup';
import Background from '../components/Background';
import Header from '../components/Header';
import Paragraph from '../components/Paragraph';
import Button from '../components/Button';
import TabNavigation from '../components/TabNavigation';
import tabs from './tabs';
import theme from '../theme';
import { getData } from '../apis/localStorage';

const defaultAvatar = require('../assets/default_avatar.png');

const styles = StyleSheet.create({
  pickupCard: {
    width: '90%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  },
  cardAction: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  skipButton: {
    flex: 1,
    backgroundColor: theme.colors.secondary 
  },
  chatButton: {
    flex: 1,
    backgroundColor: theme.colors.primary 
  }
});

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
        <View style={styles.pickupCard}>
          <Card>
            <Card.Title title={stranger.realname || 'unknown'} subtitle={stranger.username || 'unknown'} />
            <Card.Content>
              <Avatar.Image size={64} style={styles.chatAvatar} source={stranger.avatar ? {uri: stranger.avatar} : defaultAvatar} />
              <Title>Introduction</Title>
              <Text>Gender: {stranger.gender || 'unknown'}</Text>
              <Text>Age: {stranger.age || 'unknown'}</Text>
              <Text>Email: {stranger.email || 'unknown'}</Text>
            </Card.Content>
            <Card.Actions style={styles.cardAction}>
              <Button style={styles.skipButton} onPress={skip}>Skip</Button>
              <Button style={styles.chatButton} onPress={chat}>Chat</Button>
            </Card.Actions>
          </Card>
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
