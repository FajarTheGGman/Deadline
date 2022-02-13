import React, { Component } from 'react';
import { View, Text, TextInput, AsyncStorage, TouchableOpacity, Image, ScrollView, StatusBar } from 'react-native'
import axios from 'axios'
import Icons from 'react-native-vector-icons/Ionicons'
import SwipeUpDownModal from 'react-native-swipe-modal-up-down'
import konfigurasi from '../../config'
import DateTimePicker from '@react-native-community/datetimepicker';

export default class EventAdmin extends Component{
    constructor(props){
        super(props)

        this.state = {
            events: [],
            addEvents: false,
            eventSearch: null,
            eventTitle: null,
            eventDesc: null,
            eventDate: null,
            date: false
        }
    }

    componentDidMount(){
        AsyncStorage.getItem('token').then((token) => {
            axios.post(konfigurasi.server + "events/getall", {
                token: token,
                secret: konfigurasi.secret
            }).then(res => {
                if(res.data.events){
                    this.setState({ events: this.state.events.concat(res.data.events) })
                }
            })
        })
    }

    refresh(){
        AsyncStorage.getItem('token').then((token) => {
            axios.post(konfigurasi.server + "events/getall", {
                token: token,
                secret: konfigurasi.secret
            }).then(res => {
                if(res.data.events){
                    this.setState({ events: [] })
                    this.setState({ events: this.state.events.concat(res.data.events) })
                }
            })
        })
    }


    insertEvent(){
        AsyncStorage.getItem('token').then((token) => {
            axios.post(konfigurasi.server + "events/add", {
                token: token,
                secret: konfigurasi.secret,
                events: this.state.eventTitle,
                desc: this.state.eventDesc,
                date: this.state.eventDate
            }).then(res => {
                if(res.data.success){
                    alert("Event has been added")
                    this.refresh()
                    this.setState({ eventTitle: null, eventDesc: null, eventDate: null })
                }
            })

            axios.post(konfigurasi.server + 'notification/add', {
                token: token,
                secret: konfigurasi.secret,
                title:  this.state.eventTitle,
                message: this.state.eventDesc,
                type: 'golf-outline',
                class: this.state.class_input,
                from: this.state.teacher_input,
                time: new Date().getHours() + ':' + new Date().getMinutes()
            }).then(res => {
                if(res.data.success){
                    console.log('Notification sucessully added')
                }
            })
        })
    }

    deleteEvent(events){
        AsyncStorage.getItem('token').then((token) => {
            axios.post(konfigurasi.server + "events/delete", {
                token: token,
                secret: konfigurasi.secret,
                events: events
            }).then(res => {
                if(res.data.success){
                    alert("Event has been deleted")
                    this.refresh()
                }
            })
        })
    }

    search(){
        AsyncStorage.getItem('token').then((token) => {
            axios.post(konfigurasi.server + "events/search", {
                token: token,
                secret: konfigurasi.secret,
                events: this.state.eventSearch
            }).then(res => {
                if(res.data.events){
                    this.setState({ events: [] })
                    this.setState({ events: this.state.events.concat(res.data.events) })
                }
            })
        })
    }

    render(){
        return(
            <View style={{ flex: 1, flexDirection: 'column', backgroundColor: 'white' }}>
                <StatusBar barStyle={"dark-content"} backgroundColor="white" />

                <SwipeUpDownModal
                    modalVisible={this.state.addEvents}
                    ContentModal={
                        <View style={{ flex: 1, flexDirection: 'column', backgroundColor: 'white', marginTop: 70, borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
                            <View style={{ backgroundColor: 'white', elevation: 15, alignItems: 'center', borderTopLeftRadius: 15, borderTopRightRadius: 15 }}>
                                <Icons name='remove-outline' size={40} color="black" />
                                <Text style={{ fontWeight: 'bold', fontSize: 17, marginTop: -8, paddingBottom: 15 }}>Add Some Events</Text>
                            </View>

                            <ScrollView contentContainerStyle={{ flexGrow: 1, flexDirection: 'column', marginTop: 20, alignItems: 'center' }}>
                                <Text style={{ fontSize: 15, marginLeft: 45, marginBottom: 10, alignSelf: 'flex-start' }}>Events Title</Text>
                                <TextInput style={{ padding: 10, elevation: 10, borderRadius: 10, width: 280, backgroundColor: 'white' }} placeholder="Title Roles ?" onChangeText={(val) => this.setState({ eventTitle: val })} />

                                <Text style={{ fontSize: 15, marginLeft: 45, marginBottom: 10, alignSelf: 'flex-start', marginTop: 15 }}>Events Description</Text>
                                <TextInput style={{ padding: 10, elevation: 10, borderRadius: 10, width: 280, backgroundColor: 'white' }} placeholder="Events Description ?" onChangeText={(val) => this.setState({ eventDesc: val })} multiline={true} />

                                <Text style={{ fontSize: 15, marginLeft: 45, marginBottom: 10, alignSelf: 'flex-start', marginTop: 20 }}>Events Date ?</Text>
                                <TouchableOpacity style={{ padding: 10, elevation: 10, borderRadius: 10, width: 280, backgroundColor: 'white', alignItems: 'center'}} onPress={() => this.setState({ date: true })}>
                                    {this.state.eventDate == null ? <Text>Click here to set date</Text> : <Text style={{ fontWeight: 'bold' }}>{this.state.eventDate}</Text>}
                                </TouchableOpacity>

                                {this.state.date && (
                                <DateTimePicker
                                    value={new Date()}
                                    mode={'date'}
                                    is24Hour={true}
                                    display="default"
                                    onChange={(event, selectedDate) => {
                                        this.setState({ eventDate: selectedDate.getFullYear() + '-' + (selectedDate.getMonth() + 1) + '-' + selectedDate.getDate() })
                                        this.setState({ date: false })
                                    }}/>
                                )}

                                <TouchableOpacity style={{ marginTop: 25, elevation: 10, borderRadius: 10, width: 280, padding: 10, backgroundColor: '#4E9F3D', alignItems: 'center', justifyContent: 'center' }} onPress={() => this.insertEvent()}>
                                    <Text style={{ color: 'white', fontWeight: 'bold' }}>Add Events</Text>
                                </TouchableOpacity>

                                <View style={{ padding: 10, paddingBottom: 50 }}>
                                </View>

                            </ScrollView>

                        </View>
                    }

                    onClose={() => {
                        this.setState({
                            addEvents: false
                        });
                    }}
                />


                <View style={{ marginTop: 25 }}>
                    <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                        <View style={{ flexDirection: 'row', backgroundColor: '#ededed', width: 270, padding: 10, borderRadius: 10, alignItems: 'center' }}>
                            <Icons name="search-outline" size={20} color="black" />
                            <TextInput placeholder="Search Events" style={{ width: 200, marginLeft: 10 }} onChangeText={(val) => this.setState({ eventSearch: val })} />
                        </View>
                        <TouchableOpacity style={{ backgroundColor: "#4E9F3D", padding: 10, borderRadius: 10, marginLeft: 8 }} onPress={() => this.search()}>
                            <Icons name="search-outline" size={25} color="black" />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={{ flexDirection: 'row', alignSelf: 'flex-start', marginLeft: 20, marginTop: 10 }}>
                    <TouchableOpacity onPress={() => this.setState({ addEvents: true })}>
                        <Text style={{ color: '#4E9F3D' }}>Add Events</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ flexDirection: 'column', marginTop: 15 }}>
                    <View style={{ marginLeft: 20, marginRight: 20 }}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 20, color: '#4E9F3D', }}>
                            This month's events
                        </Text>
                        {this.state.events.map((x,y) => {
                            return <TouchableOpacity style={{ flexDirection: "column", marginTop: 25 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={{ fontWeight: 'bold' }}>{x.events}</Text>
                                <Text style={{ color: '#4E9F3D' }}>Thesis</Text>
                            </View>

                            <View>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Icons name='calendar-outline' size={20} color="#4E9F3D" />
                                    <Text style={{ color: '#4E9F3d', marginLeft: 10, marginTop: 5, marginBottom: 5 }}>{x.date}</Text>
                                </View>

                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <View style={{ width: 270 }}>
                                        <Text>{x.desc}</Text>
                                    </View>

                                    <View>
                                        <TouchableOpacity onPress={() => this.deleteEvent(x.events)}>
                                            <Icons name="trash-outline" size={25} color="red" />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>

                        })}
                    </View>
                </View>

            </View>
        )
    }
}
