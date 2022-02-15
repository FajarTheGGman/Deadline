import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, AsyncStorage, Image, ScrollView, StatusBar } from 'react-native'
import axios from 'axios'
import SwipeUpDownModal from 'react-native-swipe-modal-up-down'
import Icons from 'react-native-vector-icons/Ionicons'
import konfigurasi from '../../config'

export default class AttendanceAdmin extends Component{
    constructor(props){
        super(props)

        this.state = {
            data: [],
            user: '',
            class: ''
        }
    }

    componentDidMount(){
        AsyncStorage.getItem('token').then(token => {
            axios.post(konfigurasi.server + 'attendance/getall', {
                token: token,
                secret: konfigurasi.secret,
                username: this.state.user,
                class: this.state.class
            }).then(res => {
                if(res.data.success){
                    this.setState({ data: this.state.data.concat(res.data.data) })
                }
            })
        })
    }

    search(){
        AsyncStorage.getItem('token').then(token => {
            axios.post(konfigurasi.server + 'attendance/getall', {
                token: token,
                secret: konfigurasi.secret,
                username: this.state.user,
                class: this.state.class
            }).then(res => {
                if(res.data.success){
                    this.setState({ data: [] })
                    this.setState({ data: res.data.data })
                }
            })
        })
    }

    render(){
        return(
            <ScrollView contentContainerStyle={{ flex: 1, flexDirection: 'column', backgroundColor: 'white' }}>
                <StatusBar backgroundColor='white' barStyle='dark-content' />

                <View style={{ marginTop: 25 }}>
                    <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                        <View style={{ flexDirection: 'row', backgroundColor: '#ededed', width: 270, padding: 10, borderRadius: 10, alignItems: 'center' }}>
                            <Icons name="search-outline" size={20} color="black" />
                            <TextInput placeholder="Search Users" style={{ width: 200, marginLeft: 10 }} onChangeText={(val) => this.setState({ user: val })} />
                        </View>
                        <TouchableOpacity style={{ backgroundColor: "#4E9F3D", padding: 10, borderRadius: 10, marginLeft: 8 }} onPress={() => this.search()}>
                            <Icons name="search-outline" size={25} color="black" />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={{ flexDirection: 'row', alignSelf: 'flex-start', marginLeft: 20, marginTop: 10 }}>
                    <TouchableOpacity onPress={() => this.setState({ addEvents: true })}>
                        <Text style={{ color: '#4E9F3D' }}>Filters</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ flexDirection: 'column', marginTop: 25 }}>
                    <Text style={{ marginLeft: 15, fontWeight: 'bold', fontSize: 18 }}>All Attendance</Text>
                    {this.state.data.map((x,y) => {
                        return <View style={{ backgroundColor: 'white', padding: 10, marginLeft: 10, marginRight: 10, elevation: 15, borderRadius: 15, flexDirection: 'row', justifyContent: 'space-between', marginTop: 25 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Image source={require('../../assets/illustrations/male.png')} style={{ width: 50, height: 50, borderRadius: 100 }} />
                            <View style={{ flexDirection: 'column', marginLeft: 10 }}>
                                <Text style={{ fontWeight: 'bold' }}>{x.name}</Text>
                                <Text>@{x.username}</Text>
                            </View>
                        </View>

                        <View style={{ marginRight: 10, alignItems: 'center' }}>
                            <Text style={{ color: 'grey' }}>{x.time}</Text>
                        </View>
                    </View>

                    })}
                </View>
            </ScrollView>
        )
    }
}
