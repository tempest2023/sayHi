import { StyleSheet, Text, View } from "react-native";
import * as React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider } from 'react-redux'
import store from './store';
import theme from './theme';
import {
  HomeScreen,
  LoginScreen,
  RegisterScreen,
  PickScreen,
  ChatScreen,
  FriendScreen,
  ProfileScreen,
} from './screens';

const Stack = createNativeStackNavigator();


function AppPageRouter () {
  return (
    <Stack.Navigator initialRouteName="HomeScreen" screenOptions={{ headerBackTitle: '', gestureEnabled: false, cardOverlayEnabled: false }}>
      <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ title: 'SayHi' }} />
      <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ title: 'Login' }} />
      <Stack.Screen name="RegisterScreen" component={RegisterScreen} options={{ title: 'Sign Up' }} />
      <Stack.Screen name="PickScreen" component={PickScreen} options={{ title: 'Pick Up', animationEnabled: false }} />
      <Stack.Screen name="FriendScreen" component={FriendScreen} options={{ title: 'Friends', animationEnabled: false }} />
      <Stack.Screen name="ChatScreen" component={ChatScreen} options={{ title: 'Chat' }} getId={({ params }) => params.userid} />
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} options={{ title: 'Profile', animationEnabled: false }} />
    </Stack.Navigator>
  )
}

function App() {
  return (
  <Provider store={store}>
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <AppPageRouter />
      </NavigationContainer>
    </PaperProvider>
  </Provider>);
}

export default App;