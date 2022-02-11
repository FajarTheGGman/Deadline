import React, { Component } from 'react';
import { View, Text, TouchableOpacity, TextInput, Picker, Image, AsyncStorage, StatusBar } from 'react-native'
import axios from 'axios'
import konfigurasi from '../../config'
import Swiper from 'react-native-swiper'

export default class Banner extends Component{
    constructor(props){
        super(props)

        this.state = {
            dev: "{ Developer: Fajar Firdaus }",
            ver: "{ Version: 1.0.0 }"
        }
    }
    render(){
        return(
            <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', backgroundColor: 'white' }}>
                <StatusBar barStyle={'dark-content'} backgroundColor={"white"} />

                <Swiper showsButton={true}>
                    <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <Image source={require('../../assets/icon.png')} style={{ width: 160, height: 160 }} />
                        <Text style={{ fontWeight: 'bold', fontSize: 20, marginTop: 10 }}>Dead Line</Text>
                        <Text>Application for improve your </Text>
                        <Text> productivity as students</Text>
                        <View style={{ marginTop: 90, alignItems: 'center' }}>
                            <Text>{this.state.dev}</Text>
                            <Text>{this.state.ver}</Text>
                        </View>
                    </View>

                    <View>
                    </View>
                </Swiper>
            </View>
        )
    }
}
