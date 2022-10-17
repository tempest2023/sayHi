import React, { memo } from 'react';
import { StyleSheet } from 'react-native';
import { Button as PaperButton } from 'react-native-paper';
import PropTypes from 'prop-types';
import theme from '../theme';

const styles = StyleSheet.create({
  button: {
    width: 200,
    marginVertical: 10,
  },
  text: {
    fontWeight: 'bold',
    fontSize: 15,
    lineHeight: 26,
  },
});

function Button({ mode, style, children, ...props }) {
  return <PaperButton
    style={[
      styles.button,
      mode === 'outlined' && { backgroundColor: theme.colors.surface },
      style,
    ]}
    labelStyle={styles.text}
    mode={mode}
    {...props}
  >
    {children}
  </PaperButton>
}

Button.propTypes = {
  mode: PropTypes.string,
  style: PropTypes.object,
  children: PropTypes.node,
}

export default memo(Button);
