import React, { memo } from 'react';
import { StyleSheet, Text } from 'react-native';
import PropTypes from 'prop-types';
import theme from '../theme';

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    lineHeight: 26,
    color: theme.colors.secondary,
    textAlign: 'center',
    marginBottom: 14,
  },
});

function Paragraph({ children }) {
  return <Text style={styles.text}>{children}</Text>
}

Paragraph.propTypes = {
  children: PropTypes.node,
}

export default memo(Paragraph);
