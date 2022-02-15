import React, { Component } from 'react';
import { View, Text, TextInput, AsyncStorage, Image, TouchableOpacity, ScrollView, StatusBar, Picker } from 'react-native'
import Icons from 'react-native-vector-icons/Ionicons'
import axios from 'axios'
import SwipeUpDownModal from 'react-native-swipe-modal-up-down'
import konfigurasi from '../../config'

export default class Role extends Component{
    constructor(props){
        super(props)

        this.state = {
            dataRoles: [],
            addRoles: false,
            nameRoles: null,
            levelRoles: 'admin',
            role_search: null
        }
    }

    componentDidMount(){
        AsyncStorage.getItem('token').then((token) => {
            axios.post(konfigurasi.server + 'role/getall', {
                token: token,
                secret: konfigurasi.secret
            }).then(res => {
                if(res.data.roles){
                    this.setState({
                        dataRoles: this.state.dataRoles.concat(res.data.roles)
                    })
                }
            })
        })
    }

    search(){
         AsyncStorage.getItem('token').then((token) => {
            axios.post(konfigurasi.server + 'role/search', {
                token: token,
                secret: konfigurasi.secret,
                name: this.state.role_search
            }).then(res => {
                if(res.data.roles){
                    this.setState({ dataRoles: [] })
                    this.setState({
                        dataRoles: this.state.dataRoles.concat(res.data.roles)
                    })
                }
            })
        })
    }

    refresh(){
        AsyncStorage.getItem('token').then((token) => {
            axios.post(konfigurasi.server + 'role/getall', {
                token: token,
                secret: konfigurasi.secret
            }).then(res => {
                if(res.data.roles){
                    this.setState({ dataRoles: [] })
                    this.setState({
                        dataRoles: this.state.dataRoles.concat(res.data.roles)
                    })
                }
            })
        })
    }

    delete(name){
        AsyncStorage.getItem('token').then(token => {
            axios.post(konfigurasi.server + 'role/delete', {
                token: token,
                secret: konfigurasi.secret,
                name: name
            }).then(res => {
                if(res.data.success){
                    this.refresh()
                }
            })
        })
    }

    addRoles(){
        AsyncStorage.getItem('token').then((token) => {
            axios.post(konfigurasi.server + 'role/add', {
                token: token,
                secret: konfigurasi.secret,
                name: this.state.nameRoles,
                level: this.state.levelRoles
            }).then(res => {
                if(res.data.success){
                    this.refresh()
                    alert('Success Add Roles')
                }
            })
        })
    }
    render(){
        return(
            <ScrollView contentContainerStyle={{ flexGrow: 1, flexDirection: 'column', backgroundColor: 'white' }}>
                <StatusBar barStyle={"dark-content"} backgroundColor="white" />

                <SwipeUpDownModal
                    modalVisible={this.state.addRoles}
                    ContentModal={
                        <View style={{ flex: 1, flexDirection: 'column', backgroundColor: 'white', marginTop: 70, borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
                            <View style={{ backgroundColor: 'white', elevation: 15, alignItems: 'center', borderTopLeftRadius: 15, borderTopRightRadius: 15 }}>
                                <Icons name='remove-outline' size={40} color="black" />
                                <Text style={{ fontWeight: 'bold', fontSize: 17, marginTop: -8, paddingBottom: 15 }}>Add Some Roles</Text>
                            </View>

                            <ScrollView contentContainerStyle={{ flexGrow: 1, flexDirection: 'column', marginTop: 20, alignItems: 'center' }}>
                                <Text style={{ fontSize: 15, marginLeft: 45, marginBottom: 10, alignSelf: 'flex-start' }}>Roles Title</Text>
                                <TextInput style={{ padding: 10, elevation: 10, borderRadius: 10, width: 280, backgroundColor: 'white' }} placeholder="Title Roles ?" onChangeText={(val) => this.setState({ nameRoles: val })} />

                                <Text style={{ fontSize: 15, marginLeft: 45, marginBottom: 10, alignSelf: 'flex-start', marginTop: 20 }}>Roles Level</Text>
                                <View style={{  elevation: 10, borderRadius: 10, width: 280, backgroundColor: 'white'}} >
                                    <Picker selectedValue={this.state.levelRoles} onValueChange={(val) => this.setState({ levelRoles: val })}>
                                        <Picker.Item label="Level Admin" value="admin" />
                                        <Picker.Item label="Level Developer" value="developer" />
                                        <Picker.Item label="Level Teacher" value="teacher" />
                                        <Picker.Item label="Level Students" value="students" />
                                    </Picker>
                                </View>

                                <TouchableOpacity style={{ marginTop: 25, elevation: 10, borderRadius: 10, width: 280, padding: 10, backgroundColor: '#4E9F3D', alignItems: 'center', justifyContent: 'center' }} onPress={() => this.addRoles()}>
                                    <Text style={{ color: 'white', fontWeight: 'bold' }}>Add Roles</Text>
                                </TouchableOpacity>

                                <View style={{ padding: 10, paddingBottom: 50 }}>
                                </View>

                            </ScrollView>

                        </View>
                    }

                    onClose={() => {
                        this.setState({
                            addRoles: false
                        });
                    }}
                />


                <View style={{ marginTop: 25 }}>
                    <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                        <View style={{ flexDirection: 'row', backgroundColor: '#ededed', width: 270, padding: 10, borderRadius: 10, alignItems: 'center' }}>
                            <Icons name="search-outline" size={20} color="black" />
                            <TextInput placeholder="Search Roles" style={{ width: 200, marginLeft: 10 }} onChangeText={(val) => this.setState({ role_search: val })} />
                        </View>
                        <TouchableOpacity style={{ backgroundColor: "#4E9F3D", padding: 10, borderRadius: 10, marginLeft: 8 }} onPress={() => this.search()}>
                            <Icons name="search-outline" size={25} color="black" />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={{ flexDirection: 'row', alignSelf: 'flex-start', marginLeft: 20, marginTop: 10 }}>
                    <TouchableOpacity onPress={() => this.setState({ addRoles: true })}>
                        <Text style={{ color: '#4E9F3D' }}>Add Roles</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ marginTop: 30 }}>
                    <Text style={{ marginLeft: 15, fontWeight: 'bold', fontSize: 17 }}>Newest Roles</Text>
                    {this.state.dataRoles.map((x,y) => {
                        return <TouchableOpacity style={{ backgroundColor: "white", padding: 15, borderRadius: 10, flexDirection: 'row', justifyContent: 'space-between', elevation: 10, marginRight: 10, marginLeft: 10, alignItems: 'center', marginTop: 20 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Image source={{ uri: 'https://66.media.tumblr.com/1911d9a6e744365fe7a92ba72a7734b8/tumblr_mfswmevqB41rvyr2no1_1280.jpg' }} style={{ width: 50, height: 50, borderRadius: 100 }} />
                            <View style={{ marginLeft: 10, flexDirection: 'column' }}>
                                <Text style={{ fontWeight: 'bold' }}>{x.name}</Text>
                                <Text style={{ fontSize: 12 }}>{x.level}</Text>
                            </View>
                        </View>

                        <View style={{ marginRight: 10 }}>
                            <TouchableOpacity onPress={() => this.delete(x.name)}>
                                <Icons name="trash-outline" size={25} color="red" />
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                    })}
                </View>
            </ScrollView>
        )
    }
}
