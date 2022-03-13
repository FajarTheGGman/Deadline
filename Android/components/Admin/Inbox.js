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
            picture: '',
            gender: '',
            title: null,
            body: null,
            class: null,
            major: null,
            sender_title: null,
            sender_from: null,
            sender_class: null,
            sender_body: null,
            sender_time: null,
            sender_date: null,
            sender_picture: '',
            sender_gender: '',
            sender_verified: false,
            verified: false,
            overview: false,
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
                    if(res.data.level == 'developer'){
                        this.setState({ verified: true })
                    }else if(res.data.level == 'admin'){
                        this.setState({ verified: true })
                    }

                    this.setState({ 
                        username: res.data.username,
                        picture: res.data.picture,
                        gender: res.data.gender
                    })
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
                picture: this.state.picture,
                gender: this.state.gender,
                verified: this.state.verified,
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

    overview(index){
        this.setState({ overview: true })
        this.setState({
            sender_title: this.state.inbox[index].title,
            sender_from: this.state.inbox[index].from,
            sender_class: this.state.inbox[index].class,
            sender_body: this.state.inbox[index].body,
            sender_time: this.state.inbox[index].time,
            sender_date: this.state.inbox[index].date,
            sender_verified: this.state.inbox[index].verified,
            sender_picture: this.state.inbox[index].picture,
            sender_gender: this.state.inbox[index].gender == 'female' ? 'female' : 'male'
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

    profile(){
        this.setState({ overview: false })
        this.props.navigation.navigate('Profile', { users: this.state.sender_from })
    }

    render(){
        return(
            <ScrollView contentContainerStyle={{ flexGrow: 1, flexDirection: 'column', backgroundColor: 'white' }}>
                <StatusBar barStyle={"dark-content"} backgroundColor="white" />

                <SwipeUpDownModal
                    modalVisible={this.state.overview}
                    ContentModal={
                        <View style={{ flex: 1, flexDirection: 'column', backgroundColor: 'white', marginTop: 70, borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
                            <View style={{ backgroundColor: 'white', elevation: 15, alignItems: 'center', borderTopLeftRadius: 15, borderTopRightRadius: 15 }}>
                                <Icons name='remove-outline' size={40} color="black" />
                                <Text style={{ fontWeight: 'bold', fontSize: 17, marginTop: -8, paddingBottom: 15 }}>Message</Text>
                            </View>

                            <ScrollView contentContainerStyle={{ flexGrow: 1, flexDirection: 'column', marginTop: 20 }}>
                                <Text style={{ fontWeight: 'bold', fontSize: 18, marginLeft: 10 }}>{this.state.sender_title}</Text>

                                <View style={{ marginLeft: 10, marginTop: 20 }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <View style={{ flexDirection: 'row' }}>
                                            <TouchableOpacity onPress={() => this.profile()}>
                                                {this.state.sender_picture.length == 0 ? this.state.sender_gender == 'male' ? <Image source={require('../../assets/illustrations/male.png')} style={{ width: 50, height: 50, borderRadius: 100 }} /> : <Image source={require('../../assets/illustrations/female.png')} style={{ width: 50, height: 50, borderRadius: 100 }} /> : <Image source={{ uri: this.state.picture }} style={{ width: 50, height: 50, borderRadius: 100 }} />}
                                            </TouchableOpacity>
                                            <View style={{ flexDirection: 'column', marginLeft: 10 }}>
                                                <Text style={{ fontWeight: 'bold', fontSize: 17 }}>{this.state.sender_from} {this.state.sender_verified ? <Icons name="checkmark-circle" size={20} color="#4E9F3D" /> : <Text></Text>}</Text>
                                                <Text style={{ color: 'grey' }}>To: class - {this.state.sender_class}</Text>
                                            </View>
                                        </View>

                                        <View style={{ marginRight: 10 }}>
                                            <Text style={{ color: 'grey' }}>{this.state.sender_date}</Text>
                                            <Text style={{ color: 'grey' }}>{this.state.sender_time} PM</Text>
                                        </View>
                                    </View>
                                </View>

                                <View style={{ marginTop: 20, marginLeft: 10 }}>
                                    <Text>{this.state.sender_body}</Text>
                                </View>
                            </ScrollView>
                        </View>
                    }
                    onClose={() => this.setState({ overview: false })}
                />

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
                        return <TouchableOpacity style={{ padding: 15, borderRadius: 10, flexDirection: 'row', justifyContent: 'space-between', marginRight: 10, marginLeft: 10, alignItems: 'center', marginTop: 20 }} onPress={() => this.overview(y)}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            {x.gender == 'male' ? <Image source={require('../../assets/illustrations/male.png')} style={{ width: 50, height: 50, borderRadius: 100 }} /> : <Image source={require('../../assets/illustrations/female.png')} style={{ width: 50, height: 50, borderRadius: 100 }} /> }
                            <View style={{ marginLeft: 10, flexDirection: 'column' }}>
                                <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{x.title.length > 20 ? x.title.slice(0,20)+"..." : x.title}</Text>
                                <Text style={{ fontSize: 15 }}>From {x.from}</Text>
                                <Text style={{ color: 'grey' }}>{x.body.length > 25 ? x.body.slice(0, 25)+'....' : x.body}</Text>
                                
                            </View>
                        </View>

                        <View style={{ marginRight: 10, flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between' }}>
                            <View>
                                <Text style={{ color: 'grey' }}>{x.time}</Text>
                            </View>

                            {x.from == this.state.username ? <View style={{ marginTop: 15 }}>
                                <TouchableOpacity onPress={() => this.delete(x.title)}>
                                    <Icons name="trash-outline" size={25} color="red" />
                                </TouchableOpacity>
                            </View> : <View></View>}
                        </View>
                    </TouchableOpacity>
                    })}
                </View>
            </ScrollView>
        )
    }
}
