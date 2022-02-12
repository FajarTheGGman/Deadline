import React, { Component } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Picker, Image, AsyncStorage, StatusBar } from 'react-native'
import axios from 'axios'
import konfigurasi from '../../config'
import Swiper from 'react-native-swiper'
import { StackActions } from '@react-navigation/native';

export default class Guide extends Component{
    constructor(props){
        super(props)

        this.state = {
            getClass: [],
            getMajor: [],
            fullname: '',
            username: '',
            password: '',
            grade: '',
            major: '',
            gender: 'male'
        }
    }

    componentDidMount(){
        axios.post(konfigurasi.server + 'class/get').then(res => {
            if(res.status == 200){
                this.setState({ getClass: this.state.getClass.concat(res.data.class) })
                this.setState({ grade: res.data.class[0].class })
            }
        })

        axios.post(konfigurasi.server + 'class/major/get').then(res => {
            if(res.status == 200){
                this.setState({ getMajor: this.state.getMajor.concat(res.data.major) })
                this.setState({ major: res.data.major[0].major })
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
                AsyncStorage.setItem('token', res.headers.token).then(() => {
                    if(res.headers.level == 'admin'){
                        this.props.navigation.dispatch(
                            StackActions.replace('Admin')
                        );
                    }else{
                        this.props.navigation.dispatch(
                            StackActions.replace('Home')
                        );
                    }
                })
            }else{

            }
        })
    }

    register(){
       axios.post(konfigurasi.server + 'auth/register', {
            name: this.state.fullname,
            username: this.state.username,
            password: this.state.password,
            class: this.state.grade,
            major: this.state.major,
            gender: this.state.gender
        }).then(res => {
            if(res.status == 200){
                this.login()
            }
        })
    }

    render(){
        return(
            <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', backgroundColor: 'white' }}>
                <StatusBar barStyle={'dark-content'} backgroundColor={"white"} />

                <Swiper showsButton={true}>
                    <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ fontWeight: "bold", fontSize: 23 }}>Who Are You ?</Text>
                        <Image source={require('../../assets/illustrations/exam.png')} style={{ width: 220, height: 180 }} />
                        <Text>Are you students or teacher ?</Text>

                        <TouchableOpacity style={{ backgroundColor: '#4E9F3D', padding: 10, borderRadius: 10, marginTop: 40, elevation: 15 }}>
                            <Text style={{ fontWeight: "bold" }}>I'am a Student</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={{ backgroundColor: 'black', padding: 10, borderRadius: 10, marginTop: 25, elevation: 15 }}>
                            <Text style={{ fontWeight: "bold", color: 'white' }}>I'am a Teacher</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ fontWeight: "bold", fontSize: 23 }}>Wellcome Students !</Text>
                        <Image source={require('../../assets/illustrations/signin.png')} style={{ width: 290, height: 220, marginTop: 15 }} />
                        <Text style={{ marginTop: 20 }}>Before we begin, please fill this forms below</Text>

                        <TextInput placeholder="What is your username ?" style={{ backgroundColor: 'white', elevation: 15, borderRadius: 10, marginTop: 15, padding: 10 }} onChangeText={(val) => this.setState({ username: val })} />
                        <TextInput placeholder="What is your password ?" style={{ backgroundColor: 'white', elevation: 15, borderRadius: 10, marginTop: 15, padding: 10 }} secureTextEntry={true} onChangeText={(val) => this.setState({ password: val })} />
                    </View>

                    <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ fontWeight: "bold", fontSize: 23 }}>What is your name ?</Text>
                        <Image source={require('../../assets/illustrations/wellcome.png')} style={{ width: 200, height: 230, marginTop: 15 }} />
                        <Text style={{ marginTop: 20 }}>Before we begin, please fill this forms below</Text>

                        <TextInput placeholder="What is your Full Name ?" style={{ backgroundColor: 'white', elevation: 15, borderRadius: 10, marginTop: 15, padding: 10 }} onChangeText={(val) => this.setState({ fullname: val })} />
                    </View>

                    <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ fontWeight: "bold", fontSize: 23 }}>What is your gender ?</Text>
                        <Image source={require('../../assets/illustrations/gender.png')} style={{ width: 260, height: 220, marginTop: 15 }} />
                        <Text style={{ marginTop: 20 }}>Choose your gender here.</Text>

                        <View style={{ backgroundColor: 'white', elevation: 15, borderRadius: 10, padding: 5, marginTop: 25 }}>
                            <Picker
                                selectedValue={this.state.gender}
                                style={{ height: 50, width: 250 }}
                                onValueChange={(itemValue, itemIndex) => this.setState({ gender: itemValue }
                                )}>
                                <Picker.Item label="I'm Male" value="male" />
                                <Picker.Item label="I'm Female" value="female" />
                            </Picker>
                        </View>
                    </View>

                    <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ fontWeight: "bold", fontSize: 23 }}>What is your grade ?</Text>
                        <Image source={require('../../assets/illustrations/grade.png')} style={{ width: 260, height: 220, marginTop: 15 }} />
                        <Text style={{ marginTop: 20 }}>Choose your grade here, </Text>
                        <Text>So we can know what lecture you are</Text>

                        <View style={{ backgroundColor: 'white', elevation: 15, borderRadius: 10, padding: 5, marginTop: 25 }}>
                            <Picker
                                selectedValue={this.state.grade}
                                style={{ height: 50, width: 250 }}
                                onValueChange={(itemValue, itemIndex) => this.setState({ grade: itemValue }
                                )}>
                                {this.state.getClass.map((val, index) => {
                                    return <Picker.Item label={'Class - ' + val.class} value={val.class} key={index} />
                                })}
                            </Picker>
                        </View>
                    </View>

                    <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ fontWeight: "bold", fontSize: 23 }}>What is your major ?</Text>
                        <Image source={require('../../assets/illustrations/major.png')} style={{ width: 270, height: 270, marginTop: 15 }} />
                        <Text style={{ marginTop: 20 }}>Choose your majors here, </Text>
                        <Text>So we can know what lecture you are</Text>

                        <View style={{ backgroundColor: 'white', elevation: 15, borderRadius: 10, padding: 5, marginTop: 25 }}>
                            <Picker
                                selectedValue={this.state.grade}
                                style={{ height: 50, width: 250 }}
                                onValueChange={(itemValue, itemIndex) => this.setState({ grade: itemValue }
                                )}>
                                {this.state.getMajor.map((val, index) => {
                                    return <Picker.Item label={val.major} value={val.major} key={index} />
                                })}
                            </Picker>
                        </View>
                    </View>

                    <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ fontWeight: "bold", fontSize: 23 }}>Yup i think all done.</Text>
                        <Image source={require('../../assets/illustrations/done.png')} style={{ width: 220, height: 220, marginTop: 15 }} />
                        <Text style={{ marginTop: 10 }}><Text style={{ fontWeight: 'bold' }}>Congratulations!</Text>, you are finnaly joining us</Text>

                        <TouchableOpacity style={{ backgroundColor: '#4E9F3D', borderRadius: 10, elevation: 15, marginTop: 25, padding: 10 }} onPress={() => this.register()}>
                            <Text style={{ fontWeight: 'bold' }}>Let's get to home</Text>
                        </TouchableOpacity>
                    </View>
                </Swiper>
            </View>
        )
    }
}
