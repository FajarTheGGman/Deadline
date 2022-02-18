import React, { Component } from 'react';
import { View, Text, TextInput, Picker, TouchableOpacity, AsyncStorage, Image, ScrollView, StatusBar } from 'react-native'
import axios from 'axios'
import SwipeUpDownModal from 'react-native-swipe-modal-up-down'
import Icons from 'react-native-vector-icons/Ionicons'
import konfigurasi from '../../config'

export default class AttendanceAdmin extends Component{
    constructor(props){
        super(props)

        this.state = {
            data: [],
            choose_class: [],
            choose_major: [],
            user: '',
            class: '',
            filter_class: '',
            filter_major: '',
            filter: false
        }
    }

    componentDidMount(){
        AsyncStorage.getItem('token').then(token => {
            axios.post(konfigurasi.server + 'attendance/getall', {
                token: token,
                secret: konfigurasi.secret,
                username: this.state.user,
                class: this.state.filter_class,
                major: this.state.filter_major
            }).then(res => {
                if(res.data.success){
                    this.setState({ data: this.state.data.concat(res.data.data) })
                }
            })

            axios.post(konfigurasi.server + 'class/getall', {
                token: token,
                secret: konfigurasi.secret
            }).then(res => {
                if(res.data.class){
                    this.setState({ choose_class: this.state.choose_class.concat(res.data.class) })
                }
            })

            axios.post(konfigurasi.server + 'class/major/getall', {
                token: token,
                secret: konfigurasi.secret
            }).then(res => {
                if(res.data.majors){
                    this.setState({ choose_major: this.state.choose_major.concat(res.data.majors) })
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
                class: this.state.filter_class,
                major: this.state.filter_major
            }).then(res => {
                if(res.data.success){
                    this.setState({ data: [] })
                    this.setState({ data: this.state.data.concat(res.data.data) })
                }
            })
        })
    }

    render(){
        return(
            <ScrollView contentContainerStyle={{ flex: 1, flexDirection: 'column', backgroundColor: 'white' }}>
                <StatusBar backgroundColor='white' barStyle='dark-content' />

                <SwipeUpDownModal 
                    modalVisible={this.state.filter}
                    ContentModal={
                        <View style={{ flex: 1, flexDirection: 'column', backgroundColor: 'white', marginTop: 70, borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
                            <View style={{ backgroundColor: 'white', elevation: 15, alignItems: 'center', borderTopLeftRadius: 15, borderTopRightRadius: 15 }}>
                                <Icons name='remove-outline' size={40} color="black" />
                                <Text style={{ fontWeight: 'bold', fontSize: 17, marginTop: -8, paddingBottom: 15 }}>Filters Users</Text>
                            </View>

                            <ScrollView contentContainerStyle={{ flexGrow: 1, flexDirection: 'column', marginTop: 20, alignItems: 'center' }}>

                                <Text style={{ fontSize: 15, marginLeft: 45, marginBottom: 10, alignSelf: 'flex-start', marginTop: 20 }}>Filter Class</Text>
                                <View style={{ padding: 5, elevation: 10, borderRadius: 10, width: 280, backgroundColor: 'white' }}>
                                    <Picker selectedItem={this.state.filter_class} onValueChange={(val) => this.setState({ filter_class: val })}>
                                        {this.state.choose_class.map((x,y) => {
                                            return <Picker.Item label={"Class - " + x.class} value={x.class} />
                                        })}
                                    </Picker>
                                </View>

                                <Text style={{ fontSize: 15, marginLeft: 45, marginBottom: 10, alignSelf: 'flex-start', marginTop: 20 }}>Filter Majors</Text>
                                <View style={{ padding: 5, elevation: 10, borderRadius: 10, width: 280, backgroundColor: 'white' }}>
                                    <Picker selectedItem={this.state.filter_major} onValueChange={(val) => this.setState({ filter_major: val })}>
                                        {this.state.choose_major.map((x,y) => {
                                            return <Picker.Item label={x.major} value={x.major} />
                                        })}
                                    </Picker>
                                </View>

                                <TouchableOpacity style={{ marginTop: 25, elevation: 10, borderRadius: 10, width: 280, padding: 10, backgroundColor: '#4E9F3D', alignItems: 'center', justifyContent: 'center' }} onPress={() => alert('Filters Apply')}>
                                    <Text style={{ color: 'white', fontWeight: 'bold' }}>Apply Filters</Text>
                                </TouchableOpacity>

                                <View style={{ padding: 10, paddingBottom: 50 }}>
                                </View>

                            </ScrollView>

                        </View>
                    }

                    onClose={() => this.setState({ filter: false })}
                />

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
                    <TouchableOpacity onPress={() => this.setState({ filter: true })}>
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
                                <Text style={{ color: 'grey' }}>Grade {x.class}</Text>
                            </View>
                        </View>

                        <View style={{ flexDirection: 'column', marginRight: 10, alignItems: 'center', marginTop: 10 }}>
                            <Text style={{ color: 'grey' }}>{x.time}</Text>
                            <Text style={{ color: 'grey' }}>{x.major.length > 5 ? x.major.slice(0, 5)+'...' : x.major}</Text>
                        </View>
                    </View>

                    })}
                </View>
            </ScrollView>
        )
    }
}
