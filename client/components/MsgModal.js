import React, { memo } from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';

function MsgModal({ title = 'Notification', msg, type = 'normal', okText, okCallback, cancelText, cancelCallback, visible = false}) {
  const getModalTypeClasses = () => {
    switch(type) {
      case 'warn':
        return 'bg-yellow-400';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-white';
    }
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
    >
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className={`${getModalTypeClasses()} p-5 m-5 rounded-lg w-80 max-w-sm`}>
          <Text className="text-lg font-bold text-primary mb-4">{title}</Text>
          <View className="mb-6">
            <Text className="text-base leading-7 text-secondary">{msg}</Text>
          </View>
          <View className="flex-row justify-end">
            <TouchableOpacity 
              className="py-2 px-4 mr-2"
              onPress={okCallback}
            >
              <Text className="text-secondary font-medium">{okText || 'OK'}</Text>
            </TouchableOpacity>
            {cancelCallback && cancelText && (
              <TouchableOpacity 
                className="py-2 px-4"
                onPress={cancelCallback}
              >
                <Text className="text-secondary font-medium">{cancelText || 'Cancel'}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}

MsgModal.propTypes = {
  title: PropTypes.string,
  msg: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['normal', 'warn', 'error']),
  visible: PropTypes.bool.isRequired,
  okText: PropTypes.string,
  okCallback: PropTypes.func,
  cancelText: PropTypes.string,
  cancelCallback: PropTypes.func,
}


// it receives a setState function to operate the visible state of the modal
export const showModal = (fn) => {
  fn(true);
}
export const hideModal = (fn) => {
  fn(false);
}

export default memo(MsgModal);