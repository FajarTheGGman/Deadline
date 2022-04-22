import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, AsyncStorage, StatusBar } from 'react-native'
import axios from 'axios'
import Icons from 'react-native-vector-icons/Ionicons'
import konfigurasi from '../../config'

export default class Leaderboard extends Component {
    constructor(props){
        super(props)
        
        this.state = {
            data: [],
            next_lecture: [],
            lessons: [],
            major: '',
            class: '',
            lecture: ''
        }
    }
    
    componentDidMount(){
        const dayOrigin = new Date().getDay();
        const dayName = (dayOrigin) => {
            const day = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            return day[dayOrigin];
        }

        const day = dayName(dayOrigin);

        AsyncStorage.getItem('token').then(token => {
            axios.post(konfigurasi.server + "location/get", {
                token: token,
                secret: konfigurasi.secret
            }).then(res => {
                if(res.data.location){
                    this.setState({
                        end_location: res.data.location[0].location,
                        end_lat: res.data.location[0].latitude,
                        end_lon: res.data.location[0].longitude
                    })
                }
            })

            axios.post(konfigurasi.server + "auth/profile", {
                token: token,
                secret: konfigurasi.secret
            }).then(res => {
                if(res.status == 200){
                    this.setState({
                        major: res.data.major,
                        class: res.data.class,
                    })
                }
            })

            axios.post(konfigurasi.server + 'lessons/getall', {
                token: token,
                secret: konfigurasi.secret,
                day: day.toLowerCase()
            }).then(res => {
                if(res.data.lessons){
                    this.setState({
                        lessons: this.state.lessons.concat(res.data.lessons)
                    })
                    let get_time = new Date().getHours() + ':' + new Date().getMinutes();
                    this.setState({ time: get_time })
                    this.state.lessons.map(item => {
                        if(item.date > get_time){
                            this.setState({ 
                                next_lecture: this.state.next_lecture.concat(item),
                                lecture: item.lessons
                            })

                            axios.post(konfigurasi.server + 'attendance/getall', {
                                token: token,
                                secret: konfigurasi.secret,
                                lessons: this.state.lecture
                            }).then(res => {
                                this.setState({ data: this.state.data.concat(res.data.data) })
                            })
                        }
                    })
                }
            })
        })
    }


    render(){
        return(
            <ScrollView style={{ flexGrow: 1, flexDirection: 'column', backgroundColor: 'white' }}>
                <StatusBar backgroundColor={"#4E9F3D"} barStyle={"dark-content"} />
                <View style={{ flexDirection: 'column', alignItems: 'center', marginTop: 25 }}>
                    <Image source={require('../../assets/illustrations/leaderboard/banner.png')} style={{ width: 260, height: 140 }} />
                    <Text style={{ marginTop: 15, fontWeight: 'bold', fontSize: 17 }}>Attendance of {this.state.lecture}</Text>
                </View>

                <View style={{ marginTop: 25, paddingBottom: 25, marginLeft: 20, marginRight: 20 }}>
                    {this.state.data.length == 0 ? <View style={{ marginTop: 65, alignItems: 'center', flexDirection: 'column', justifyContent: 'center' }}>
                        <Icons name='logo-dropbox' size={80} color="grey" />
                        <Text style={{ fontWeight: 'bold', color: 'grey' }}>Leaderboards not available yet!</Text>
                    </View>: this.state.data.map((x,y) => {
                        return <View style={{ backgroundColor: 'white', marginTop: 25, padding: 10, borderRadius: 20, elevation: 15, flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            {x.picture.length == 0 ? x.gender == 'male' ? <Image source={require('../../assets/illustrations/male.png')} style={{ width: 50, height: 50, borderRadius: 100 }} /> : <Image source={require('../../assets/illustrations/female.png')} style={{ width: 50, height: 50, borderRadius: 100 }} /> : <Image source={{ uri: x.picture }} style={{ width: 50, height: 50, borderRadius: 100 }} />}
                            <View style={{ flexDirection: 'column', marginLeft: 10 }}>
                                <Text style={{ fontWeight: 'bold', fontSize: 15 }}>{x.name}</Text>
                                <Text style={{ fontSize: 12 }}>@{x.username}</Text>
                            </View>
                        </View>

                        <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginRight: 10 }}>
                            <Text>{x.time}</Text>
                        </View>
                    </View>

                    })}
                </View>
            </ScrollView>
        )
    }
}
