import React, { memo } from 'react';
import { Text } from 'react-native';
import PropTypes from 'prop-types';

function Paragraph({ children }) {
  return (
    <Text className="text-base leading-7 text-secondary text-center mb-3.5">
      {children}
    </Text>
  );
}

Paragraph.propTypes = {
  children: PropTypes.node,
}

export default memo(Paragraph);
