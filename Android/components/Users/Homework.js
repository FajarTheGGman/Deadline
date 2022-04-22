import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StatusBar, TextInput, AsyncStorage, Image, ScrollView } from 'react-native';
import axios from 'axios';
import Icons from 'react-native-vector-icons/Ionicons';
import SwipeUpDownModal from 'react-native-swipe-modal-up-down';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import konfigurasi from '../../config'

export default class Homework extends Component{
    constructor(props){
        super(props);

        this.state = {
            homework: [],
            resultTitle: null,
            resultDesc: null,
            result: false,
            homework_title: null,
            homework_desc: null,
            homework_teacher: null,
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
        })
    }

    open_result(index){
        let title = this.state.homework[index].title;
        let desc = this.state.homework[index].desc;
        let teacher = this.state.homework[index].teacher;
        this.state.homework_title = title;
        this.state.homework_desc = desc;
        this.state.homework_teacher = teacher;
        this.setState({
            result: true,
        })
    }

    async send_result(){
	/*
        let res = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [5, 4],
            quality: 1,
        });
	*/
        
        AsyncStorage.getItem('token').then(token => {
            axios.post(konfigurasi.server + 'homework/add/completed', {
                token: token,
                secret: konfigurasi.secret,
                title: this.state.homework_title,
                teacher: this.state.homework_teacher,
                title_result: this.state.resultTitle,
                desc_result: this.state.resultDesc,
                date: new Date().getDay() + "/" + new Date().getMonth() + "/" + new Date().getFullYear()
            }).then(res => {
                if(res.data.success){
                    alert('Berhasil mengirim hasil tugas')
                }else if(res.data.already){
                    alert('Kamu sudah mengirim hasil tugas')
                }
            })
        })
        
    }

    render(){
        return(
            <ScrollView contentContainerStyle={{ flexGrow: 1, flexDirection: 'column', backgroundColor: 'white' }}>
                <StatusBar backgroundColor={"#4E9F3D"} barStyle='dark-content' />

                <SwipeUpDownModal
                    modalVisible={this.state.result}
                    ContentModal={
                        <View style={{ flex: 1, flexDirection: 'column', backgroundColor: 'white', marginTop: 70, borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
                            <View style={{ backgroundColor: 'white', elevation: 15, alignItems: 'center', borderTopLeftRadius: 15, borderTopRightRadius: 15 }}>
                                <Icons name='remove-outline' size={40} color="black" />
                                <Text style={{ fontWeight: 'bold', fontSize: 17, marginTop: -8, paddingBottom: 15 }}>Send Result</Text>
                            </View>

                            <ScrollView contentContainerStyle={{ flexGrow: 1, flexDirection: 'column', marginTop: 20, alignItems: 'center' }}>

                                <Text style={{ padding: 15, elevation: 10, borderRadius: 10, width: 280, backgroundColor: 'white', fontWeight: 'bold', marginTop: 15 }}>Homework : {this.state.homework_title}</Text>
                                <Text style={{ padding: 15, elevation: 10, borderRadius: 10, width: 280, backgroundColor: 'white', fontWeight: 'bold', marginTop: 20 }}>{this.state.homework_desc}</Text>

                                <Text style={{ fontSize: 15, marginLeft: 45, marginBottom: 10, alignSelf: 'flex-start', marginTop: 20 }}>Title Result</Text>
                                <TextInput style={{ padding: 10, elevation: 10, borderRadius: 10, width: 280, backgroundColor: 'white' }} placeholder="Title Result ?" onChangeText={(val) => this.setState({ resultTitle: val })} />

                                {/*
                                <TouchableOpacity style={{ padding: 10, elevation: 10, borderRadius: 10, width: 280, backgroundColor: 'white', alignItems: 'center', marginTop: 20, flexDirection: 'row', justifyContent: 'center' }} onPress={() => this.send_result()}><Icons name='document-outline' size={25} /><Text style={{ fontWeight: 'bold' }}>File</Text></TouchableOpacity>*/}

                                <Text style={{ fontSize: 15, marginLeft: 45, marginBottom: 10, alignSelf: 'flex-start', marginTop: 20 }}>Description</Text>
                                <TextInput style={{ padding: 10, elevation: 10, borderRadius: 10, width: 280, backgroundColor: 'white' }} placeholder="Description ?" onChangeText={(val) => this.setState({ resultDesc: val })} multiline={true} />

                                <TouchableOpacity style={{ marginTop: 25, elevation: 10, borderRadius: 10, width: 280, padding: 10, backgroundColor: '#4E9F3D', alignItems: 'center', justifyContent: 'center' }} onPress={() => this.send_result()}>
                                    <Text style={{ color: 'white', fontWeight: 'bold' }}>Send <Icons name='send-outline' size={15} /></Text>
                                </TouchableOpacity>

                                <View style={{ padding: 10, paddingBottom: 50 }}>
                                </View>

                            </ScrollView>

                        </View>
                    }

                    onClose={() => {
                        this.setState({
                            result: false
                        });
                    }}
                />

                <View style={{ marginTop: 25, alignItems: 'center' }}>
                    <Image source={require('../../assets/illustrations/homework/banner.png')} style={{ width: 150, height: 150 }} />
                    <Text style={{ marginTop: 15, fontWeight: 'bold', fontSize: 20 }}>This is Your Homework</Text>
                </View>

                <View style={{ marginTop: 25, paddingBottom: 25 }}>
                    {this.state.homework.length == 0 ? <View style={{ marginTop: 65, alignItems: 'center', flexDirection: 'column', justifyContent: 'center' }}>
                        <Icons name='logo-dropbox' size={80} color="grey" />
                        <Text style={{ fontWeight: 'bold', color: 'grey' }}>Homework not available!</Text>
                    </View> : this.state.homework.map((x,y) => {
                        return <View style={{ backgroundColor: 'white', padding: 15, borderRadius: 15, elevation: 15, marginRight: 10, marginLeft: 10, marginTop: 25 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <View>
                                <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{x.lessons}</Text>
                            </View>

                            <TouchableOpacity style={{ backgroundColor: '#4E9F3D', padding: 5, borderRadius: 10, elevation: 15 }} onPress={() => this.open_result(y)}>
                                <Text style={{ fontWeight: 'bold' }}><Icons name='send-outline' size={20}/></Text>
                            </TouchableOpacity>
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
                            </View>
                        </View>
                    </View>
                    })}
                </View>
            </ScrollView>
        )
    }
}
