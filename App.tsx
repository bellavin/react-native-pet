import React from 'react';
import {StyleSheet, View} from 'react-native';
import MainScreen from './src/main-screen/main-screen';
import RootStore, {StoreProvider} from './src/store/store';

const store = new RootStore();

function App(): JSX.Element {
  return (
    <StoreProvider store={store}>
      <View style={styles.wrapper}>
        <MainScreen />
      </View>
    </StoreProvider>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    height: '100%',
    width: '100%',
    maxWidth: 800,
    maxHeight: 600,
    alignSelf: 'center',
    padding: 16,
    borderRadius: 8,
    backgroundColor: 'white',
  },
});

export default App;
