import React, { memo } from 'react';
import { Text } from 'react-native';
import PropTypes from 'prop-types';

function Header({ children }) {
  return (
    <Text className="text-2xl text-primary font-bold py-3.5">
      {children}
    </Text>
  );
}

Header.propTypes = {
  children: PropTypes.node,
}

export default memo(Header);
