import React, { Component } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Image, AsyncStorage, StatusBar } from 'react-native';
import axios from 'axios';
import konfigurasi from '../../config';

export default class Passwords extends Component{
    constructor(props){
        super(props);
        this.state = {
            old_password: '',
            new_password: ''
        }
    }

    change(){
        AsyncStorage.getItem('token').then(token => {
            axios.post(konfigurasi.server + "auth/forgot", {
                token: token,
                secret: konfigurasi.secret,
                old_password: this.state.old_password,
                new_password: this.state.new_password
            }).then(res => {
                if(res.data.success){
                    alert('Password has been changed');
                }else{
                    alert('Password is not changed');
                }
            }).catch(err => {
                alert('Password is not changed');
            })
        })
    }

    render(){
        return(
            <ScrollView style={{ flexGrow: 1, flexDirection: 'column', backgroundColor: 'white' }}>
                <StatusBar barStyle={"dark-content"} backgroundColor='white' />
                <View style={{ flexDirection: 'column', alignItems: 'center', marginTop: 100 }}>
                    <Image source={require('../../assets/illustrations/passwords.png')} style={{ width: 160, height: 160 }} />

                    <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Did You Forgot Your Passwords ? </Text>
                    <TextInput style={{ backgroundColor: '#ededed', padding: 10, borderRadius: 5, width: 300, marginTop: 15 }} secureTextEntry={true} placeholder="Input Your Old Password Here" onChangeText={(val) => this.setState({ old_password: val })} />
                    <TextInput style={{ backgroundColor: '#ededed', padding: 10, borderRadius: 5, width: 300, marginTop: 15 }} secureTextEntry={true} placeholder="Input Your New Password Here" onChangeText={(val) => this.setState({ new_password: val })} />
                    <TouchableOpacity style={{ backgroundColor: '#4E9F3D', padding: 10, borderRadius: 5, width: 300, marginTop: 15, alignItems: 'center' }} onPress={() => this.change()}>
                        <Text style={{ fontWeight: 'bold' }}>Change my password!</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        )
    }
}
