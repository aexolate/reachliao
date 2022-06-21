import * as React from 'react';
import { View } from 'react-native';
import { Button, Paragraph, Dialog, Portal, Provider, TextInput } from 'react-native-paper';
import PropTypes from 'prop-types';

const FavouritesDialog = (props) => {
  const [visible, setVisible] = React.useState(props.visible);
  const [text, setText] = React.useState("");

  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);

  const confirm = () => {
    if (props.onConfirm) {
      props.onConfirm(text);
    }
  };

  return (
    <Portal>
      <Dialog visible={props.visible} onDismiss={props.onDismiss}>
        <Dialog.Title>Add Favourites</Dialog.Title>
        <Dialog.Content>
          <TextInput label="Alarm Title" placeholder="Enter a name for this alarm" />
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={props.onDismiss}>Cancel</Button>
          <Button onPress={confirm}>Confirm</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};
FavouritesDialog.propTypes = {
  //Callback that is called when the user confirms the prompt
  //Provides the text the user entered in the textbox
  onConfirm: PropTypes.func.isRequired,

  //Callback that is called when the user dismiss the prompt
  onDismiss: PropTypes.func.isRequired,

  //Used to toggle the visibility of this Dialog
  visible: PropTypes.bool,
};
export default FavouritesDialog;
