import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Dimensions, FlatList, ActivityIndicator, Alert, StatusBar } from 'react-native';
import axios from 'axios';

export default class Class extends Component{
    render(){
        return(
            <View style={{ flex: 1, flexDirection: 'column', backgroundColor: 'white' }}>
                <StatusBar backgroundColor="white" barStyle="dark-content" />
            </View>
        )
    }
}
