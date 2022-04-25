import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput, Picker, ScrollView, Image, AsyncStorage, StatusBar } from 'react-native'
import axios from 'axios'
import Icons from 'react-native-vector-icons/Ionicons'
import SwipeUpDownModal from 'react-native-swipe-modal-up-down'
import konfigurasi from '../../config'
import DateTimePicker from '@react-native-community/datetimepicker'

export default class HomeworkAdmin extends Component{
    constructor(props){
        super(props)

        this.state = {
            username: null,
            homework: [],
            homework_complete: [],
            lessons: [],
            class: [],
            title_input: null,
            class_input: null,
            lesson_input: null,
            desc_input: '',
            deadline_input: null,
            homeworkSearch: null,
            teacher_input: null,
            date: false,
            addHomework: false,
            complete: false,
            readmore: false,
            desc: '',
        }
    }

    componentDidMount(){
        AsyncStorage.getItem('token').then(token => {
            axios.post(konfigurasi.server + 'homework/getall', {
                token: token,
                secret: konfigurasi.secret,
            }).then(res => {
                if(res.data.homework){
                    this.setState({ homework: this.state.homework.concat(res.data.homework) })
                }
            })

            axios.post(konfigurasi.server + 'auth/profile', {
                token: token,
                secret: konfigurasi.secret
            }).then(res => {
                if(res.status == 200){
                    this.setState({ username: res.data.username })
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

            axios.post(konfigurasi.server + 'notification/add', {
                token: token,
                secret: konfigurasi.secret,
                title: 'Homework ' + this.state.lesson_input,
                message: 'You have new homework from ' + this.state.teacher_input,
                type: 'newspaper-outline',
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

    complete(id){
        AsyncStorage.getItem('token').then(token => {
            axios.post(konfigurasi.server + 'homework/get', {
                token: token,
                secret: konfigurasi.secret,
                id: id
            }).then(res => {
                this.setState({ complete: true })
                this.setState({ homework_complete: this.state.homework_complete.concat(res.data.homework[0].completed) })
            })
        })
    }

    readmore(x){
        this.setState({ readmore: true })
        this.setState({ desc: x })
    }

    render(){
        return(
            <ScrollView style={{ flexGrow: 1, flexDirection: 'column', backgroundColor: 'white' }}>
                <StatusBar backgroundColor={"#4E9F3D"} barStyle='dark-content' />


                <Modal visible={this.state.readmore} transparent={true} animationType="slide">
                    <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <View style={{ backgroundColor: 'white', padding: 15, borderRadius: 10, alignItems: 'center' }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 17 }}>Description</Text>
                            <Text style={{ fontSize: 15, marginTop: 10 }}></Text>
                            <Text style={{ fontSize: 15 }}>{this.state.desc}</Text>

                            <TouchableOpacity onPress={() => this.setState({ readmore: false })}>
                                <Text style={{ fontSize: 15, marginTop: 10, color: '#00a8ff' }}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

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

                <SwipeUpDownModal
                    modalVisible={this.state.complete}
                    ContentModal={
                        <View style={{ flex: 1, flexDirection: 'column', backgroundColor: 'white', marginTop: 70, borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
                            <View style={{ backgroundColor: 'white', elevation: 15, alignItems: 'center', borderTopLeftRadius: 15, borderTopRightRadius: 15 }}>
                                <Icons name='remove-outline' size={40} color="black" />
                                <Text style={{ fontWeight: 'bold', fontSize: 17, marginTop: -8, paddingBottom: 15 }}>Result Homework</Text>
                            </View>

                            <ScrollView contentContainerStyle={{ flexGrow: 1, flexDirection: 'column', marginTop: 20 }}>
                                {this.state.homework_complete.length == 0 ? <View style={{ alignItems: 'center' }}>
                                    <Icons name="logo-dropbox" size={30} color={'grey'} />
                                    <Text style={{ fontSize: 15, marginTop: 10, color: 'grey', fontWeight: 'bold' }}>No Homework</Text>
                                </View> : this.state.homework_complete.map((x,y) => {
                                    return(
                                <View style={{ backgroundColor: 'white', padding: 15, borderRadius: 15, elevation: 15, marginRight: 10, marginLeft: 10, marginTop: 25 }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <View>
                                            <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{x.title_result}</Text>
                                        </View>

                                        <View style={{ backgroundColor: '#4E9F3D', padding: 5, borderRadius: 100 }}>
                                            <Text style={{ fontWeight: 'bold' }}>Grade - {x.class}</Text>
                                        </View>
                                    </View>

                                    <View style={{ flexDirection: 'column' }}>
                                        <Text style={{ marginTop: 15, color: 'grey', marginLeft: 10 }}>The Homeworks</Text>
                                        <View style={{ flexDirection: 'row', marginTop: 10, alignItems: 'center' }}>
                                            <Image source={require('../../assets/illustrations/lecture/teacher.png')} style={{ width: 50, height: 50, marginLeft: 5 }} />
                                            <View style={{ flexDirection: 'column' }}>
                                                <Text style={{ fontWeight: 'bold', marginLeft: 15, fontSize: 16, color: '#4E9F3D' }}>{x.name}</Text>
                                                <Text style={{ color: 'grey', marginLeft: 15 }}>{x.major}</Text>
                                            </View>
                                        </View>
                                         <View style={{ marginTop: 10, marginLeft: 5 }}>
                                            <Text style={{ color: '#4E9F3D', fontWeight: 'bold' }}>Description</Text>
                                             <Text style={{ color: 'grey', marginTop: 10 }}>{x.desc_result == null ? <Text></Text> : x.desc_result.length > 15  ? <Text style={{ color: '#4E9F3D' }} onPress={() => this.readmore(x.desc_result)}><Icons name="newspaper-outline" size={20} /> Read More..</Text> : x.desc_result}</Text>
                                        </View>
                                    </View>


                                </View>

                                    )
                                })}

                            </ScrollView>
                        </View>
                    }
                    
                    onClose={() => {
                        this.setState({
                            complete: false
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
                    {this.state.homework.length == 0 ? <View style={{ marginTop: 65, alignItems: 'center', flexDirection: 'column', justifyContent: 'center' }}>
                        <Icons name='logo-dropbox' size={80} color="grey" />
                        <Text style={{ fontWeight: 'bold', color: 'grey' }}>Homework not available yet!</Text>
                    </View> : this.state.homework.map((x,y) => {
                        return <View style={{ backgroundColor: 'white', padding: 15, borderRadius: 15, elevation: 15, marginRight: 10, marginLeft: 10, marginTop: 25 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <View>
                                <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{x.lessons}</Text>
                            </View>

                            <View style={{ backgroundColor: '#4E9F3D', padding: 5, borderRadius: 100 }}>
                                <Text style={{ fontWeight: 'bold' }}>Grade - {x.class}</Text>
                            </View>
                        </View>

                        <View style={{ flexDirection: 'column' }}>
                            <Text style={{ marginTop: 15, color: 'grey', marginLeft: 10 }}>The Homeworks</Text>
                            <View style={{ flexDirection: 'row', marginTop: 10, alignItems: 'center' }}>
                                <Image source={require('../../assets/illustrations/lecture/teacher.png')} style={{ width: 50, height: 50, marginLeft: 5 }} />
                                <Text style={{ fontWeight: 'bold', marginLeft: 15, fontSize: 16, color: '#4E9F3D' }}>{x.title}</Text>
                            </View>
                            <TouchableOpacity style={{ marginLeft: 5, marginTop: 10, flexDirection: 'row' }} onPress={() => this.complete(x._id)}>
                                <Icons name='folder-outline' size={20} color="#4E9F3D" />
                                <Text style={{ color: '#4E9F3D', marginLeft: 5 }}>Open Result</Text>
                            </TouchableOpacity>
                            <View style={{ marginTop: 10, marginLeft: 5 }}>
                                <Text style={{ color: '#4E9F3D', fontWeight: 'bold' }}>Task to complete</Text>
                                <Text style={{ color: 'grey' }}>{x.desc}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', marginTop: 15, marginLeft: 10, justifyContent: 'space-between', alignItems: 'center' }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Icons name='time-outline' size={20} color="#4E9F3D" />
                                    <Text style={{ marginLeft: 7, color: '#4E9F3D', fontWeight: 'bold' }}>{x.deadline}</Text>
                                </View>
                                {this.state.username == x.teacher || this.state.username == '@deadline' ? <View style={{ marginRight: 5 }}>
                                    <TouchableOpacity onPress={() => this.delete(x._id)}>
                                        <Icons name='trash-outline' size={25} color="red" />
                                    </TouchableOpacity>
                                </View> : <View></View>}
                            </View>
                        </View>
                    </View>

                    })}
                </View>

            </ScrollView>
        )
    }
}
