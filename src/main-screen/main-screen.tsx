import React, {useState} from 'react';
import {View, StyleSheet, ActivityIndicator, Text} from 'react-native';
import Buttons from './main-screen-buttons';
import {Colors, LoadingState, Routes} from '../constants';
import {isApiData} from '../utils';
import Content from './main-screen-content';
import {IApi, IFile} from '../types';
import {useStore} from '../store/store';
import File from './main-screen-file';

function MainScreen(): JSX.Element {
  const [data, setData] = useState<IApi[] | IFile[] | []>([]);
  const [loadingState, setLoadingState] = useState(LoadingState.Idle);
  const store = useStore();

  const handleApiButtonClick = () => {
    setLoadingState(LoadingState.Loading);

    Promise.all(
      [Routes.api1, Routes.api2].map(url =>
        fetch(url).then(resp => resp.json()),
      ),
    )
      .then(data => {
        const normalizeData = data.flat();
        if (isApiData(normalizeData)) {
          setLoadingState(LoadingState.Resolve);
          setData(normalizeData);
        } else {
          throw new Error();
        }
      })
      .catch(error => {
        setLoadingState(LoadingState.Reject);
        console.log(error);
      });
  };

  const handleFileButtonClick = async () => {
    store.fileStore.getDataFromApi();
  };

  const isLoading = loadingState === LoadingState.Loading;
  const isResolve = loadingState === LoadingState.Resolve;
  const isReject = loadingState === LoadingState.Reject;

  return (
    <View style={styles.wrapper}>
      <View style={styles.content}>
        {isLoading && (
          <ActivityIndicator
            size="large"
            color={Colors.primary}
            style={styles.loader}
          />
        )}

        {isResolve && <Content data={data} />}
        <File />
        {isReject && (
          <Text style={styles.errorMessage}>Что-то пошло не так :(</Text>
        )}
      </View>
      <View style={styles.buttons}>
        <Buttons
          isLoading={isLoading}
          onApiButtonClick={handleApiButtonClick}
          onFileButtonClick={handleFileButtonClick}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignSelf: 'stretch',
  },
  loader: {
    marginTop: 'auto',
    marginBottom: 'auto',
  },
  buttons: {
    marginTop: 8,
  },
  errorMessage: {
    marginTop: 'auto',
    marginBottom: 'auto',
    textAlign: 'center',
  },
});

export default MainScreen;
