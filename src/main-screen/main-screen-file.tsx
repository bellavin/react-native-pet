import React from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {observer} from 'mobx-react';
import {Colors, LoadingState} from '../constants';
import {isFileData} from '../utils';
import {useStore} from '../store/store';

function File(): JSX.Element {
  const store = useStore();
  const {data, loadingState} = store.fileStore;

  const isLoading = loadingState === LoadingState.Loading;
  const isResolve = loadingState === LoadingState.Resolve;
  const isReject = loadingState === LoadingState.Reject;
  console.log(loadingState);

  return (
    <View style={styles.wrapper}>
      <ScrollView style={styles.list}>
        {isLoading && (
          <ActivityIndicator
            size="large"
            color={Colors.primary}
            style={styles.loader}
          />
        )}
        {isResolve &&
          isFileData(data) &&
          data.map(item => {
            const {id, industry, value} = item;
            return (
              <View key={id} style={styles.item}>
                <Text style={styles.text}>{industry}</Text>
                <Text style={styles.text}>{value}</Text>
              </View>
            );
          })}
        {isReject && (
          <Text style={styles.errorMessage}>Что-то пошло не так :(</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    padding: 8,
    backgroundColor: Colors.lightgray,
    borderRadius: 8,
    lineHeight: 8,
  },
  loader: {
    marginTop: 'auto',
    marginBottom: 'auto',
  },
  list: {},
  item: {
    flexDirection: 'row',
  },
  text: {
    width: '50%',
  },
  errorMessage: {
    marginTop: 'auto',
    marginBottom: 'auto',
    textAlign: 'center',
  },
});

export default observer(File);
