import React, {ReactNode} from 'react';
import {GestureResponderEvent, Pressable, StyleSheet, View} from 'react-native';
import {Colors} from '../constants';

interface Props {
  disabled: boolean;
  children?: ReactNode;
  onPress?: (event: GestureResponderEvent) => void;
}

function Button({
  disabled,
  onPress: handlePress,
  children,
}: Props): JSX.Element {
  return (
    <>
      {!disabled ? (
        <Pressable
          onPress={handlePress}
          style={({pressed}) => [
            {backgroundColor: pressed ? Colors.primaryHover : Colors.primary},
            styles.button,
          ]}>
          {children}
        </Pressable>
      ) : (
        <View style={[{backgroundColor: 'gray'}, styles.button]}>
          {children}
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 32,
    paddingVertical: 8,
    borderRadius: 8,
    lineHeight: 8,
  },
});

export default Button;
