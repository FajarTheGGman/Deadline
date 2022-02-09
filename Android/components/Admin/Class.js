import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, StatusBar, AsyncStorage } from 'react-native';
import axios from 'axios';
import Icons from 'react-native-vector-icons/Ionicons';
import konfigurasi from '../../config';
import SwipeUpDown from 'react-native-swipe-modal-up-down';

export default class ClassAdmin extends Component{
    render(){
        return(
            <View style={{ flex: 1, flexDirection: 'column', backgroundColor: 'white' }}>
                <StatusBar backgroundColor="white" barStyle="dark-content" />

                <View style={{ marginTop: 25 }}>
                    <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                        <View style={{ flexDirection: 'row', backgroundColor: '#ededed', width: 270, padding: 10, borderRadius: 10, alignItems: 'center' }}>
                            <Icons name="search-outline" size={20} color="black" />
                            <TextInput placeholder="Search Class" style={{ width: 200, marginLeft: 10 }} />
                        </View>
                        <TouchableOpacity style={{ backgroundColor: "#4E9F3D", padding: 10, borderRadius: 10, marginLeft: 8 }}>
                            <Icons name="search-outline" size={25} color="black" />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={{ flexDirection: 'row', alignSelf: 'flex-start', marginLeft: 20, marginTop: 10 }}>
                    <TouchableOpacity onPress={() => this.setState({ addRoles: true })}>
                        <Text style={{ color: '#4E9F3D' }}>Add Class</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ flexDirection: 'column', marginTop: 25 }}>
                    <View style={{ backgroundColor: 'white', elevation: 15, borderRadius: 15, marginLeft: 10, marginRight: 10, flexDirection: 'row', padding: 15, justifyContent: 'space-between', alignItems: 'center' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Image source={require('../../assets/icons/class.png')} style={{ width: 50, height: 50, borderRadius: 100 }} />
                            <View style={{ flexDirection: 'column' }}>
                                <Text style={{ fontWeight: 'bold', marginLeft: 10 }}>Class 1</Text>
                                <Text style={{ fontSize: 12, marginLeft: 10 }}>J</Text>
                            </View>
                        </View>

                        <View style={{ marginRight: 10 }}>
                            <TouchableOpacity>
                                <Icons name="trash-outline" size={25} color="red" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        )
    }
}
