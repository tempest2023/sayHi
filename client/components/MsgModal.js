import React, { memo } from 'react';
import { StyleSheet } from 'react-native';
import { Dialog, Portal, Paragraph, Button } from 'react-native-paper';
import PropTypes from 'prop-types';
import theme from '../theme';

const styles = StyleSheet.create({
  normal: {
    backgroundColor: 'white',
    color: theme.colors.primary,
    padding: 5,
    margin: 5,
  },
  warn: {
    backgroundColor: '#ffc400',
    color: theme.colors.primary,
    padding: 5,
    margin: 5
  },
  error: {
    backgroundColor: '#f00f00',
    color: theme.colors.primary,
    padding: 5,
    margin: 5
  },
  okText: {
    color: theme.colors.secondary,
  }
});

function MsgModal({ title = 'Notification', msg, type = 'normal', okText, okCallback, cancelText, cancelCallback, visible = false}) {
  return (
      <Portal>
        <Dialog visible={visible} style={styles[type]}>
        <Dialog.Title>{title}</Dialog.Title>
          <Dialog.Content>
                <Paragraph>{msg}</Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button style={styles.okText} onPress={okCallback}>{okText || 'OK'}</Button>
            {cancelCallback && cancelText && <Button onPress={cancelCallback}>{cancelText || 'Cancel'}</Button>}
          </Dialog.Actions>
        </Dialog>
      </Portal>
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