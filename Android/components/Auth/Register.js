import React, { Component } from 'react';
import { View, Text, Picker, TouchableOpacity, ScrollView, TextInput, Image, AsyncStorage, StatusBar } from 'react-native';
import axios from 'axios';
import konfigurasi from '../../config'
import Modal from 'react-native-modal';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

export default class Login extends Component {
    constructor(props){
        super(props);
        this.state = {
            fullname: '',
            username: '',
            password: '',
            class: null,
            gender: 'male',
            error: false,
            loading: false
        }
    }

    componentDidMount(){
        AsyncStorage.getItem('token').then((token) => {
            if(token){
                this.props.navigation.navigate('Home');
            }
        })
    }

    render(){
        return(
            <ScrollView contentContainerStyle={{ flex: 1, flexDirection: 'column', backgroundColor: 'white' }}>
                <StatusBar backgroundColor="white" barStyle="dark-content" />
                <View style={{ flex: 1, alignItems: 'center', marginTop: 25, justifyContent: 'space-between' }}>
                    <View style={{ alignItems: 'center' }}>
                        <Image source={require('../../assets/illustrations/login.png')} style={{ width: 240, height: 200 }} />
                        <View style={{ alignItems: 'center', marginTop: 15 }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 25 }}>Wellcome <Text style={{ color: '#4E9F3D' }}>Students!</Text></Text>
                            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Register your new account</Text>
                            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Right over here!</Text>
                        </View>
                    </View>
                    
                    <KeyboardAwareScrollView contentContainerStyle={{ marginBottom: 50 }} >
                        <View style={{ marginTop: 40, paddingBottom: 15 }}>
                            <TextInput style={{ backgroundColor: '#ededed', padding: 10, borderRadius: 5, width: 300 }} placeholder="Input Your Full Name" />
                            <TextInput style={{ backgroundColor: '#ededed', marginTop: 15, padding: 10, borderRadius: 5, width: 300 }} placeholder="Input Your Username" />
                            <TextInput style={{ backgroundColor: '#ededed', padding: 10, borderRadius: 5, width: 300, marginTop: 15 }} secureTextEntry={true} placeholder="Input Your Password" />
                            <View style={{ backgroundColor: '#ededed', marginTop: 15, borderRadius: 5 }}>
                                <Picker selectedValue={this.state.class} onValueChange={(x, y) => this.setState({ class: x })}>
                                    <Picker.Item label="Class - 12 RPL" value='' />
                                    <Picker.Item label="Class - 12 TKJ" value="" />
                                </Picker>
                            </View>
                            <View style={{ backgroundColor: '#ededed', marginTop: 15, borderRadius: 5 }}>
                                <Picker selectedValue={this.state.gender} onValueChange={(x, y) => this.setState({ gender: x })}>
                                    <Picker.Item label="Male" value="male" />
                                    <Picker.Item label="Female" value="female" />
                                </Picker>
                            </View>
                            <TouchableOpacity style={{ backgroundColor: '#4E9F3D', padding: 10, borderRadius: 5, width: 300, marginTop: 15, alignItems: 'center' }} onPress={() => this.x()}>
                                <Text style={{ fontWeight: 'bold' }}>Register</Text>
                            </TouchableOpacity>
                            <Text style={{ marginTop: 10, alignSelf: 'center' }}>If you already register try register <Text onPress={() => this.props.navigation.navigate('Login')} style={{ color: '#4E9F3D' }}>Here!</Text></Text>
                        </View>
                    </KeyboardAwareScrollView>
                </View>
            </ScrollView>
        )
    }
}
