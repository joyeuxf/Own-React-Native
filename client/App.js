import React from 'react';
import { StyleSheet, View, StatusBar, LogBox } from 'react-native';
import AppNavigator from './navigations/AppNavigator';
import { Provider } from 'react-redux';
import store from './redux/store';
import * as eva from '@eva-design/eva';
import { ApplicationProvider } from '@ui-kitten/components';
import { default as mapping } from './mapping.json';

export default function App() {
  LogBox.ignoreLogs(['Warning: ...']);

  return (
    <ApplicationProvider
      {...eva}
      theme={eva.dark}
      customMapping={mapping}
    >

      <Provider store={store}>
        <StatusBar
          animated={true}
          backgroundColor="#000"

        />
        <View style={styles.container}>
          <AppNavigator />
        </View>
      </Provider>
    </ApplicationProvider>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D131F'
  }
})
