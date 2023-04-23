import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Platform,
  Text,
} from 'react-native';
import RNFS from 'react-native-fs';
import Buttons from './buttons';
import {Colors, FILES_URL, LoadingState, Routes} from '../constants';
import {
  downloadFile,
  getPermissionAndroid,
  csvToObj,
  isApiData,
  isFileData,
} from '../utils';
import Content from './content';
import {IApi, IFile} from '../types';

function MainScreen(): JSX.Element {
  const [data, setData] = useState<IApi[] | IFile[] | []>([]);
  const [lodaingState, setLodaingState] = useState(LoadingState.Idle);

  const handleApiButtonClick = () => {
    setLodaingState(LoadingState.Loading);

    Promise.all(
      [Routes.api1, Routes.api2].map(url =>
        fetch(url).then(resp => resp.json()),
      ),
    )
      .then(data => {
        const normalizeData = data.flat();
        if (isApiData(normalizeData)) {
          setLodaingState(LoadingState.Resolve);
          setData(normalizeData);
        } else {
          throw new Error();
        }
      })
      .catch(error => {
        setLodaingState(LoadingState.Reject);
        console.log(error);
      });
  };

  const handleFileButtonClick = async () => {
    if (Platform.OS === 'android') {
      const granted = await getPermissionAndroid();
      if (!granted) return;
    }

    const url = FILES_URL;
    const path = `${RNFS.DocumentDirectoryPath}/reactNativePet.csv`;
    setLodaingState(LoadingState.Loading);

    await downloadFile(url, path).catch(_err =>
      setLodaingState(LoadingState.Reject),
    );

    await RNFS.readFile(path, 'ascii')
      .then(data => {
        const normalizeData = csvToObj(data).slice(0, 100);
        if (isFileData(normalizeData)) {
          setLodaingState(LoadingState.Resolve);
          setData(normalizeData);
        } else {
          throw new Error();
        }
      })
      .catch(error => {
        setLodaingState(LoadingState.Reject);
        console.log(error);
      });
  };

  const isLoading = lodaingState === LoadingState.Loading;
  const hasData = lodaingState === LoadingState.Resolve && data.length > 0;
  const isError = lodaingState === LoadingState.Reject;

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
        {hasData && <Content data={data} />}
        {isError && (
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
