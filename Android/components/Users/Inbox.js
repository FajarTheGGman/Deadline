import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, AsyncStorage, StatusBar } from 'react-native'
import axios from 'axios'
import konfigurasi from '../../config'
import Icons from 'react-native-vector-icons/Ionicons'
import SwipeUpDownModal from 'react-native-swipe-modal-up-down'

export default class Inbox extends Component{
    constructor(props){
        super(props)
        this.state = {
            inbox: [],
            overview: false,
            sender_title: '',
            sender_from: '',
            sender_class: '',
            sender_body: '',
            sender_time: '',
            sender_date: '',
            sender_picture: '',
            sender_gender: ''
        }
    }

    componentDidMount(){
       AsyncStorage.getItem('token').then(token => {
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
            sender_gender: this.state.inbox[index].gender,
            sender_picture: this.state.inbox[index].picture
        })
    }

    profile(){
        this.setState({ overview: false })
        this.props.navigation.navigate('Profile', { users: this.state.sender_from })
    }

    render(){
        return(
            <ScrollView style={{ flexGrow: 1, flexDirection: 'column', backgroundColor: 'white' }}>
                <StatusBar barStyle={"dark-content"} backgroundColor={"#4E9F3D"} />

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
                                                <Text style={{ fontWeight: 'bold', fontSize: 17 }}>{this.state.sender_from}</Text>
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

                <View style={{ alignItems: 'center', marginTop: 20 }}>
                    <Image source={require('../../assets/illustrations/inbox/banner.png')} style={{ width: 150, height: 130 }} />
                    <Text style={{ fontSize: 20, fontWeight: 'bold', marginTop: 10 }}>Your Inbox</Text>
                </View>

                <View style={{ marginTop: 20 }}>
                    {this.state.inbox.length == 0 ? <View style={{ alignItems: 'center' }}>
                        <View style={{ marginTop: 80, alignItems: 'center' }}>
                            <Icons name='logo-dropbox' color='grey' size={60} />
                            <Text style={{ color: 'grey' }}>It's Looks like you have no inbox today</Text>
                        </View>
                    </View> : this.state.inbox.map((x,y) => {
                        return <TouchableOpacity style={{ padding: 15, borderRadius: 10, flexDirection: 'row', justifyContent: 'space-between', marginRight: 10, marginLeft: 10, alignItems: 'center', marginTop: 20 }} onPress={() => this.overview(y)}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            {x.gender == 'male' ? <Image source={require('../../assets/illustrations/male.png')} style={{ width: 50, height: 50, borderRadius: 100 }} /> : <Image source={require('../../assets/illustrations/female.png')} style={{ width: 50, height: 50, borderRadius: 100 }} /> }
                            <View style={{ marginLeft: 10, flexDirection: 'column' }}>
                                <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{x.title.length > 20 ? x.title.slice(0,20)+'...' : x.title}</Text>
                                <Text style={{ fontSize: 15 }}>From {x.from}</Text>
                                <Text style={{ color: 'grey' }}>{x.body.length > 25 ? x.body.slice(0,25)+'....' : x.body}</Text>
                            </View>
                        </View>

                        <View style={{ marginRight: 10, flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between' }}>
                            <View>
                                <Text style={{ color: 'grey' }}>{x.time}</Text>
                            </View>

                            <View style={{ marginTop: 15 }}>
                                <Icons name="chevron-forward-outline" size={20} color="grey" />
                            </View>
                        </View>
                    </TouchableOpacity>
                    })}
                </View>

            </ScrollView>
        )
    }
}
