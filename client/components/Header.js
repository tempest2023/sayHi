import React, { memo } from 'react';
import { StyleSheet, Text } from 'react-native';
import PropTypes from 'prop-types';
import theme from '../theme';

const styles = StyleSheet.create({
  header: {
    fontSize: 26,
    color: theme.colors.primary,
    fontWeight: 'bold',
    paddingVertical: 14,
  },
});

function Header({ children }) {
  return <Text style={styles.header}>{children}</Text>
}

Header.propTypes = {
  children: PropTypes.node,
}

export default memo(Header);
