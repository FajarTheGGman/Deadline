import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput, Image, AsyncStorage, StatusBar } from 'react-native';
import axios from 'axios';
import konfigurasi from '../../config'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Loading from 'react-native-loading-spinner-overlay';
import { StackActions } from '@react-navigation/native';

export default class Login extends Component {
    constructor(props){
        super(props);
        this.state = {
            username: '',
            password: '',
            error: '',
            wrong: false,
            loading: false
        }
    }

    componentDidMount(){
        AsyncStorage.getItem('token').then((token) => {
            if(token){
                axios.post(konfigurasi.server + "auth/profile", {
                    token: token,
                    secret: konfigurasi.secret
                }).then(res => {
                    if(res.status == 200){
                        if(res.data.level == 'admin'){
                            this.props.navigation.dispatch(
                                StackActions.replace('Admin')
                            );
                        }else if(res.data.level == 'developer'){
                            this.props.navigation.dispatch(
                                StackActions.replace('Admin')
                            );
                        }else if(res.data.level == 'students'){
                            this.props.navigation.dispatch(
                                StackActions.replace('Home')
                            );
                        }else if(res.data.level == 'teacher'){
                            this.props.navigation.dispatch(
                                StackActions.replace('Teacher')
                            );
                        }
                    }
                })
            }
        })
    }

    async login(){
        this.setState({ loading: true })
        await axios.post(konfigurasi.server + 'auth/login', {
            username: this.state.username,
            password: this.state.password
        }).then((res) => {
            if(res.data.success){
                this.setState({ loading: false })
                AsyncStorage.setItem('token', res.headers.token).then(() => {
                    if(res.headers.level == 'admin'){
                        this.props.navigation.dispatch(
                            StackActions.replace('Admin')
                        );
                    }else if(res.headers.level == 'developer'){
                        this.props.navigation.dispatch(
                            StackActions.replace('Admin')
                        );
                    }else if(res.headers.level == 'teacher'){
                        this.props.navigation.dispatch(
                            StackActions.replace('Teacher')
                        );

                    }else{
                        this.props.navigation.dispatch(
                            StackActions.replace('Home')
                        );
                    }
                })
            }else{
                this.setState({ loading: false })
                this.setState({ wrong: true })
            }
        })
    }

    render(){
        return(
            <View style={{ flex: 1, flexDirection: 'column', backgroundColor: 'white' }}>
                <StatusBar backgroundColor="white" barStyle="dark-content" />
                <Loading visible={this.state.loading} textContent={"Please Wait..."} textStyle={{ fontWeight: 'bold' }} />

                <Modal visible={this.state.wrong} animationType="slide">
                    <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <View style={{ backgroundColor: 'white', padding: 15, borderRadius: 10, alignItems: 'center' }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 17 }}>Wrong Credentials!</Text>
                            <Image source={require('../../assets/illustrations/wrong.png')} style={{ width: 150, height: 150, marginTop: 10, marginBottom: 10 }} />
                            <Text style={{ fontSize: 15, marginTop: 10 }}>Your username or password</Text>
                            <Text style={{ fontSize: 15 }}>Is wrong</Text>

                            <TouchableOpacity onPress={() => this.setState({ wrong: false })}>
                                <Text style={{ fontSize: 15, marginTop: 10, color: '#00a8ff' }}>Try Again</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

                <View style={{ flex: 1, alignItems: 'center', marginTop: 25, justifyContent: 'space-between' }}>
                    <View style={{ alignItems: 'center' }}>
                        <Image source={require('../../assets/illustrations/login.png')} style={{ width: 240, height: 200 }} />
                        <View style={{ alignItems: 'center', marginTop: 15 }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 25 }}>Wellcome <Text style={{ color: '#4E9F3D' }}>Students!</Text></Text>
                            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Make your daily school life</Text>
                            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>More Productive with this app!</Text>
                        </View>
                    </View>
                    
                    <KeyboardAwareScrollView contentContainerStyle={{ marginBottom: 30 }} extraScrollHeight={100} keyboardVerticalOffset={120}>
                        <View style={{ marginTop: 95 }}>
                            <TextInput style={{ backgroundColor: '#ededed', padding: 10, borderRadius: 5, width: 300 }} placeholder="Input Your Username" onChangeText={(val) => this.setState({ username: val })} />
                            <TextInput style={{ backgroundColor: '#ededed', padding: 10, borderRadius: 5, width: 300, marginTop: 15 }} secureTextEntry={true} placeholder="Input Your Password" onChangeText={(val) => this.setState({ password: val })} />
                            <TouchableOpacity style={{ backgroundColor: '#4E9F3D', padding: 10, borderRadius: 5, width: 300, marginTop: 15, alignItems: 'center' }} onPress={() => this.login()}>
                                <Text style={{ fontWeight: 'bold' }}>Login</Text>
                            </TouchableOpacity>
                        </View>
                    </KeyboardAwareScrollView>
                </View>
            </View>
        )
    }
}
