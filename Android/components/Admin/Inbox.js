import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Picker, Image, AsyncStorage, StatusBar } from 'react-native'
import axios from 'axios'
import konfigurasi from '../../config'
import Icons from 'react-native-vector-icons/Ionicons'
import SwipeUpDownModal from 'react-native-swipe-modal-up-down'

export default class InboxAdmin extends Component{
    constructor(props){
        super(props)

        this.state = {
            username: null,
            addInbox: false,
            inbox: [],
            inboxSearch: null,
            classAll: [],
            majorAll: [],
            title: null,
            body: null,
            class: null,
            major: null,
            date: new Date().getDate() + '/' + new Date().getMonth() + '/' + new Date().getFullYear(),
        }
    }

    componentDidMount(){
       AsyncStorage.getItem('token').then(token => {
            axios.post(konfigurasi.server + "auth/profile", {
                token: token,
                secret: konfigurasi.secret
            }).then(res => {
                if(res.status == 200){
                    this.setState({ username: res.data.username })
                }
            })

            axios.post(konfigurasi.server + "inbox/getall", {
                token: token,
                secret: konfigurasi.secret
            }).then(res => {
                if(res.data.inbox){
                    this.setState({
                        inbox: this.state.inbox.concat(res.data.inbox)
                    })
                }
            })

            axios.post(konfigurasi.server + "class/getall", {
                token: token,
                secret: konfigurasi.secret
            }).then(res => {
                if(res.data.class){
                    this.setState({
                        classAll: this.state.classAll.concat(res.data.class)
                    })
                    this.setState({
                        class: this.state.classAll[0].class
                    })
                }
            })

            axios.post(konfigurasi.server + "class/major/getall", {
                token: token,
                secret: konfigurasi.secret
            }).then(res => {
                if(res.data.majors){
                    this.setState({
                        majorAll: this.state.majorAll.concat(res.data.majors)
                    })
                    this.setState({
                        major: res.data.majors[0].major
                    })
                }
            })
        })
    }

    refresh(){
        AsyncStorage.getItem('token').then(token => {
            axios.post(konfigurasi.server + 'inbox/getall', {
                token: token,
                secret: konfigurasi.secret
            }).then(res => {
                this.setState({ inbox: [] })
                this.setState({
                    inbox: this.state.inbox.concat(res.data.inbox)
                })
            })
        })
    }

    addInbox = () => {
        AsyncStorage.getItem('token').then(token => {
            axios.post(konfigurasi.server + "inbox/add", {
                token: token,
                secret: konfigurasi.secret,
                title: this.state.title,
                body: this.state.body,
                class: this.state.class,
                major: this.state.major,
                date: this.state.date,
                time: new Date().getHours() + ':' + new Date().getMinutes()
            }).then(res => {
                if(res.data.success){
                    this.setState({
                        addInbox: false,
                        title: null,
                        desc: null,
                        class: null,
                        major: null,
                    })
                    this.refresh()
                }
            })
        })
    }

    delete(title){
        AsyncStorage.getItem('token').then(token => {
            axios.post(konfigurasi.server + "inbox/delete", {
                token: token,
                secret: konfigurasi.secret,
                title: title
            }).then(res => {
                if(res.data.success){
                    this.refresh()
                }
            })
        })
    }

    search(){
        AsyncStorage.getItem('token').then(token => {
            axios.post(konfigurasi.server + "inbox/search", {
                token: token,
                secret: konfigurasi.secret,
                title: this.state.inboxSearch
            }).then(res => {
                if(res.status == 200){
                    this.setState({ inbox: [] })
                    this.setState({
                        inbox: this.state.inbox.concat(res.data.inbox)
                    })
                }
            })
        })
    }

    render(){
        return(
            <ScrollView contentContainerStyle={{ flexGrow: 1, flexDirection: 'column', backgroundColor: 'white' }}>
                <StatusBar barStyle={"dark-content"} backgroundColor="white" />

                <SwipeUpDownModal
                    modalVisible={this.state.addInbox}
                    ContentModal={
                        <View style={{ flex: 1, flexDirection: 'column', backgroundColor: 'white', marginTop: 70, borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
                            <View style={{ backgroundColor: 'white', elevation: 15, alignItems: 'center', borderTopLeftRadius: 15, borderTopRightRadius: 15 }}>
                                <Icons name='remove-outline' size={40} color="black" />
                                <Text style={{ fontWeight: 'bold', fontSize: 17, marginTop: -8, paddingBottom: 15 }}>Send Message</Text>
                            </View>

                            <ScrollView contentContainerStyle={{ flexGrow: 1, flexDirection: 'column', marginTop: 20, alignItems: 'center' }}>
                                <Text style={{ fontSize: 15, marginLeft: 45, marginBottom: 10, alignSelf: 'flex-start' }}>Title Message</Text>
                                <TextInput style={{ padding: 10, elevation: 10, borderRadius: 10, width: 280, backgroundColor: 'white' }} placeholder="Title ?" onChangeText={(val) => this.setState({ title: val })} />

                                <Text style={{ fontSize: 15, marginLeft: 45, marginBottom: 10, alignSelf: 'flex-start', marginTop: 25 }}>Body Message</Text>
                                <TextInput style={{ padding: 10, elevation: 10, borderRadius: 10, width: 280, backgroundColor: 'white' }} placeholder="Body Message ?" onChangeText={(val) => this.setState({ body: val })} multiline={true} />

                                <Text style={{ fontSize: 15, marginLeft: 45, marginBottom: 10, alignSelf: 'flex-start', marginTop: 20 }}>Class ?</Text>
                                <View style={{  elevation: 10, borderRadius: 10, width: 280, backgroundColor: 'white'}}>
                                    <Picker selectedValue={this.state.class} onValueChange={(val) => this.setState({ class: val })}>
                                        {this.state.classAll.map((val, index) => {
                                            return(
                                                <Picker.Item label={'Class - ' + val.class} value={val.class} />
                                            )
                                        })}
                                    </Picker>
                                </View>

                                <Text style={{ fontSize: 15, marginLeft: 45, marginBottom: 10, alignSelf: 'flex-start', marginTop: 20 }}>Major ?</Text>
                                <View style={{  elevation: 10, borderRadius: 10, width: 280, backgroundColor: 'white'}}>
                                    <Picker selectedValue={this.state.major} onValueChange={(val) => this.setState({ major: val })}>
                                        {this.state.majorAll.map((val, index) => {
                                            return(
                                                <Picker.Item label={'Major - ' + val.major} value={val.major} />
                                            )
                                        })}
                                    </Picker>
                                </View>

                                <TouchableOpacity style={{ marginTop: 25, elevation: 10, borderRadius: 10, width: 280, padding: 10, backgroundColor: '#4E9F3D', alignItems: 'center', justifyContent: 'center' }} onPress={() => this.addInbox()}>
                                    <Text style={{ color: 'white', fontWeight: 'bold' }}>Send Inbox</Text>
                                </TouchableOpacity>

                                <View style={{ padding: 10, paddingBottom: 50 }}>
                                </View>

                            </ScrollView>

                        </View>
                    }

                    onClose={() => {
                        this.setState({
                            addInbox: false
                        });
                    }}
                />


                <View style={{ marginTop: 25 }}>
                    <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                        <View style={{ flexDirection: 'row', backgroundColor: '#ededed', width: 270, padding: 10, borderRadius: 10, alignItems: 'center' }}>
                            <Icons name="search-outline" size={20} color="black" />
                            <TextInput placeholder="Search Inbox" style={{ width: 200, marginLeft: 10 }} onChangeText={(val) => this.setState({ inboxSearch: val })} />
                        </View>
                        <TouchableOpacity style={{ backgroundColor: "#4E9F3D", padding: 10, borderRadius: 10, marginLeft: 8 }} onPress={() => this.search()}>
                            <Icons name="search-outline" size={25} color="black" />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={{ flexDirection: 'row', alignSelf: 'flex-start', marginLeft: 20, marginTop: 10 }}>
                    <TouchableOpacity onPress={() => this.setState({ addInbox: true })}>
                        <Text style={{ color: '#4E9F3D' }}>Send Inbox</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ marginTop: 20 }}>
                    {this.state.inbox.map((x,y) => {
                        return <TouchableOpacity style={{ padding: 15, borderRadius: 10, flexDirection: 'row', justifyContent: 'space-between', marginRight: 10, marginLeft: 10, alignItems: 'center', marginTop: 20 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Image source={{ uri: 'https://66.media.tumblr.com/1911d9a6e744365fe7a92ba72a7734b8/tumblr_mfswmevqB41rvyr2no1_1280.jpg' }} style={{ width: 50, height: 50, borderRadius: 100 }} />
                            <View style={{ marginLeft: 10, flexDirection: 'column' }}>
                                <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{x.title}</Text>
                                <Text style={{ fontSize: 15 }}>From {x.from}</Text>
                                <Text style={{ color: 'grey' }}>{x.body}</Text>
                            </View>
                        </View>

                        <View style={{ marginRight: 10, flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between' }}>
                            <View>
                                <Text style={{ color: 'grey' }}>{x.time}</Text>
                            </View>

                            <View style={{ marginTop: 15 }}>
                                <TouchableOpacity onPress={() => this.delete(x.title)}>
                                    <Icons name="trash-outline" size={25} color="red" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableOpacity>
                    })}
                </View>
            </ScrollView>
        )
    }
}
