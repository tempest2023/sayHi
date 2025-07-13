import React, { memo } from 'react';
import { Image } from 'react-native';
import LogoPng from '../assets/logo-256.png';

function Logo() {
  return (
    <Image 
      source={LogoPng} 
      className="w-32 h-32 mb-3" 
    />
  );
}

export default memo(Logo);
