import React, { Component } from 'react';
import { View, Text, TextInput, StatusBar, Image, TouchableOpacity, AsyncStorage, ScrollView } from 'react-native';
import axios from 'axios';
import Icons from 'react-native-vector-icons/Ionicons';
import konfigurasi from '../../config';

export default class Lecture extends Component{
    constructor(props){
        super(props);
        this.state = {
            data: [],
        }
    }

    componentDidMount(){
        AsyncStorage.getItem('token').then(token => {
            axios.post(konfigurasi.server + 'lessons/getall', {
                token: token,
                secret: konfigurasi.secret,
            }).then(res => {
                this.setState({
                    data: this.state.data.concat(res.data.lessons)
                })
                console.log(res.data.lessons)
            }).catch(err => {
                console.log(err)
            })
        })
    }

    render(){
        return(
            <ScrollView style={{ flex: 1, flexDirection: 'column', backgroundColor: 'white' }}>
                <StatusBar barStyle={"dark-content"} backgroundColor={"white"} />
                <View style={{ alignItems: 'center', marginTop: 25 }}>
                    <Image source={require('../../assets/illustrations/lecture/banner.png')} style={{ width: 160, height: 120 }} />
                    <Text style={{ marginTop: 10, fontWeight: 'bold', fontSize: 18 }}>Lecture of this day</Text>
                </View>

                <View style={{ marginTop: 25, paddingBottom: 25 }}>
                    {this.state.data.map((x, y) => {
                        return  <View style={{ backgroundColor: 'white', padding: 15, marginTop: 15, borderRadius: 15, elevation: 15, marginRight: 10, marginLeft: 10 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <View>
                                <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{x.lessons}</Text>
                            </View>

                            <View style={{ backgroundColor: '#4E9F3D', padding: 5, borderRadius: 100 }}>
                                <Text style={{ fontWeight: 'bold' }}>Type</Text>
                            </View>
                        </View>

                        <View style={{ flexDirection: 'column' }}>
                            <Text style={{ marginTop: 15, color: 'grey', marginLeft: 10 }}>The Teacher</Text>
                            <View style={{ flexDirection: 'row', marginTop: 10, alignItems: 'center' }}>
                                <Image source={require('../../assets/illustrations/lecture/teacher.png')} style={{ width: 50, height: 50, marginLeft: 5 }} />
                                <Text style={{ fontWeight: 'bold', marginLeft: 15, fontSize: 16, color: '#4E9F3D' }}>{x.teacher}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', marginTop: 15, marginLeft: 10 }}>
                                <Icons name='time-outline' size={20} color="#4E9F3D" />
                                <Text style={{ marginLeft: 10, color: '#4E9F3D' }}>{x.date}</Text>
                            </View>
                        </View>
                    </View>


                    })}
                </View>
            </ScrollView>
        )
    }
}
