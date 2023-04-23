import React from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {Colors} from '../constants';
import {IApi, IFile} from '../types';
import {isApiData, isFileData} from '../utils';

interface Props {
  data: IApi[] | IFile[];
}

function Content({data}: Props): JSX.Element {
  return (
    <View style={styles.wrapper}>
      <ScrollView style={styles.list}>
        {isApiData(data) &&
          data.map(item => {
            const {id, name, price} = item;
            return (
              <View key={id} style={styles.item}>
                <Text style={styles.text}>{name}</Text>
                <Text style={styles.text}>{price}</Text>
              </View>
            );
          })}
        {isFileData(data) &&
          data.map(item => {
            const {id, industry, value} = item;
            return (
              <View key={id} style={styles.item}>
                <Text style={styles.text}>{industry}</Text>
                <Text style={styles.text}>{value}</Text>
              </View>
            );
          })}
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
  list: {},
  item: {
    flexDirection: 'row',
  },
  text: {
    width: '50%',
  },
});

export default Content;
