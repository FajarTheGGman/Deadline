import React, { Component } from 'react';
import { View, Text, Image, FlatList, AsyncStorage, TouchableOpacity, ScrollView, StatusBar, ImageBackground } from 'react-native';
import axios from 'axios';
import konfigurasi from '../../config'
import Icons from 'react-native-vector-icons/Ionicons';

export default class Profile extends Component{
    constructor(props){
        super(props);
        this.state = {
            name: null,
            username: null,
            class: null,
            major: '',
            since: null,
            picture: '',
            gender: 'male',
            lessons: [],
            level: '',
            admin: false
        }
    }

    componentDidMount(){
        AsyncStorage.getItem('token').then(async token => {
            if(this.props.route.params.users == 'me'){
                await axios.post(konfigurasi.server + "auth/profile", {
                    token: token,
                    secret: konfigurasi.secret,
                }).then(res => {
                    if(res.status == 200){
                        if(res.data.level != 'students'){
                            this.setState({ admin: true })
                        }

                        if(!res.data.class){
                            this.setState({ 
                                name: res.data.name,
                                username: res.data.username,
                                class: res.data.level == 'developer' ? 'dev' : res.data.level,
                                major: res.data.level == 'developer' ? 'dev' : res.data.level,
                                since: res.data.since,
                                picture: res.data.picture,
                                level: res.data.level,
                                gender: res.data.gender
                            })
                        }else{
                            this.setState({
                                name: res.data.name,
                                username: res.data.username,
                                class: res.data.class,
                                major: res.data.major,
                                since: res.data.since,
                                picture: res.data.picture,
                                gender: res.data.gender,
                                level: res.data.level
                            })
                        }
                    }
                }).catch(err => {
                    console.log(err)
                })
            }else{
                await axios.post(konfigurasi.server + "auth/profile?users=true", {
                    token: token,
                    secret: konfigurasi.secret,
                    users: this.props.route.params.users
                }).then(res => {
                    if(res.status == 200){
                        if(res.data.level != 'students'){
                            this.setState({ admin: true })
                        }
    
                        if(res.data.major == undefined && res.data.class == undefined){
                            this.setState({ 
                                name: res.data.name,
                                username: res.data.username,
                                class: res.data.level == 'developer' ? 'dev' : res.data.level,
                                major: res.data.level == 'developer' ? 'dev' : res.data.level,
                                since: res.data.since,
                                picture: res.data.picture,
                                level: res.data.level
                            })
                        }else{
                            this.setState({
                                name: res.data.name,
                                username: res.data.username,
                                class: res.data.class,
                                major: res.data.major,
                                since: res.data.since,
                                picture: res.data.picture,
                                gender: res.data.gender,
                                level: res.data.level
                            })
                        }
                    }
                }).catch(err => {
                    console.log(err)
                })
            }
            if(this.state.level != 'admin' && this.state.level != 'developer'){
                await axios.post(konfigurasi.server + "lessons/getall", {
                    token: token,
                    secret: konfigurasi.secret
                }).then(res => {
                    if(res.data.lessons){
                        this.setState({
                            lessons: this.state.lessons.concat(res.data.lessons)
                        })
                    }
                }).catch(err => {
                    console.log(err)
                })
            }
        })
    }

    renderStatus = ({ item }) => {
        return(
            <TouchableOpacity style={{ flexDirection: 'row', marginTop: 10, padding: 10 }}>
                <View style={{ flexDirection: 'column', alignItems: 'flex-start', marginLeft: 10, backgroundColor: item.pallete, elevation: 25, padding: 10, borderRadius: 50 }}>
                    <Text style={{ fontSize: 16, color: 'white' }}>{item.status}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    render(){
        return(
            <View style={{ flex: 1, flexDirection: 'column', backgroundColor: 'white' }}>
                <StatusBar backgroundColor="white" barStyle="dark-content" />

                <View style={{ flexDirection: 'column', alignItems: 'center', marginTop: 15 }}>
                    {this.state.picture.length == 0 ? this.state.gender == 'male' ? <Image source={require('../../assets/illustrations/male.png')} style={{ width: 120, height: 120, borderRadius: 100, borderWidth: 2, borderColor: 'black' }} /> : <Image source={require('../../assets/illustrations/female.png')} style={{ width: 120, height: 120, borderRadius: 100, borderWidth: 2, borderColor: 'black' }} /> : <Image source={{ uri: this.state.picture }} style={{ width: 120, height: 120, borderRadius: 100, borderWidth: 2, borderColor: 'black' }} /> }


                    <Text style={{ fontWeight: 'bold', fontSize: 22 }}>{this.state.name} {this.state.admin ? <Icons name='checkmark-circle' size={20} color='#4E9F3D' /> : <Text></Text>}</Text>
                    <Text style={{ fontSize: 16, color: 'grey' }}>{this.state.username == '@deadline' ? this.state.username : '@'+this.state.username}</Text>
                    <Text style={{ color: '#ededed' }}>{this.state.gender == 'male' ? "he/him" : "she/her"}</Text>
               </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 25 }}>
                    <View style={{ flexDirection: 'column', alignItems: 'center', backgroundColor: 'white', elevation: 10, padding: 5, paddingLeft: 10, paddingRight: 10, borderRadius: 10 }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 17 }}>Grade</Text>
                        <Text>{this.state.class}</Text>
                    </View>

                    <View style={{ flexDirection: 'column', alignItems: 'center', backgroundColor: 'white', elevation: 10, padding: 5, paddingLeft: 10, paddingRight: 10, borderRadius: 10 }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 17 }}>Since</Text>
                        <Text>05/02/2022</Text>
                    </View>

                    <View style={{ flexDirection: 'column', alignItems: 'center', backgroundColor: 'white', elevation: 10, padding: 5, paddingLeft: 10, paddingRight: 10, borderRadius: 10 }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 17 }}>Major</Text>
                        <Text>{this.state.major.length > 5 ? this.state.major.slice(0, 5)+'...' : this.state.major}</Text>
                    </View>
                </View>

                <View style={{ marginTop: 25, marginLeft: 10 }}>
                    {this.state.level == 'developer' ? <View style={{ alignItems: 'center', backgroundColor: 'white', elevation: 15, borderRadius: 15, marginRight: 10, padding: 10 }}>
                        <Icons name="logo-android" size={40} />
                        <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Developers</Text>
                        <Text>This account just for developers,</Text>
                        <Text>That's means this account have ability to get</Text>
                        <Text>Full control of this applications</Text>
                    </View> : this.state.admin ? <View style={{ alignItems: 'center', backgroundColor: 'white', elevation: 15, borderRadius: 15, marginRight: 10, padding: 10 }}>
                        <Icons name="school" size={40} />
                        <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Teachers</Text>
                        <Text>This account just for teachers,</Text>
                        <Text>That's means this account have ability to</Text>
                        <Text>Monitor Attendance, Update Lecture</Text>
                        <Text>and Adding Homeworks</Text>
                    </View> :<View>
                        <Text style={{ fontWeight: 'bold', fontSize: 17 }}>Last Lecture</Text>
                        <ScrollView horizontal={true} contentContainerStyle={{ marginTop: 15 }}>
                            {this.state.lessons.map((x,y) => {
                                return <TouchableOpacity style={{ marginLeft: 15, marginRight: 15 }}>
                                <ImageBackground source={require('../../assets/illustrations/lecture/math.png')} style={{ flexDirection: 'column', width: 100, height: 120, borderRadius: 10, padding: 5, borderColor: 'black', borderWidth: 2 }}>
                                    <Text style={{ fontWeight: 'bold', fontSize: 17, color: 'black' }}>{x.lessons.length > 5 ? x.lessons.slice(0, 5)+'..' : x.lessons}</Text>
                                </ImageBackground>
                            </TouchableOpacity>
                            })}
                        </ScrollView>
                    </View> }

                 </View>
            </View>
        )
    }
}
