import {PermissionsAndroid} from 'react-native';
import {IApi, IFile} from './types';

export const getPermissionAndroid = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: 'CSV File Download Permission',
        message: 'Your permission is required to save the file to your device',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    }
    Alert.alert(
      'Save remote CSV File',
      'Grant Me Permission to save CSV File',
      [{text: 'OK', onPress: () => console.log('OK Pressed')}],
      {cancelable: false},
    );
  } catch (err) {
    Alert.alert(
      'Save remote CSV File',
      'Failed to save CSV File: ' + err.message,
      [{text: 'OK', onPress: () => console.log('OK Pressed')}],
      {cancelable: false},
    );
  }
};

export function csvToObj(csv: string) {
  var lines = csv.split('\n');

  var result = [];
  var headers = lines[0].split(',');

  for (var i = 1; i < lines.length; i++) {
    var obj = {};
    var currentline = lines[i].split(',');

    for (var j = 0; j < headers.length; j++) {
      obj[headers[j]] = currentline[j];
    }

    // Генерируем уникальные id'шники, если нет
    if (obj['id'] === undefined) {
      obj['id'] = i.toString();
    }

    result.push(obj);
  }

  return result;
}

export const isApiData = (data: any): data is IApi[] => {
  // Проверяем, что data массив объектов
  return (
    Array.isArray(data) &&
    data.every(item => {
      return (
        // Проверяем, что у item есть свойство id
        item.hasOwnProperty('id') &&
        typeof item.id === 'string' &&
        // Проверяем, что у item есть свойство name
        item.hasOwnProperty('name') &&
        typeof item.name === 'string' &&
        // Проверяем, что у item есть свойство price
        item.hasOwnProperty('price') &&
        typeof item.price === 'number'
      );
    })
  );
};

export const isFileData = (data: any): data is IFile[] => {
  // Проверяем, что data массив объектов
  return (
    Array.isArray(data) &&
    data.every(item => {
      return (
        // Проверяем, что у item есть свойство id
        item.hasOwnProperty('id') &&
        typeof item.id === 'string' &&
        // Проверяем, что у item есть свойство industry
        item.hasOwnProperty('industry') &&
        typeof item.industry === 'string' &&
        // Проверяем, что у item есть свойство value
        item.hasOwnProperty('value') &&
        typeof item.value === 'string'
      );
    })
  );
};

