import React, { Component } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Image, AsyncStorage, StatusBar } from 'react-native';
import axios from 'axios';
import konfigurasi from '../../config';

export default class Username extends Component{
    constructor(props){
        super(props);
        this.state = {
            name: '',
        }
    }

    componentDidMount(){
        AsyncStorage.getItem('token').then(token => {
            axios.post(konfigurasi.server + 'auth/profile', {
                token: token,
                secret: konfigurasi.secret
            }).then(res => {
                if(res.status == 200){
                    this.setState({ name: res.data.name })
                }
            }).catch(err => {
                alert('Error');
            })
        })
    }

    change(){
        AsyncStorage.getItem('token').then(token => {
            axios.post(konfigurasi.server + "auth/fullname", {
                token: token,
                secret: konfigurasi.secret,
                name: this.state.name
            }).then(res => {
                if(res.data.success){
                    alert('Name has been changed');
                }else{
                    alert('Name is not changed');
                }
            }).catch(err => {
                alert('Name is not changed');
            })
        })
    }

    render(){
        return(
            <ScrollView style={{ flexGrow: 1, flexDirection: 'column', backgroundColor: 'white' }}>
                <StatusBar barStyle={"dark-content"} backgroundColor='white' />
                <View style={{ flexDirection: 'column', alignItems: 'center', marginTop: 100 }}>
                    <Image source={require('../../assets/illustrations/passwords.png')} style={{ width: 160, height: 160 }} />

                    <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Did you want to change your name ? </Text>
                    <Text style={{ fontWeight: 'bold', backgroundColor: "white", elevation: 15, padding: 10, borderRadius: 10, marginTop: 15, marginBottom: 10 }}>@{this.state.name}</Text>
                    <TextInput style={{ backgroundColor: '#ededed', padding: 10, borderRadius: 5, width: 300, marginTop: 15 }} placeholder="Input Your New Name Here" onChangeText={(val) => this.setState({ name: val })} />
                    <TouchableOpacity style={{ backgroundColor: '#4E9F3D', padding: 10, borderRadius: 5, width: 300, marginTop: 15, alignItems: 'center' }} onPress={() => this.change()}>
                        <Text style={{ fontWeight: 'bold' }}>Change my name!</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        )
    }
}
