import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import html_script from './map'

export default class Testing extends Component {
  render() {
    return (
        <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center' }}>
            <WebView
                source={{ html: html_script }}
                style={{ marginTop: 20, width: 300, height: 100 }}
            />
        </View>
    );
  }
}
