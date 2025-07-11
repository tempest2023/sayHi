import React, { memo } from 'react';
import {
  ImageBackground,
  KeyboardAvoidingView,
} from 'react-native';
import PropTypes from 'prop-types';
import BackgroundDot from '../assets/background_dot.png';

/**
 * KeyboardAvoidingView: This component will automatically adjust its height, position, or bottom padding based on \
 * the keyboard height to remain visible while the virtual keyboard is displayed.
 */

function Background({ position="container", children }) {
  const getPositionClasses = () => {
    switch(position) {
      case 'containerCenter':
        return 'flex-1 p-2.5 w-full max-w-sm self-center items-center justify-center';
      case 'containerCenterWithTab':
        return 'flex-1 p-2.5 w-full max-w-sm self-center items-center justify-start mt-20';
      default:
        return 'flex-1 p-2.5 w-full max-w-sm self-center items-center justify-start';
    }
  };

  return (
    <ImageBackground
      source={BackgroundDot}
      resizeMode="repeat"
      className="flex-1 w-full"
    >
      <KeyboardAvoidingView className={getPositionClasses()} behavior="padding">
        {children}
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

Background.propTypes = {
  position: PropTypes.string,
  children: PropTypes.node,
}

export default memo(Background);
