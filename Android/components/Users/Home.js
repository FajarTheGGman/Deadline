import React, { Component } from 'react'
import { View, Text, Image, TouchableOpacity, AsyncStorage, ScrollView, StatusBar } from 'react-native'
import Modal from 'react-native-modal'
import Icons from 'react-native-vector-icons/Ionicons'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Permissions, Notifications } from 'expo'
import { StackActions } from '@react-navigation/native'
import konfigurasi from '../../config'
import axios from 'axios'

// expo packages
import * as Location from 'expo-location'

export default class Tab extends Component{

    componentDidMount(){
        AsyncStorage.getItem('token').then(token => {
            if(!token){
                this.props.navigation.dispatch(
                    StackActions.replace('Login')
                )
            }
        })
    }

    render(){
        let Tabs = createBottomTabNavigator()
        return(
            <Tabs.Navigator screenOptions={({ route }) => ({
               tabBarStyle: {
                    backgroundColor: '#191A19',
                    color: 'black',
                    elevation: 0,
                    width: 300,
                    marginLeft: 25,
                    marginRight: 25,
                    borderRadius: 20,
                    marginBottom: 25,
                    position: 'absolute'
                },
            })}>
                <Tabs.Screen name="Index" component={Index} options={{ headerShown: false, tabBarIcon: ({ color, size }) => (
                    <Icons name='home-outline' size={25} color={"white"} />
                ), tabBarLabel: () => { return null } }} />
                <Tabs.Screen name="Barcode" component={Barcode} options={{ headerShown: false, tabBarIcon: ({ color, size }) => (
                    <Icons name='qr-code-outline' size={25} color={"white"} />
                ), tabBarLabel: () => { return null } }} />
                <Tabs.Screen name="Settings" component={Settings} options={{ headerShown: false, tabBarIcon: ({ color, size }) => (
                    <Icons name='cog-outline' size={25} color={"white"} />
                ), tabBarLabel: () => { return null } }} />
            </Tabs.Navigator>
        )
    }
}

class Barcode extends Component{
    render(){
        return(
            <View style={{ flex: 1, flexDirection: 'column', backgroundColor: 'white' }}>
                <StatusBar barStyle={"dark-content"} backgroundColor={"white"} />
                
            </View>        
        )
    }
}

class Settings extends Component{
    constructor(props){
        super(props)
        this.state = {
        }
    }

    logout(){
        AsyncStorage.removeItem('token')
        this.props.navigation.dispatch(
            StackActions.replace("Login")
        )
    }

    render(){
        return(
            <View style={{ flex: 1, flexDirection: 'column', backgroundColor: 'white' }}>
                <StatusBar barStyle={"dark-content"} backgroundColor={"white"} />
                <Text style={{ color: '#191A19', fontWeight: 'bold', fontSize: 17, alignSelf: 'center', marginTop: 15 }}>Settings <Icons name='hammer-outline' size={20} color="#191A19" /></Text>
                
                <View style={{ flexDirection: 'column', marginLeft: 20, marginRight: 20, justifyContent: 'space-between' }}>
                    <View>
                        <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10  }}>
                            <View style={{ flexDirection: 'row', marginTop: 10  }}>
                                <Icons name="text-outline" size={25} color='black' />
                                <Text style={{ fontWeight: 'bold', marginLeft: 10, marginTop: 3  }}>Change The Username</Text>
                            </View>
                                    
                            <View style={{ marginTop: 10  }}>
                                <Icons name="chevron-forward-outline" size={25} color='black' />
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10  }}>
                            <View style={{ flexDirection: 'row', marginTop: 10  }}>
                                <Icons name="key-outline" size={25} color='black' />
                                <Text style={{ fontWeight: 'bold', marginLeft: 10, marginTop: 3  }}>Change The Password</Text>
                            </View>
                                    
                            <View style={{ marginTop: 10  }}>
                                <Icons name="chevron-forward-outline" size={25} color='black' />
                            </View>
                        </TouchableOpacity>
                    </View>

                    <View style={{ flexDirection: 'column' }}>
                        <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10  }} onPress={() => this.logout()}>
                            <View style={{ flexDirection: 'row', marginTop: 10  }}>
                                <Icons name="log-out-outline" size={25} color='red' />
                                <Text style={{ fontWeight: 'bold', marginLeft: 10, color: 'red', marginTop: 3  }}>Get Out</Text>
                            </View>
                                    
                            <View style={{ marginTop: 10  }}>
                                <Icons name="chevron-forward-outline" size={25} color='red' />
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }
}

class Index extends Component{
    constructor(props){
        super(props)
        this.state = {
            username: '',
            schedule: '',
            lessons: []
        }
    }

    componentDidMount(){
        AsyncStorage.getItem("token").then((token) => {
            axios.post(konfigurasi.server + 'auth/profile', {
                token: token,
                secret: konfigurasi.secret
            }).then((res) => {
                this.setState({
                    username: res.data.name,
                })
            })
        })

        let hours = 1
        let minutes = 10
        let sec = 50
        setInterval(() => {
            this.setState({
                schedule: `${hours} : ${minutes} : ${sec}`
            })
            sec--;
            if(sec == 0){
                minutes--;
                sec = 60;
                if(minutes == 0){
                    hours--;
                    minutes = 60;
                    if(hours == 0){
                        this.setState({
                            schedule: 'Class Begin'
                        })
                    }
                }
            }
        }, 1000)
    }

    render(){
        return(
            <View style={{ flex: 1, flexDirection: 'column', backgroundColor: 'white' }}>
                <StatusBar barStyle={"dark-content"} backgroundColor={"white"} />
                
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View style={{ flexDirection: 'row', marginTop: 25, marginLeft: 20 }}>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('Profile')}>
                            <Image source={{ uri: "https://66.media.tumblr.com/f437e1a485894e5a4b50fe79fb59913e/tumblr_mxccksP6TQ1snvtspo1_500.jpg" }} style={{ width: 50, height: 50, borderRadius: 100, borderWidth: 2, borderColor: '#191A19' }} />
                        </TouchableOpacity>

                        <View style={{ flexDirection: 'column', marginLeft: 15 }}>
                            <Text style={{ color: '#191A19', fontSize: 16 }}>Wellcome Back</Text>
                            <Text style={{ color: '#191A19', fontWeight: 'bold', fontSize: 18 }}>{this.state.username}</Text>
                        </View>
                    </View>

                    <View style={{ flexDirection: 'column', marginRight: 30, marginTop: 30 }}>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('Notifications')}>
                            <Icons name="notifications-outline" size={30} color="#191A19" />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={{ marginTop: 35, marginLeft: 15 }}>
                    <Text style={{ color: '#191A19', fontSize: 20, fontWeight: 'bold' }}>What lesson would you</Text>
                    <Text style={{ color: '#191A19', fontSize: 20, fontWeight: 'bold' }}>like to learn today ?</Text>

                    <View>
                        <View style={{ marginTop: 15, backgroundColor: '#191A19', borderRadius: 10, padding: 7, alignSelf: 'flex-start' }}>
                            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 17 }}>Class Begin in - {this.state.schedule}</Text>
                        </View>
                    </View>

                    <View style={{ flexDirection: 'column', marginTop: 25 }}>
                        <Text style={{ fontSize: 17, fontWeight: 'bold', color: '#191A19', alignSelf: 'center' }}>Your Navigation</Text>
                        <View style={{ flexDirection: "row", marginTop: 15, justifyContent: 'space-evenly', alignItems: 'center' }}>
                            <TouchableOpacity style={{ alignItems: 'center' }} onPress={() => this.props.navigation.navigate('Lecture')}>
                                <Icons name="library-outline" size={30} color="#191A19" />
                                <Text style={{ color: '#191A19' }}>Lecture</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={{ alignItems: 'center' }} onPress={() => this.props.navigation.navigate('Attendance')}>
                                <Icons name="hand-left-outline" size={30} color="#191A19" />
                                <Text style={{ color: '#191A19' }}>Attendance</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={{ alignItems: 'center' }}>
                                <Icons name="school-outline" size={30} color="#191A19" />
                                <Text style={{ color: '#191A19' }}>My Class</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={{ flexDirection: "row", marginTop: 35, justifyContent: 'space-evenly' }}>
                            <TouchableOpacity style={{ alignItems: 'center' }} onPress={() => this.props.navigation.navigate('Events')}>
                                <Icons name="golf-outline" size={30} color="#191A19" />
                                <Text style={{ color: '#191A19' }}>Events</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={{ alignItems: 'center', marginLeft: 18 }}>
                                <Icons name="file-tray-outline" size={30} color="#191A19" />
                                <Text style={{ color: '#191A19' }}>Inbox</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={{ alignItems: 'center', marginLeft: 10 }} onPress={() => this.props.navigation.navigate('Homework')}>
                                <Icons name="newspaper-outline" size={30} color="#191A19" />
                                <Text style={{ color: '#191A19' }}>Home Work</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        )
    }
}