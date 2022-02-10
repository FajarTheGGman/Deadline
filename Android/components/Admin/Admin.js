import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, Picker, AsyncStorage, StatusBar } from 'react-native'
import Icons from 'react-native-vector-icons/Ionicons'
import axios from 'axios'
import konfigurasi from '../../config'
import SwipeUpDownModal from 'react-native-swipe-modal-up-down'

export default class AdminNew extends Component{
    constructor(props){
        super(props)

        this.state = {
            adminList: [],
            adminSearch: '',
            addAdmin: false,
            fullname: null,
            username: null,
            password: null,
            gender: 'male'
        }
    }

    componentDidMount(){
        AsyncStorage.getItem('token').then(token => {
            axios.post(konfigurasi.server + 'auth/getall/admin', {
                token: token,
                secret: konfigurasi.secret
            }).then(res => {
                if(res.data.users){
                    this.setState({
                        adminList: this.state.adminList.concat(res.data.users)
                    })
                }
            })
        })
    }

    refresh(){
        AsyncStorage.getItem('token').then(token => {
            axios.post(konfigurasi.server + 'auth/getall/admin', {
                token: token,
                secret: konfigurasi.secret
            }).then(res => {
                if(res.data.users){
                    this.setState({ adminList: [] })
                    this.setState({
                        adminList: this.state.adminList.concat(res.data.users)
                    })
                }
            })
        })
    }

    addAdmin(){
        axios.post(konfigurasi.server + 'auth/register', {
            name: this.state.fullname,
            username: this.state.username,
            password: this.state.password,
            gender: this.state.gender,
            level: 'admin'
        }).then(res => {
            if(res.data.success){
                alert('Successfully creating admin')
                this.refresh()
            }
        })
    }

    delete(username){
        AsyncStorage.getItem('token').then(token => {
            axios.post(konfigurasi.server + 'auth/delete', {
                token: token,
                secret: konfigurasi.secret,
                username: username
            }).then(res => {
                if(res.data.success){
                    alert('Successfully deleting admin')
                    this.refresh()
                }
            })
        })
    }

    search(){
        AsyncStorage.getItem('token').then(token => {
            axios.post(konfigurasi.server + 'auth/search/admin', {
                token: token,
                secret: konfigurasi.secret,
                name: this.state.adminSearch
            }).then(res => {
                if(res.data.users){
                    this.setState({ adminList: [] })
                    this.setState({
                        adminList: this.state.adminList.concat(res.data.users)
                    })
                }
            })
        })
    }

    render(){
        return(
            <View style={{ flex: 1, flexDirection: 'column', backgroundColor: 'white', }}>
                <StatusBar backgroundColor="white" barStyle="dark-content" />

                <SwipeUpDownModal
                    modalVisible={this.state.addAdmin}
                    ContentModal={
                        <View style={{ flex: 1, flexDirection: 'column', backgroundColor: 'white', marginTop: 70, borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
                            <View style={{ backgroundColor: 'white', elevation: 15, alignItems: 'center', borderTopLeftRadius: 15, borderTopRightRadius: 15 }}>
                                <Icons name='remove-outline' size={40} color="black" />
                                <Text style={{ fontWeight: 'bold', fontSize: 17, marginTop: -8, paddingBottom: 15 }}>Add Some Admin</Text>
                            </View>

                            <ScrollView contentContainerStyle={{ flexGrow: 1, flexDirection: 'column', marginTop: 20, alignItems: 'center' }}>
                                <Text style={{ fontSize: 15, marginLeft: 45, marginBottom: 10, alignSelf: 'flex-start' }}>Full Name</Text>
                                <TextInput style={{ padding: 10, elevation: 10, borderRadius: 10, width: 280, backgroundColor: 'white' }} placeholder="Your Full Name ?" onChangeText={(val) => this.setState({ fullname: val })} />

                                <Text style={{ fontSize: 15, marginLeft: 45, marginBottom: 10, alignSelf: 'flex-start', marginTop: 25 }}>Username</Text>
                                <TextInput style={{ padding: 10, elevation: 10, borderRadius: 10, width: 280, backgroundColor: 'white' }} placeholder="Your Username ?" onChangeText={(val) => this.setState({ username: val })} />

                                <Text style={{ fontSize: 15, marginLeft: 45, marginBottom: 10, alignSelf: 'flex-start', marginTop: 25 }}>Password</Text>
                                <TextInput style={{ padding: 10, elevation: 10, borderRadius: 10, width: 280, backgroundColor: 'white' }} placeholder="Your Password ?" onChangeText={(val) => this.setState({ password: val })} secureTextEntry={true} />

                                <Text style={{ fontSize: 15, marginLeft: 45, marginBottom: 10, alignSelf: 'flex-start', marginTop: 20 }}>Your Gender</Text>
                                <View style={{  elevation: 10, borderRadius: 10, width: 280, backgroundColor: 'white'}} >
                                    <Picker selectedValue={this.state.gender} onValueChange={(val) => this.setState({ gender: val })}>
                                        <Picker.Item label="I'm a male" value="male" />
                                        <Picker.Item label="I'm a female" value="female" />
                                    </Picker>
                                </View>

                                <TouchableOpacity style={{ marginTop: 25, elevation: 10, borderRadius: 10, width: 280, padding: 10, backgroundColor: '#4E9F3D', alignItems: 'center', justifyContent: 'center' }} onPress={() => this.addAdmin()}>
                                    <Text style={{ color: 'white', fontWeight: 'bold' }}>Add Admin</Text>
                                </TouchableOpacity>

                                <View style={{ padding: 10, paddingBottom: 50 }}>
                                </View>

                            </ScrollView>

                        </View>
                    }

                    onClose={() => {
                        this.setState({
                            addAdmin: false
                        });
                    }}
                />


                <View style={{ marginTop: 25 }}>
                    <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                        <View style={{ flexDirection: 'row', backgroundColor: '#ededed', width: 270, padding: 10, borderRadius: 10, alignItems: 'center' }}>
                            <Icons name="search-outline" size={20} color="black" />
                            <TextInput placeholder="Search Admin Users" style={{ width: 200, marginLeft: 10 }} onChangeText={(val) => this.setState({ adminSearch: val })} />
                        </View>
                        <TouchableOpacity style={{ backgroundColor: "#4E9F3D", padding: 10, borderRadius: 10, marginLeft: 8 }} onPress={() => this.search()}>
                            <Icons name="search-outline" size={25} color="black" />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={{ flexDirection: 'row', alignSelf: 'flex-start', marginLeft: 20, marginTop: 10 }}>
                    <TouchableOpacity onPress={() => this.setState({ addAdmin: true })}>
                        <Text style={{ color: '#4E9F3D' }}>Add Admin</Text>
                    </TouchableOpacity>
                </View>

                <Text style={{ fontWeight: 'bold', marginTop: 25, fontSize: 18, marginLeft: 15 }}>Newest Admin</Text>
                {this.state.adminList.map((x,y) => {
                    return <View style={{ backgroundColor: 'white', marginTop: 15, elevation: 15, borderRadius: 15, marginLeft: 10, marginRight: 10, flexDirection: 'row', padding: 15, justifyContent: 'space-between', alignItems: 'center' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Image source={require('../../assets/icons/admin.png')} style={{ width: 50, height: 50, borderRadius: 100 }} />
                            <View style={{ flexDirection: 'column' }}>
                                <Text style={{ fontWeight: 'bold', marginLeft: 10 }}>{x.name}</Text>
                                <Text style={{ fontSize: 12, marginLeft: 10 }}>@{x.username}</Text>
                            </View>
                        </View>

                        <View style={{ marginRight: 10 }}>
                            <TouchableOpacity onPress={() => this.delete(x.username)}>
                                <Icons name="trash-outline" size={25} color="red" />
                            </TouchableOpacity>
                        </View>
                    </View>

                })}
            </View>
        )
    }
}
