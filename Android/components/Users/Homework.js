import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StatusBar, AsyncStorage, Image, ScrollView } from 'react-native';
import axios from 'axios';
import Icons from 'react-native-vector-icons/Ionicons';

export default class Homework extends Component{
    render(){
        return(
            <View style={{ flex: 1, flexDirection: 'column', backgroundColor: 'white' }}>
                <StatusBar backgroundColor='white' barStyle='dark-content' />

                <View style={{ marginTop: 25, alignItems: 'center' }}>
                    <Image source={require('../../assets/illustrations/homework/banner.png')} style={{ width: 150, height: 150 }} />
                    <Text style={{ marginTop: 15, fontWeight: 'bold', fontSize: 20 }}>This is Your Homework</Text>
                </View>

                <View style={{ marginTop: 25, paddingBottom: 25 }}>
                    <View style={{ backgroundColor: 'white', padding: 15, borderRadius: 15, elevation: 15, marginRight: 10, marginLeft: 10 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <View>
                                <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Computer Science</Text>
                            </View>

                            <View style={{ backgroundColor: '#4E9F3D', padding: 6, borderRadius: 50 }}>
                                <Text style={{ fontWeight: 'bold' }}>Prodi</Text>
                            </View>
                        </View>

                        <View style={{ flexDirection: 'column' }}>
                            <Text style={{ marginTop: 15, color: 'grey', marginLeft: 10 }}>The Teacher</Text>
                            <View style={{ flexDirection: 'row', marginTop: 10, alignItems: 'center' }}>
                                <Image source={require('../../assets/illustrations/lecture/teacher.png')} style={{ width: 50, height: 50, marginLeft: 5 }} />
                                <Text style={{ fontWeight: 'bold', marginLeft: 15, fontSize: 16, color: '#4E9F3D' }}>Richard Stallman</Text>
                            </View>
                            <View style={{ marginTop: 10, marginLeft: 5 }}>
                                <Text style={{ color: '#4E9F3D', fontWeight: 'bold' }}>Task to complete</Text>
                                <Text style={{ color: 'grey' }}>Make a binary tree using c++ language</Text>
                            </View>
                            <View style={{ flexDirection: 'row', marginTop: 15, marginLeft: 10 }}>
                                <Icons name='time-outline' size={20} color="#4E9F3D" />
                                <Text style={{ marginLeft: 10, color: '#4E9F3D' }}>07:30</Text>
                            </View>
                        </View>
                    </View>
                </View>

            </View>
        )
    }
}
