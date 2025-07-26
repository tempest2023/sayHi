import React, { memo } from 'react';
import { View, TextInput as RNTextInput, Text } from 'react-native';
import PropTypes from 'prop-types';

function TextInput({ errorText, ...props }) {
  return (
    <View className="w-full my-3">
      <RNTextInput
        className="bg-white py-3 px-4 rounded-md border border-gray-300 text-base"
        selectionColor="#2A93D5"
        placeholderTextColor="#999"
        {...props}
      />
      {errorText ? (
        <Text className="text-sm text-red-600 px-1 pt-1">
          {errorText}
        </Text>
      ) : null}
    </View>
  );
}

TextInput.propTypes = {
  errorText: PropTypes.string,
};

export default memo(TextInput);
