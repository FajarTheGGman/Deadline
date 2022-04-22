import React, { Component } from 'react';
import { View, Text, TouchableOpacity, TextInput, Picker, Image, AsyncStorage, StatusBar } from 'react-native'
import axios from 'axios'
import konfigurasi from '../../config'
import Swiper from 'react-native-swiper'
import { StackActions } from '@react-navigation/native';

export default class Banner extends Component{
    constructor(props){
        super(props)

        this.state = {
            dev: "{ Developer: Fajar Firdaus }",
            ver: "{ Version: 1.0.0 }"
        }
    }

    componentDidMount(){
        AsyncStorage.getItem('token').then((token) => {
            if(token){
                AsyncStorage.getItem('level')
                .then(res => {
                        if(res == 'admin'){
                            this.props.navigation.dispatch(
                                StackActions.replace('Admin')
                            );
                        }else if(res == 'developer'){
                            this.props.navigation.dispatch(
                                StackActions.replace('Admin')
                            );
                        }else if(res == 'students'){
                            this.props.navigation.dispatch(
                                StackActions.replace('Home')
                            );
                        }else if(res == 'teacher'){
                            this.props.navigation.dispatch(
                                StackActions.replace('Teacher')
                            );
                        }
                })
            }
        })

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

                    <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ fontWeight: "bold", fontSize: 23 }}>So what is "Dead Line" ? </Text>
                        <Image source={require('../../assets/illustrations/mobile.png')} style={{ width: 220, height: 220, marginTop: 15 }} />
                        <Text style={{ marginTop: 20 }}><Text style={{ fontWeight: 'bold' }}>Dead Line</Text> is application for manage your activities </Text>
                        <Text>and this is for improve your productivity on school</Text>
                    </View>

                    <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ fontWeight: "bold", fontSize: 23 }}>What Dead Line can do ?</Text>
                        <Image source={require('../../assets/illustrations/feature.png')} style={{ width: 270, height: 220, marginTop: 15 }} />
                        <Text>There's some feature deadline can do thats like</Text>
                        <Text style={{ fontWeight: 'bold' }}>Lecture, Attendance, Homework, Events, and Inbox</Text>
                    </View>

                    <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ fontWeight: "bold", fontSize: 23 }}>How can i get attendance ?</Text>
                        <Image source={require('../../assets/illustrations/maps.png')} style={{ width: 280, height: 220, marginTop: 15 }} />
                        <Text style={{ marginTop: 10 }}>If you want to attendance for your class</Text>
                        <Text><Text style={{ fontWeight: 'bold' }}>Dead Line</Text> attendance only works for <Text style={{ fontWeight: 'bold' }}>5 - 10 meters</Text></Text>
                        <Text><Text style={{ fontWeight: 'bold' }}>From your school</Text>, so you should be closer to school</Text>
                    </View>

                    <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ fontWeight: "bold", fontSize: 23 }}>Let's getting started !</Text>
                        <Image source={require('../../assets/illustrations/engineer.png')} style={{ width: 320, height: 220, marginTop: 15 }} />
                        <Text style={{ marginTop: 10 }}>The Question is are you already sign up ?</Text>
                        <TouchableOpacity style={{ marginTop: 15, backgroundColor: '#4E9F3D', padding: 10, borderRadius: 15, elevation: 15 }} onPress={() => this.props.navigation.navigate('Login')}>
                            <Text style={{ fontWeight: 'bold' }}>Yes i've been sign up</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={{ marginTop: 25, backgroundColor: 'black', padding: 10, borderRadius: 15, elevation: 15 }} onPress={() => this.props.navigation.navigate('Guide')}>
                            <Text style={{ fontWeight: 'bold', color: 'white' }}>No i haven't been sign up</Text>
                        </TouchableOpacity>
                    </View>
                </Swiper>
            </View>
        )
    }
}
