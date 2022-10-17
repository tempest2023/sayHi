import React, { memo } from 'react';
import {
  ImageBackground,
  StyleSheet,
  KeyboardAvoidingView,
} from 'react-native';
import PropTypes from 'prop-types';
import BackgroundDot from '../assets/background_dot.png';

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
  },
  container: {
    flex: 1,
    padding: 10,
    width: '100%',
    maxWidth: 380,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  containerCenter: {
    flex: 1,
    padding: 10,
    width: '100%',
    maxWidth: 380,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerCenterWithTab: {
    flex: 1,
    padding: 10,
    width: '100%',
    maxWidth: 380,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: 80,
  }
});

/**
 * KeyboardAvoidingView: This component will automatically adjust its height, position, or bottom padding based on \
 * the keyboard height to remain visible while the virtual keyboard is displayed.
 */

function Background({ position="container", children }) {
  return <ImageBackground
    source={BackgroundDot}
    resizeMode="repeat"
    style={styles.background}
  >
    <KeyboardAvoidingView style={styles[position]} behavior="padding">
      {children}
    </KeyboardAvoidingView>
  </ImageBackground>
}

Background.propTypes = {
  position: PropTypes.string,
  children: PropTypes.node,
}

export default memo(Background);
