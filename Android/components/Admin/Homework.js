import React, { Component } from 'react';
import { View, Text, TouchableOpacity, TextInput, Picker, ScrollView, Image, AsyncStorage, StatusBar } from 'react-native'
import axios from 'axios'
import Icons from 'react-native-vector-icons/Ionicons'
import SwipeUpDownModal from 'react-native-swipe-modal-up-down'
import konfigurasi from '../../config'
import DateTimePicker from '@react-native-community/datetimepicker'

export default class HomeworkAdmin extends Component{
    constructor(props){
        super(props)

        this.state = {
            homework: [],
            lessons: [],
            class: [],
            title_input: null,
            class_input: null,
            lesson_input: null,
            desc_input: null,
            deadline_input: null,
            homeworkSearch: null,
            teacher_input: null,
            date: false,
            addHomework: false,
        }
    }

    componentDidMount(){
        AsyncStorage.getItem('token').then(token => {
            axios.post(konfigurasi.server + 'homework/getall', {
                token: token,
                secret: konfigurasi.secret
            }).then(res => {
                if(res.data.homework){
                    this.setState({ homework: this.state.homework.concat(res.data.homework) })
                }
            })

            axios.post(konfigurasi.server + 'lessons/getall', {
                token: token,
                secret: konfigurasi.secret
            }).then(res => {
                if(res.data.lessons){
                    this.setState({
                        lessons: this.state.lessons.concat(res.data.lessons),
                        lesson_input: res.data.lessons[0].lessons,
                        teacher_input: res.data.lessons[0].teacher
                    })
                }
            })

            axios.post(konfigurasi.server + 'class/getall', {
                token: token,
                secret: konfigurasi.secret
            }).then(res => {
                if(res.data.class){
                    this.setState({
                        class_input: res.data.class[0].class,
                        class: this.state.class.concat(res.data.class)
                    })
                }
            })
        })
    }

    refresh(){
        AsyncStorage.getItem('token').then(token => {
            axios.post(konfigurasi.server + 'homework/getall', {
                token: token,
                secret: konfigurasi.secret
            }).then(res => {
                if(res.data.homework){
                    this.setState({ homework: [] })
                    this.setState({ homework: this.state.homework.concat(res.data.homework) })
                }
            })

            axios.post(konfigurasi.server + 'lessons/getall', {
                token: token,
                secret: konfigurasi.secret
            }).then(res => {
                if(res.data.lessons){
                    this.setState({ lessons: [] })
                    this.setState({
                        lessons: this.state.lessons.concat(res.data.lessons)
                    })
                }
            })

            axios.post(konfigurasi.server + 'class/getall', {
                token: token,
                secret: konfigurasi.secret
            }).then(res => {
                if(res.data.class){
                    this.setState({ class: [] })
                    this.setState({
                        class: this.state.class.concat(res.data.class)
                    })
                }
            })
        })
    }


    addHomework(){
        AsyncStorage.getItem('token').then(token => {
            axios.post(konfigurasi.server + 'homework/add', {
                token: token,
                secret: konfigurasi.secret,
                title: this.state.title_input,
                class: this.state.class_input,
                lessons: this.state.lesson_input,
                teacher: this.state.teacher_input,
                desc: this.state.desc_input,
                deadline: this.state.deadline_input
            }).then(res => {
                if(res.data.success){
                    alert('Homework sucessully added')
                    this.refresh()
                }
            })
        })
    }

    search(){
        AsyncStorage.getItem('token').then(token => {
            axios.post(konfigurasi.server + 'homework/search', {
                token: token,
                secret: konfigurasi.secret,
                homework: this.state.homeworkSearch,
            }).then(res => {
                if(res.data.homework){
                    this.setState({ homework: [] })
                    this.setState({ homework: this.state.homework.concat(res.data.homework) })
                }
            })
        })
    }

    delete(id){
        AsyncStorage.getItem('token').then(token => {
            axios.post(konfigurasi.server + 'homework/delete', {
                token: token,
                secret: konfigurasi.secret,
                id: id
            }).then(res => {
                if(res.data.success){
                    alert('Homework sucessully deleted')
                    this.refresh()
                }
            })
        })
    }

    render(){
        return(
            <ScrollView style={{ flexGrow: 1, flexDirection: 'column', backgroundColor: 'white' }}>
                <StatusBar backgroundColor='white' barStyle='dark-content' />

                <SwipeUpDownModal
                    modalVisible={this.state.addHomework}
                    ContentModal={
                        <View style={{ flex: 1, flexDirection: 'column', backgroundColor: 'white', marginTop: 70, borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
                            <View style={{ backgroundColor: 'white', elevation: 15, alignItems: 'center', borderTopLeftRadius: 15, borderTopRightRadius: 15 }}>
                                <Icons name='remove-outline' size={40} color="black" />
                                <Text style={{ fontWeight: 'bold', fontSize: 17, marginTop: -8, paddingBottom: 15 }}>Add Some Homework</Text>
                            </View>

                            <ScrollView contentContainerStyle={{ flexGrow: 1, flexDirection: 'column', marginTop: 20, alignItems: 'center' }}>
                                <Text style={{ fontSize: 15, marginLeft: 45, marginBottom: 10, alignSelf: 'flex-start' }}>Title</Text>
                                <TextInput style={{ padding: 10, elevation: 10, borderRadius: 10, width: 280, backgroundColor: 'white' }} placeholder="Title Homework ?" onChangeText={(val) => this.setState({ title_input: val })} />

                                <Text style={{ fontSize: 15, marginLeft: 45, marginBottom: 10, alignSelf: 'flex-start', marginTop: 20 }}>Description</Text>
                                <TextInput style={{ padding: 10, elevation: 10, borderRadius: 10, width: 280, backgroundColor: 'white' }} placeholder="Description ?" onChangeText={(val) => this.setState({ desc_input: val })} multiline={true} />



                                <Text style={{ fontSize: 15, marginLeft: 45, marginBottom: 10, alignSelf: 'flex-start', marginTop: 20 }}>Class</Text>
                                <View style={{  elevation: 10, borderRadius: 10, width: 280, backgroundColor: 'white'}}>
                                    <Picker selectedItem={this.state.class_input} onValueChange={(val) => this.setState({ class_input: val })}>
                                        {this.state.class.map((val, index) => {
                                            return(
                                                <Picker.Item label={"Class - " + val.class} value={val.class} key={index} />
                                            )
                                        })}
                                    </Picker>
                                </View>

                                <Text style={{ fontSize: 15, marginLeft: 45, marginBottom: 10, alignSelf: 'flex-start', marginTop: 20 }}>Lecture</Text>
                                <View style={{  elevation: 10, borderRadius: 10, width: 280, backgroundColor: 'white'}}>
                                    <Picker selectedItem={this.state.lesson} onValueChange={(val) => this.setState({ lesson_input: val })}>
                                        {this.state.lessons.map((val, index) => {
                                            return(
                                                <Picker.Item label={val.lessons} value={val.lessons} key={index} />
                                            )
                                        })}
                                    </Picker>
                                </View>

                                <Text style={{ fontSize: 15, marginLeft: 45, marginBottom: 10, alignSelf: 'flex-start', marginTop: 20 }}>The Deadline</Text>
                                <TouchableOpacity style={{ padding: 10, elevation: 10, borderRadius: 10, width: 280, backgroundColor: 'white', alignItems: 'center'}} onPress={() => this.setState({ date: true })}>
                                    {this.state.deadline_input == null ? <Text>Click here to set deadline</Text> : <Text style={{ fontWeight: 'bold' }}>{this.state.deadline_input}</Text>}
                                </TouchableOpacity>

                                {this.state.date && (
                                <DateTimePicker
                                    value={new Date()}
                                    mode={'date'}
                                    is24Hour={true}
                                    display="default"
                                    onChange={(event, selectedDate) => {
                                        const date = selectedDate.getFullYear() + '-' + selectedDate.getMonth() + '-' + selectedDate.getDate();
                                        this.setState({ deadline_input: date, date: false });
                                    }}/>
                                )}

                                <TouchableOpacity style={{ marginTop: 25, elevation: 10, borderRadius: 10, width: 280, padding: 10, backgroundColor: '#4E9F3D', alignItems: 'center', justifyContent: 'center' }} onPress={() => this.addHomework()}>
                                    <Text style={{ color: 'white', fontWeight: 'bold' }}>Add Homework</Text>
                                </TouchableOpacity>

                                <View style={{ padding: 10, paddingBottom: 50 }}>
                                </View>

                            </ScrollView>

                        </View>
                    }

                    onClose={() => {
                        this.setState({
                            addHomework: false
                        });
                    }}
                />



                <View style={{ marginTop: 25 }}>
                    <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                        <View style={{ flexDirection: 'row', backgroundColor: '#ededed', width: 270, padding: 10, borderRadius: 10, alignItems: 'center' }}>
                            <Icons name="search-outline" size={20} color="black" />
                            <TextInput placeholder="Search Home Work" style={{ width: 200, marginLeft: 10 }} onChangeText={(val) => this.setState({ homeworkSearch: val })} />
                        </View>
                        <TouchableOpacity style={{ backgroundColor: "#4E9F3D", padding: 10, borderRadius: 10, marginLeft: 8 }} onPress={() => this.search()}>
                            <Icons name="search-outline" size={25} color="black" />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={{ flexDirection: 'row', alignSelf: 'flex-start', marginLeft: 20, marginTop: 10 }}>
                    <TouchableOpacity onPress={() => this.setState({ addHomework: true })}>
                        <Text style={{ color: '#4E9F3D' }}>Add Homework</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ paddingBottom: 30 }}>
                    {this.state.homework.map((x,y) => {
                        return <View style={{ backgroundColor: 'white', padding: 15, borderRadius: 15, elevation: 15, marginRight: 10, marginLeft: 10, marginTop: 25 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <View>
                                <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{x.lessons}</Text>
                            </View>

                            <View style={{ backgroundColor: '#4E9F3D', padding: 5, borderRadius: 100 }}>
                                <Text style={{ fontWeight: 'bold' }}>Type</Text>
                            </View>
                        </View>

                        <View style={{ flexDirection: 'column' }}>
                            <Text style={{ marginTop: 15, color: 'grey', marginLeft: 10 }}>The Homeworks</Text>
                            <View style={{ flexDirection: 'row', marginTop: 10, alignItems: 'center' }}>
                                <Image source={require('../../assets/illustrations/lecture/teacher.png')} style={{ width: 50, height: 50, marginLeft: 5 }} />
                                <Text style={{ fontWeight: 'bold', marginLeft: 15, fontSize: 16, color: '#4E9F3D' }}>{x.title}</Text>
                            </View>
                             <View style={{ marginTop: 10, marginLeft: 5 }}>
                                <Text style={{ color: '#4E9F3D', fontWeight: 'bold' }}>Task to complete</Text>
                                <Text style={{ color: 'grey' }}>{x.desc}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', marginTop: 15, marginLeft: 10, justifyContent: 'space-between', alignItems: 'center' }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Icons name='time-outline' size={20} color="#4E9F3D" />
                                    <Text style={{ marginLeft: 10, color: '#4E9F3D' }}>{x.deadline}</Text>
                                </View>

                                <View style={{ marginRight: 5 }}>
                                    <TouchableOpacity onPress={() => this.delete(x._id)}>
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
