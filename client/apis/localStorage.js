import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { isWeb, isJsonObject } from '../utils';


const saveDataByLocalStorage = async (key, value) => {
  if(!localStorage) {
    console.log(`[error] saveDataByLocalStorage fails: ${key}, ${value}, localStorage is not a function`);
    return false;
  }
  try {
    localStorage.setItem(key, value);
    return true;
  } catch(e) {
    console.log(`[error] saveDataByLocalStorage fails: ${key}, ${value}, ${e}`);
  }  
  return false;
}

const getDataByLocalStorage = async (key) => {
  if(!localStorage) {
    console.log(`[error] getDataByLocalStorage fails: ${key}, localStorage is not a function`);
    return false;
  }
  try {
    const value = localStorage.getItem(key);
    return value
  } catch(e) {
    console.log(`[error] getDataByLocalStorage fails: ${key}, ${e}`);
  }  
  return false;
}

export const saveData = async (key, value) => {
  let valueString = value;
  if(isJsonObject(value)){
    valueString = JSON.stringify(value);
  }
  if(isWeb()) {
    return saveDataByLocalStorage(key, valueString)
  }
  try {
    await AsyncStorage.setItem(key, valueString)
    return true;
  } catch (e) {
    console.log(`[error] saveData fails: ${key}, ${value}, ${e}`);
  }
  return false;
}

export const getData = async (key) => {
  if(isWeb()) {
    return getDataByLocalStorage(key)
  }
  try {
    const value = await AsyncStorage.getItem(key)
    return value;
  } catch(e) {
    console.log(`[error] getData fails: ${key}, ${e}`);
  }
  return null;
}

export const secureSave = async (key, value) => {
  let valueString = value;
  if(isJsonObject(value)){
    valueString = JSON.stringify(value);
  }
  if(isWeb()) {
    return saveDataByLocalStorage(key, valueString)
  }
  try {
    await SecureStore.setItemAsync(key, valueString);
    return true;
  }
  catch (e) {
    console.log(`[error] secure store fails: ${key}, ${value}, ${e}`);
  }
  return false;
}

export const secureGet = async (key) => {
  if(isWeb()) {
    return getDataByLocalStorage(key)
  }
  try {
    const value = await SecureStore.getItemAsync(key);
    return value;
  } catch(e) {
    console.log(`[error] secure get fails: ${key}, ${e}`);  
  }
  return null;
 }
