import React, { Component } from 'react';
import { View, Text, TextInput, StatusBar, Image, TouchableOpacity, AsyncStorage, ScrollView, Picker } from 'react-native';
import axios from 'axios';
import Icons from 'react-native-vector-icons/Ionicons';
import SwipeUpDownModal from 'react-native-swipe-modal-up-down';
import DateTimePicker from '@react-native-community/datetimepicker';
import konfigurasi from '../../config';

export default class LectureAdmin extends Component{
    constructor(props){
        super(props);

        this.state = {
            lessons: [],
            class: [],
            teachers: [],
            lessons_search: null,
            addLecture: false,
            clock: false,
            lessons_input: null,
            teacher_input: null,
            class_input: null,
            day_input: 'monday',
            time_input: null,
            level: null,
        }
    }

    componentDidMount(){
        AsyncStorage.getItem('token').then(token => {
            axios.post(konfigurasi.server + 'auth/profile', {
                token: token,
                secret: konfigurasi.secret,
            }).then(res => {
                if(res.status == 200){
                    this.setState({
                        level: res.data.level,
                    })
                }
            })

            axios.post(konfigurasi.server + 'lessons/getall', {
                token: token,
                secret: konfigurasi.secret,
            }).then(res => {
                if(res.data.lessons){
                    this.setState({
                        lessons: this.state.lessons.concat(res.data.lessons),
                    })
                }
            })

            axios.post(konfigurasi.server + 'auth/getall/admin?teacher=true', {
                token: token,
                secret: konfigurasi.secret,
            }).then(res => {
                if(res.status == 200){
                    this.setState({
                        teachers: this.state.teachers.concat(res.data.users),
                        teacher_input: res.data.users[0].username,
                    })
                }
            })

            axios.post(konfigurasi.server + 'class/getall', {
                token: token,
                secret: konfigurasi.secret,
            }).then(res => {
                if(res.data.class){
                    this.setState({ class: this.state.class.concat(res.data.class) })
                    this.setState({ class_input: res.data.class[0].class })
                }
            })
        })
    }

    refresh(){
        AsyncStorage.getItem('token').then(token => {
            axios.post(konfigurasi.server + 'lessons/getall', {
                token: token,
                secret: konfigurasi.secret,
            }).then(res => {
                if(res.data.lessons){
                    this.setState({ lessons: [] })
                    this.setState({
                        lessons: this.state.lessons.concat(res.data.lessons),
                    })
                }
            })
        })
    }

    delete(name){
        AsyncStorage.getItem('token').then(token => {
            axios.post(konfigurasi.server + 'lessons/delete', {
                token: token,
                secret: konfigurasi.secret,
                lessons: name,
            }).then(res => {
                if(res.data.success){
                    this.refresh();
                    alert('Success deleting lecture');
                }
            })
        })
    }

    searchLessons(){
        AsyncStorage.getItem('token').then(token => {
            axios.post(konfigurasi.server + 'lessons/search', {
                token: token,
                secret: konfigurasi.secret,
                lessons: this.state.lessons_search,
            }).then(res => {
                if(res.data.lessons){
                    this.setState({ lessons: [] })
                    this.setState({
                        lessons: this.state.lessons.concat(res.data.lessons),
                    })
                }
            })
        })
    }

    addLecture(){
        AsyncStorage.getItem('token').then(token => {
            axios.post(konfigurasi.server + 'lessons/add', {
                token: token,
                secret: konfigurasi.secret,
                lessons: this.state.lessons_input,
                teacher: this.state.teacher_input,
                class: this.state.class_input,
                day: this.state.day_input,
                time: this.state.time_input,
            }).then(res => {
                if(res.data.success){
                    this.setState({
                        lessons_input: null,
                        teacher_input: null,
                        class_input: null,
                        day_input: null,
                        time_input: null,
                    })
                    alert('Success adding new lecture');
                    this.refresh();
                }
            })

            axios.post(konfigurasi.server + 'notification/add', {
                token: token,
                secret: konfigurasi.secret,
                title: 'New Lecture ' + this.state.lessons_input,
                message: "There's new lecture for you!",
                type: 'library-outline',
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

    render(){
        return(
            <ScrollView style={{ flex: 1, flexDirection: 'column', backgroundColor: 'white' }}>
                <StatusBar barStyle={"dark-content"} backgroundColor={"white"} />

                <SwipeUpDownModal
                    modalVisible={this.state.addLecture}
                    ContentModal={
                        <View style={{ flex: 1, flexDirection: 'column', backgroundColor: 'white', marginTop: 70, borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
                            <View style={{ backgroundColor: 'white', elevation: 15, alignItems: 'center', borderTopLeftRadius: 15, borderTopRightRadius: 15 }}>
                                <Icons name='remove-outline' size={40} color="black" />
                                <Text style={{ fontWeight: 'bold', fontSize: 17, marginTop: -8, paddingBottom: 15 }}>Add Some Lecture</Text>
                            </View>

                            <ScrollView contentContainerStyle={{ flexGrow: 1, flexDirection: 'column', marginTop: 20, alignItems: 'center' }}>
                                <Text style={{ fontSize: 15, marginLeft: 45, marginBottom: 10, alignSelf: 'flex-start' }}>Lecture Name</Text>
                                <TextInput style={{ padding: 10, elevation: 10, borderRadius: 10, width: 280, backgroundColor: 'white' }} placeholder="Title Lessons ?" onChangeText={(val) => this.setState({ lessons_input: val })} />

                                {this.state.level == 'teacher' ? <View></View> : <View>
                                    <Text style={{ fontSize: 15, marginBottom: 10, alignSelf: 'flex-start', marginTop: 20 }}>Lecture Teacher</Text>
                                    <View style={{  elevation: 10, borderRadius: 10, width: 280, backgroundColor: 'white'}}>
                                    <Picker selectedItem={this.state.teacher_input} onValueChange={(val) => this.setState({ teacher_input: val })}>
                                        {this.state.teachers.map((x,y) => {
                                            return <Picker label={x.username} value={x.username} />
                                        })}
                                    </Picker>
                                </View>
                                </View>}

                                <Text style={{ fontSize: 15, marginLeft: 45, marginBottom: 10, alignSelf: 'flex-start', marginTop: 20 }}>Lecture Class</Text>
                                <View style={{  elevation: 10, borderRadius: 10, width: 280, backgroundColor: 'white'}}>
                                    <Picker selectedItem={this.state.class_input} onValueChange={(val) => this.setState({ class_input: val })}>
                                        {this.state.class.map((x,y) => {
                                            return <Picker label={"Class - " + x.class} value={x.class} />
                                        })}
                                    </Picker>
                                </View>

                                <Text style={{ fontSize: 15, marginLeft: 45, marginBottom: 10, alignSelf: 'flex-start', marginTop: 20 }}>Lecture Day</Text>
                                <View style={{  elevation: 10, borderRadius: 10, width: 280, backgroundColor: 'white'}}>
                                    <Picker selectedItem={this.state.day} onValueChange={(val) => this.setState({ day_input: val })}>
                                        <Picker.Item label="Monday" value="monday" />
                                        <Picker.Item label="Tuesday" value="tuesday" />
                                        <Picker.Item label="Wednesday" value="wednesday" />
                                        <Picker.Item label="Thursday" value="thursday" />
                                        <Picker.Item label="Friday" value="friday" />
                                        <Picker.Item label="Saturday" value="saturday" />
                                        <Picker.Item label="Sunday" value="sunday" />
                                    </Picker>
                                </View>

                                <Text style={{ fontSize: 15, marginLeft: 45, marginBottom: 10, alignSelf: 'flex-start', marginTop: 20 }}>Lecture Time</Text>
                                <TouchableOpacity style={{ padding: 10, elevation: 10, borderRadius: 10, width: 280, backgroundColor: 'white', alignItems: 'center'}} onPress={() => this.setState({ clock: true })}>
                                    {this.state.time_input == null ? <Text>Click here to set time</Text> : <Text style={{ fontWeight: 'bold' }}>{this.state.time_input}</Text>}
                                </TouchableOpacity>

                                {this.state.clock && (
                                <DateTimePicker
                                    value={new Date()}
                                    mode={'time'}
                                    is24Hour={true}
                                    display="default"
                                    onChange={(event, selectedDate) => {
                                        const date = selectedDate.getHours() + ':' + selectedDate.getMinutes() + ":" + selectedDate.getSeconds();
                                        this.setState({ time_input: date, clock: false });
                                    }}/>
                                )}

                                <TouchableOpacity style={{ marginTop: 25, elevation: 10, borderRadius: 10, width: 280, padding: 10, backgroundColor: '#4E9F3D', alignItems: 'center', justifyContent: 'center' }} onPress={() => this.addLecture()}>
                                    <Text style={{ color: 'white', fontWeight: 'bold' }}>Add Lecture</Text>
                                </TouchableOpacity>

                                <View style={{ padding: 10, paddingBottom: 50 }}>
                                </View>

                            </ScrollView>

                        </View>
                    }

                    onClose={() => {
                        this.setState({
                            addLecture: false
                        });
                    }}
                />

                <View style={{ marginTop: 25 }}>
                    <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                        <View style={{ flexDirection: 'row', backgroundColor: '#ededed', width: 270, padding: 10, borderRadius: 10, alignItems: 'center' }}>
                            <Icons name="search-outline" size={20} color="black" />
                            <TextInput placeholder="Search Lecture" style={{ width: 200, marginLeft: 10 }} onChangeText={(val) => this.setState({ lessons_search: val })} />
                        </View>
                        <TouchableOpacity style={{ backgroundColor: "#4E9F3D", padding: 10, borderRadius: 10, marginLeft: 8 }} onPress={() => this.searchLessons()}>
                            <Icons name="search-outline" size={25} color="black" />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={{ flexDirection: 'row', alignSelf: 'flex-start', marginLeft: 20, marginTop: 10 }}>
                    <TouchableOpacity onPress={() => this.setState({ addLecture: true })}>
                        <Text style={{ color: '#4E9F3D' }}>Add Lecture</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ marginTop: 25, paddingBottom: 25 }}>
                    <Text style={{ marginLeft: 15, fontSize: 17, fontWeight: 'bold' }}>Newest Lecture</Text>
                    {this.state.lessons.length == 0 ? <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: 120 }}>
                        <Icons name='logo-dropbox' color="grey" size={50} />
                        <Text style={{ fontSize: 15, marginTop: 10, color: 'grey' }}>No Lecture Available</Text>
                    </View>: this.state.lessons.map((x,y) => {
                    return <View style={{ backgroundColor: 'white', padding: 15, borderRadius: 15, elevation: 15, marginRight: 10, marginLeft: 10, marginTop: 25 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <View>
                                <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{x.lessons}</Text>
                            </View>

                            <View style={{ backgroundColor: '#4E9F3D', padding: 5, borderRadius: 100 }}>
                                <Text style={{ fontWeight: 'bold' }}>{x.day}</Text>
                            </View>
                        </View>

                        <View style={{ flexDirection: 'column' }}>
                            <Text style={{ marginTop: 15, color: 'grey', marginLeft: 10 }}>The Teacher</Text>
                            <View style={{ flexDirection: 'row', marginTop: 10, alignItems: 'center' }}>
                                <Image source={require('../../assets/illustrations/lecture/teacher.png')} style={{ width: 50, height: 50, marginLeft: 5 }} />
                                <Text style={{ fontWeight: 'bold', marginLeft: 15, fontSize: 16, color: '#4E9F3D' }}>{x.teacher}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', marginTop: 15, marginLeft: 10, justifyContent: 'space-between', alignItems: 'center' }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Icons name='time-outline' size={20} color="#4E9F3D" />
                                    <Text style={{ marginLeft: 10, color: '#4E9F3D' }}>{x.date}</Text>
                                </View>

                                <View style={{ marginRight: 5 }}>
                                    <TouchableOpacity onPress={() => this.delete(x.lessons)}>
                                        <Icons name='trash-outline' size={25} color="red" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                    })}
                </View>
            </ScrollView>
        )
    }
}
