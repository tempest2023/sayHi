import React, { memo } from 'react';
import { Image, StyleSheet } from 'react-native';
import LogoPng from '../assets/logo-256.png';

const styles = StyleSheet.create({
  image: {
    width: 128,
    height: 128,
    marginBottom: 12,
  },
});

function Logo() {
  return <Image source={LogoPng} style={styles.image} />
}

export default memo(Logo);
