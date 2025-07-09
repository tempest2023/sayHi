import React, { useState, memo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { View, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Avatar, Text } from 'react-native-paper';
import { colors } from '../theme';

const ScreenWidth = Dimensions.get('window').width;
const tabBackgroundColor = '#eee';

const styles = StyleSheet.create({
  bottomFixed: {
    position: 'absolute',
    bottom: 0,
    width: ScreenWidth,
    height: 80
  },
  bottomTab: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 60,
    width: '100%',
    margin: 5,
    marginBottom: 40,
    backgroundColor: colors.primary,
  },
  tabItem: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#555',
    marginTop: 5,
  },
  activeTabItem: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#fff',
    marginTop: 5,
  },
  tabIcon: {
    marginBottom: 5,
    backgroundColor: tabBackgroundColor,
  },
  activeTabIcon: {
    marginBottom: 5,
    backgroundColor: colors.primary,
  },
  tabText: {
    color: '#555',
    fontSize: 12,
  },
  activeTabText: {
    color: colors.primary,
    fontSize: 12,
  }
});

function TabNavigation({ navigation, tabs, active }) {
  const [tabItems, setTabItems] = useState([]);

  useEffect(() => {
    const changeTab = (key) => {
      console.log('[debug] changeTab navigate to', key);
      navigation.replace(key);
    }
    const tmp = []
    tabs.forEach(item => {
      const isActive = active === item.key;
      tmp.push(
      <TouchableOpacity key={`tab_${item.key}`} onPress={()=>{changeTab(item.key)}} style={isActive ? styles.activeTabItem : styles.tabItem}>
        <Avatar.Icon style={isActive ? styles.activeTabIcon : styles.tabIcon} size={36} icon={isActive ? item.focusedIcon : item.unfocusedIcon} />
        <Text style={isActive ? styles.activeTabText : styles.tabText}>{item.title}</Text>
      </TouchableOpacity>);
    })
    setTabItems(tmp);
  }, [tabs, active, navigation]);

  return (
    <View style={styles.bottomFixed}>
      <View style={styles.bottomTab}>
        {tabItems}
      </View>
    </View>
  );
}
TabNavigation.propTypes = {
  navigation: PropTypes.object.isRequired,
  tabs: PropTypes.array.isRequired,
  active: PropTypes.string.isRequired,
}

export default memo(TabNavigation);