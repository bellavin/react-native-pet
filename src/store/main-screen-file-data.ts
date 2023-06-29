import {Platform, Alert} from 'react-native';
import RNFS from 'react-native-fs';
import {observable, action, makeObservable} from 'mobx';
import {FILES_URL, LoadingState} from '../constants';
import {IFile} from '../types';
import {getPermissionAndroid, csvToObj, isFileData} from '../utils';
import RootStore from './store';

export default class FileStore {
  root: RootStore;
  loadingState: LoadingState = LoadingState.Idle;
  data: IFile[] = [];

  constructor(root: RootStore) {
    makeObservable(this, {
      loadingState: observable,
      data: observable,
      getDataFromApi: action,
      setLoadingState: action,
      setData: action,
    });
    this.root = root;
  }

  downloadFile = async (url: string, path: string) => {
    const res = await RNFS.downloadFile({
      fromUrl: url,
      toFile: path,
    }).promise;

    const isDownloadSuccess =
      res && res.statusCode === 200 && res.bytesWritten > 0;

    if (!isDownloadSuccess) {
      Alert.alert('Download failed');
      throw new Error('Download failed');
    }

    const result = await RNFS.getFSInfo();
    const deviceSpace = result.freeSpace * 0.001;

    if (deviceSpace < res.bytesWritten) {
      Alert.alert('Not enough space');
      throw new Error('Not enough space');
    }
  };

  readFile = async (path: string, encoding: string) =>
    RNFS.readFile(path, encoding).then(data => {
      const normalizeData = csvToObj(data).slice(0, 100);

      if (!isFileData(normalizeData)) {
        throw new Error();
      }
      this.setLoadingState(LoadingState.Resolve);
      this.setData(normalizeData);
    });

  getDataFromApi = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await getPermissionAndroid();
        if (!granted) {
          throw new Error();
        }
      }

      const url = FILES_URL;
      const path = `${RNFS.DocumentDirectoryPath}/reactNativePet.csv`;
      this.setLoadingState(LoadingState.Loading);

      await this.downloadFile(url, path);
      await this.readFile(path, 'ascii');
    } catch (error) {
      this.setLoadingState(LoadingState.Reject);
      console.log(error);
    }
  };

  setLoadingState = (loadingState: LoadingState) => {
    this.loadingState = loadingState;
  };

  setData = (data: IFile[]) => {
    this.data = data;
  };
}
