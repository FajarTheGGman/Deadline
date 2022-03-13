import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, StatusBar, AsyncStorage } from 'react-native';
import axios from 'axios';
import Icons from 'react-native-vector-icons/Ionicons';
import konfigurasi from '../../config';
import SwipeUpDownModal from 'react-native-swipe-modal-up-down';

export default class ClassAdmin extends Component{
    constructor(props){
        super(props);

        this.state = {
            classList: [],
            majorList: [],
            addClass: false,
            addMajor: false,
            classTitle: '',
            classDesc: '',
            majorTitle: '',
            majorDesc: '',
            search: null
        }
    }

    componentDidMount(){
        AsyncStorage.getItem('token').then(token => {
            axios.post(konfigurasi.server + 'class/getall', {
                token: token,
                secret: konfigurasi.secret
            }).then(res => {
                if(res.data.class){
                    this.setState({
                        classList: this.state.classList.concat(res.data.class)
                    })
                }
            })

            axios.post(konfigurasi.server + 'class/major/getall', {
                token: token,
                secret: konfigurasi.secret
            }).then(res => {
                if(res.data.majors){
                    this.setState({
                        majorList: this.state.majorList.concat(res.data.majors)
                    })
                }
            })
        })
    }

    refresh(){
        AsyncStorage.getItem('token').then(token => {
            axios.post(konfigurasi.server + 'class/getall', {
                token: token,
                secret: konfigurasi.secret
            }).then(res => {
                if(res.data.class){
                    this.setState({ classList: [] })
                    this.setState({
                        classList: this.state.classList.concat(res.data.class)
                    })
                }
            })

            axios.post(konfigurasi.server + 'class/major/getall', {
                token: token,
                secret: konfigurasi.secret
            }).then(res => {
                if(res.data.majors){
                    this.setState({
                        majorList: this.state.majorList.concat(res.data.majors)
                    })
                }
            })
        })
    }

    searchMajor(){
        AsyncStorage.getItem('token').then(token => {
            axios.post(konfigurasi.server + 'class/major/search', {
                token: token,
                secret: konfigurasi.secret,
                major: this.state.search
            }).then(res => {
                if(res.data.majors){
                    this.setState({ majorList: [] })
                    this.setState({
                        majorList: this.state.majorList.concat(res.data.majors)
                    })
                }
            })
        })
    }

    addClass(){
        AsyncStorage.getItem('token').then(token => {
            axios.post(konfigurasi.server + 'class/add', { 
                token: token,
                secret: konfigurasi.secret,
                class: this.state.classTitle,
                desc: this.state.classDesc
            }).then(res => {
                if(res.data.success){
                    this.refresh();
                    alert('Class Added');
                }
            })
        })
    }

    addMajor(){
        AsyncStorage.getItem('token').then(token => {
            axios.post(konfigurasi.server + 'class/major/add', { 
                token: token,
                secret: konfigurasi.secret,
                major: this.state.majorTitle,
                desc: this.state.majorDesc
            }).then(res => {
                if(res.data.success){
                    this.refresh();
                    alert('Major Added');
                }
            })
        })
    }

    delete(name){
        AsyncStorage.getItem('token').then(token => {
            axios.post(konfigurasi.server + 'class/delete', {
                token: token,
                secret: konfigurasi.secret,
                class: name
            }).then(res => {
                if(res.data.success){
                    this.refresh();
                    alert('Class Deleted');
                }
            })
        })
    }

    deleteMajor(name){
        AsyncStorage.getItem('token').then(token => {
            axios.post(konfigurasi.server + 'class/major/delete', {
                token: token,
                secret: konfigurasi.secret,
                major: name
            }).then(res => {
                if(res.data.success){
                    this.refresh();
                    alert('Major Deleted');
                }
            })
        })
    }

    render(){
        return(
            <View style={{ flex: 1, flexDirection: 'column', backgroundColor: 'white' }}>
                <StatusBar backgroundColor="white" barStyle="dark-content" />
                <SwipeUpDownModal
                    modalVisible={this.state.addClass}
                    ContentModal={
                        <View style={{ flex: 1, flexDirection: 'column', backgroundColor: 'white', marginTop: 70, borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
                            <View style={{ backgroundColor: 'white', elevation: 15, alignItems: 'center', borderTopLeftRadius: 15, borderTopRightRadius: 15 }}>
                                <Icons name='remove-outline' size={40} color="black" />
                                <Text style={{ fontWeight: 'bold', fontSize: 17, marginTop: -8, paddingBottom: 15 }}>Add Some Class</Text>
                            </View>

                            <ScrollView contentContainerStyle={{ flexGrow: 1, flexDirection: 'column', marginTop: 20, alignItems: 'center' }}>
                                <Text style={{ fontSize: 15, marginLeft: 45, marginBottom: 10, alignSelf: 'flex-start' }}>Class Title</Text>
                                <TextInput style={{ padding: 10, elevation: 10, borderRadius: 10, width: 280, backgroundColor: 'white' }} placeholder="Title Class ?" onChangeText={(val) => this.setState({ classTitle: val })} />

                                <Text style={{ fontSize: 15, marginLeft: 45, marginBottom: 10, alignSelf: 'flex-start', marginTop: 20 }}>Class Description</Text>
                                <TextInput style={{ padding: 10, elevation: 10, borderRadius: 10, width: 280, backgroundColor: 'white' }} placeholder="Description ?" onChangeText={(val) => this.setState({ classDesc: val })} multiline={true} />

                                <TouchableOpacity style={{ marginTop: 25, elevation: 10, borderRadius: 10, width: 280, padding: 10, backgroundColor: '#4E9F3D', alignItems: 'center', justifyContent: 'center' }} onPress={() => this.addClass()}>
                                    <Text style={{ color: 'white', fontWeight: 'bold' }}>Add Class</Text>
                                </TouchableOpacity>

                                <View style={{ padding: 10, paddingBottom: 50 }}>
                                </View>

                            </ScrollView>

                        </View>
                    }

                    onClose={() => {
                        this.setState({
                            addClass: false
                        });
                    }}
                />

                <SwipeUpDownModal
                    modalVisible={this.state.addMajor}
                    ContentModal={
                        <View style={{ flex: 1, flexDirection: 'column', backgroundColor: 'white', marginTop: 70, borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
                            <View style={{ backgroundColor: 'white', elevation: 15, alignItems: 'center', borderTopLeftRadius: 15, borderTopRightRadius: 15 }}>
                                <Icons name='remove-outline' size={40} color="black" />
                                <Text style={{ fontWeight: 'bold', fontSize: 17, marginTop: -8, paddingBottom: 15 }}>Add Some Major</Text>
                            </View>

                            <ScrollView contentContainerStyle={{ flexGrow: 1, flexDirection: 'column', marginTop: 20, alignItems: 'center' }}>
                                <Text style={{ fontSize: 15, marginLeft: 45, marginBottom: 10, alignSelf: 'flex-start' }}>Major Title</Text>
                                <TextInput style={{ padding: 10, elevation: 10, borderRadius: 10, width: 280, backgroundColor: 'white' }} placeholder="Title Major ?" onChangeText={(val) => this.setState({ majorTitle: val })} />

                                <Text style={{ fontSize: 15, marginLeft: 45, marginBottom: 10, alignSelf: 'flex-start', marginTop: 20 }}>Class Description</Text>
                                <TextInput style={{ padding: 10, elevation: 10, borderRadius: 10, width: 280, backgroundColor: 'white' }} placeholder="Description ?" onChangeText={(val) => this.setState({ majorDesc: val })} multiline={true} />

                                <TouchableOpacity style={{ marginTop: 25, elevation: 10, borderRadius: 10, width: 280, padding: 10, backgroundColor: '#4E9F3D', alignItems: 'center', justifyContent: 'center' }} onPress={() => this.addMajor()}>
                                    <Text style={{ color: 'white', fontWeight: 'bold' }}>Add Major</Text>
                                </TouchableOpacity>

                                <View style={{ padding: 10, paddingBottom: 50 }}>
                                </View>

                            </ScrollView>

                        </View>
                    }

                    onClose={() => {
                        this.setState({
                            addMajor: false
                        });
                    }}
                />



                <View style={{ marginTop: 25 }}>
                    <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                        <View style={{ flexDirection: 'row', backgroundColor: '#ededed', width: 270, padding: 10, borderRadius: 10, alignItems: 'center' }}>
                            <Icons name="search-outline" size={20} color="black" />
                            <TextInput placeholder="Search Majors" style={{ width: 200, marginLeft: 10 }} onChangeText={(val) => this.setState({ search: val })} />
                        </View>
                        <TouchableOpacity style={{ backgroundColor: "#4E9F3D", padding: 10, borderRadius: 10, marginLeft: 8 }} onPress={() => this.searchMajor()}>
                            <Icons name="search-outline" size={25} color="black" />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                    <TouchableOpacity onPress={() => this.setState({ addClass: true })} style={{  marginLeft: 20, }}>
                        <Text style={{ color: '#4E9F3D' }}>Add Class</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => this.setState({ addMajor: true })} style={{  marginRight: 20, }}>
                        <Text style={{ color: '#4E9F3D' }}>Add Major</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ flexDirection: 'column', marginTop: 25 }}>
                    <Text style={{ marginLeft: 15, fontSize: 16, fontWeight: 'bold' }}>All Class</Text>
                    {this.state.classList.length == 0 ? <View style={{ alignItems: 'center' }}>
                        <Icons name='logo-dropbox' color='grey' size={50} />
                        <Text style={{ color: 'grey', fontWeight: 'bold' }}>Class not added yet!</Text>
                    </View> : this.state.classList.map((x,y) => {
                    return <View style={{ backgroundColor: 'white', marginTop: 15, elevation: 15, borderRadius: 15, marginLeft: 10, marginRight: 10, flexDirection: 'row', padding: 15, justifyContent: 'space-between', alignItems: 'center' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Image source={require('../../assets/icons/class.png')} style={{ width: 50, height: 50, borderRadius: 100 }} />
                            <View style={{ flexDirection: 'column' }}>
                                <Text style={{ fontWeight: 'bold', marginLeft: 10 }}>Class - {x.class}</Text>
                                <Text style={{ fontSize: 12, marginLeft: 10 }}>{x.desc}</Text>
                            </View>
                        </View>

                        <View style={{ marginRight: 10 }}>
                            <TouchableOpacity onPress={() => this.delete(x.class)}>
                                <Icons name="trash-outline" size={25} color="red" />
                            </TouchableOpacity>
                        </View>
                    </View>
                    })}

                    <Text style={{ marginLeft: 15, fontSize: 16, marginTop: 25, fontWeight: 'bold' }}>All Major</Text>
                    {this.state.majorList.length == 0 ? <View style={{ alignItems: 'center' }}>
                        <Icons name='logo-dropbox' color='grey' size={50} />
                        <Text style={{ color: 'grey', fontWeight: 'bold' }}>Class not added yet!</Text>
                    </View> : this.state.majorList.map((x,y) => {
                    return <View style={{ backgroundColor: 'white', marginTop: 15, elevation: 15, borderRadius: 15, marginLeft: 10, marginRight: 10, flexDirection: 'row', padding: 15, justifyContent: 'space-between', alignItems: 'center' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Image source={require('../../assets/icons/class.png')} style={{ width: 50, height: 50, borderRadius: 100 }} />
                            <View style={{ flexDirection: 'column' }}>
                                <Text style={{ fontWeight: 'bold', marginLeft: 10 }}>Major - {x.major}</Text>
                                <Text style={{ fontSize: 12, marginLeft: 10 }}>{x.desc}</Text>
                            </View>
                        </View>

                        <View style={{ marginRight: 10 }}>
                            <TouchableOpacity onPress={() => this.delete(x.class)}>
                                <Icons name="trash-outline" size={25} color="red" />
                            </TouchableOpacity>
                        </View>
                    </View>
                    })}
                </View>
            </View>
        )
    }
}
