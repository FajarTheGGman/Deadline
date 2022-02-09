import React, { Component } from 'react'
import { View, StatusBar, Text, TouchableOpacity, Image, AsyncStorage, ScrollView } from 'react-native'
import axios from 'axios'

export default class Notification extends Component{
    render(){
        return(
            <View style={{ flex: 1, flexDirection: 'column', backgroundColor: 'white' }}>
                <StatusBar backgroundColor="white" barStyle="dark-content" />

                <View style={{ marginLeft: 17, marginTop: 15 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 20 }}>What's New ?</Text>
                </View>
            </View>
        )
    }
}
