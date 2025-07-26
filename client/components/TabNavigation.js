import React, { useState, memo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { View, TouchableOpacity, Dimensions, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ScreenWidth = Dimensions.get('window').width;

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
        <TouchableOpacity 
          key={`tab_${item.key}`} 
          onPress={()=>{changeTab(item.key)}} 
          className="flex-1 flex-col justify-center items-center mt-1"
        >
          <View className={`mb-1 w-9 h-9 rounded-full items-center justify-center ${
            isActive ? 'bg-primary' : 'bg-gray-200'
          }`}>
            <Icon 
              name={isActive ? item.focusedIcon : item.unfocusedIcon} 
              size={20} 
              color={isActive ? '#ffffff' : '#555555'} 
            />
          </View>
          <Text className={`text-xs ${isActive ? 'text-primary' : 'text-gray-600'}`}>
            {item.title}
          </Text>
        </TouchableOpacity>
      );
    })
    setTabItems(tmp);
  }, [tabs, active, navigation]);

  return (
    <View 
      className="absolute bottom-0 h-20"
      style={{ width: ScreenWidth }}
    >
      <View className="flex-row justify-around items-center h-15 w-full m-1 mb-10 bg-gray-200">
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