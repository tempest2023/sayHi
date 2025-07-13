import React, { memo } from 'react';
import { TouchableOpacity, Text } from 'react-native';
import PropTypes from 'prop-types';

function Button({ mode, style, children, ...props }) {
  const baseClasses = "w-52 my-2.5 py-3 px-4 rounded-md items-center justify-center";
  const modeClasses = mode === 'outlined' 
    ? "bg-white border-2 border-primary" 
    : "bg-primary";
  const textClasses = mode === 'outlined' 
    ? "text-primary font-bold text-base" 
    : "text-white font-bold text-base";

  return (
    <TouchableOpacity
      className={`${baseClasses} ${modeClasses}`}
      style={style}
      {...props}
    >
      <Text className={textClasses}>
        {children}
      </Text>
    </TouchableOpacity>
  );
}

Button.propTypes = {
  mode: PropTypes.string,
  style: PropTypes.object,
  children: PropTypes.node,
}

export default memo(Button);
