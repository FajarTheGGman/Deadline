import React, { Component } from 'react';
import { View, StatusBar, Text, TextInput, TouchableOpacity, AsyncStorage, ScrollView, Image, Modal } from 'react-native';
import axios from 'axios'
import Icons from 'react-native-vector-icons/Ionicons'
import MapView, { Marker } from 'react-native-maps'
import * as geolib from 'geolib'
import * as Location from 'expo-location'
import konfigurasi from '../../config'
import html_script from './map'
import { WebView } from 'react-native-webview';

export default class Attendance extends Component {
    constructor(props){
        super(props)

        this.state = {
            lessons: [],
            next_lecture: [],
            time: '',
            date: null,
            region_lat: null,
            region_lon: null,
            total_distance: null,
            my_lat: 0,
            my_lon: 0,
            end_location: 'School',
            end_lat: 0,
            end_lon: 0,
            major: '',
            class: '',
            hand: 'hand-left-outline',
            far: false,
            sick: false,
            error: false,
            fake_gps: false
        }
    }

    componentDidMount(){
        const unsubscribe = this.props.navigation.addListener('focus', () => {
            const dayOrigin = new Date().getDay();
            const dayName = (dayOrigin) => {
                const day = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                return day[dayOrigin];
            }

            const day = dayName(dayOrigin);
    
            AsyncStorage.getItem('token').then(async token => {
                axios.post(konfigurasi.server + "location/get", {
                    token: token,
                    secret: konfigurasi.secret
                }).then(res => {
                    if(res.data.location){
                        this.setState({
                            end_location: res.data.location[0].location,
                            end_lat: res.data.location[0].latitude,
                            end_lon: res.data.location[0].longitude
                        })
    
    
                            this.refs["Map_Ref"].postMessage(JSON.stringify({
                                end_lat: this.state.end_lat,
                                end_lon: this.state.end_lon
                            }))
    
                    }
                }).catch(err => {
                    this.setState({ error: true })
                })
    
                axios.post(konfigurasi.server + "auth/profile", {
                    token: token,
                    secret: konfigurasi.secret
                }).then(res => {
                    if(res.status == 200){
                        this.setState({
                            major: res.data.major,
                            class: res.data.class,
                        })
                    }
                })
    
                axios.post(konfigurasi.server + 'lessons/getall', {
                    token: token,
                    secret: konfigurasi.secret,
                    day: day.toLowerCase()
                }).then(res => {
                    if(res.data.lessons){
                        this.setState({
                            lessons: this.state.lessons.concat(res.data.lessons)
                        })
    
                        let get_time = new Date().getHours() + ':' + new Date().getMinutes();
                        this.setState({ time: get_time })
                        this.state.lessons.map(item => {
                            if(item.date > get_time){
                                this.setState({ next_lecture: this.state.next_lecture.concat(item) })
                            }
                        })
                    }
                })
            })
    
                const { status } = Location.requestForegroundPermissionsAsync();
    
            Location.watchPositionAsync({
                enableHighAccuracy: true,
                timeInterval: 1000,
                distanceInterval: 1
            }, (location) => {
                this.setState({
                    my_lat: location.coords.latitude,
                    my_lon: location.coords.longitude,
                    fake_gps: location.mocked
                })
    
                try{
                    this.refs["Map_Ref"].postMessage(JSON.stringify({
                        my_lat: location.coords.latitude,
                        my_lon: location.coords.longitude,
                        end_lat: this.state.end_lat,
                        end_lon: this.state.end_lon
                    }))
                }catch(err){
                    console.log(err)
                }
    
                let total_distance = geolib.getDistance(
                    {latitude: this.state.my_lat, longitude: this.state.my_lon},
                    {latitude: this.state.end_lat, longitude: this.state.end_lon}
                )
    
                this.setState({
                    total_distance: total_distance
                })
            })
    
            const date = new Date().toDateString()
            this.setState({ date: date })
    
            axios.get('http://ip-api.com/json').then(res => {
                if(res.status == 200){
                    this.setState({ 
                        region_lat: res.data.lat,
                        region_lon: res.data.lon
                    })
                }
            })
        })
        return unsubscribe;
    }

    attendance(){
        AsyncStorage.getItem('token').then(token => {
            if(this.state.total_distance == null){
                this.setState({ far: true })
            }else if(this.state.total_distance < 15){
                    this.setState({ hand: 'hand-left-outline' })
                    axios.post(konfigurasi.server + 'attendance/add', {
                        token: token,
                        secret: konfigurasi.secret,
                        lessons: this.state.next_lecture[0].lessons,
                        teacher: this.state.next_lecture[0].teacher,
                        major: this.state.major,
                        class: this.state.class,
                        time: this.state.time,
                        date: new Date().getDay() + '/' + new Date().getMonth() + '/' + new Date().getFullYear()
                    }).then(res => {
                        if(res.data.success){
                            alert('Attendance Success')
                        }else if(res.data.already){
                            alert('You already get attendance in this lecture')
                        }
                    })
            }else{
                this.setState({ far: true })
            }
        })
    }
    
    sick(){

    }


    render(){
        return(
            <ScrollView contentContainerStyle={{ flex: 1, flexDirection: 'column', backgroundColor: 'white' }}>
                <StatusBar backgroundColor={"#4E9F3D"} barStyle="dark-content" />

                <Modal visible={this.state.error} transparent={true} animationType="slide">
                    <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <View style={{ backgroundColor: 'white', padding: 15, borderRadius: 10, alignItems: 'center' }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 17 }}>School not found !</Text>
                            <Image source={require('../../assets/illustrations/bug.png')} style={{ width: 200, height: 150, marginTop: 10, marginBottom: 10 }} />
                            <Text style={{ fontSize: 15, marginTop: 10 }}>School location not uploaded yet!</Text>
                            <Text style={{ fontSize: 15 }}>Please call your admin</Text>

                            <TouchableOpacity onPress={() => this.props.navigation.navigate('Home')}>
                                <Text style={{ fontSize: 15, marginTop: 10, color: '#00a8ff' }}>Back</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

                <Modal visible={this.state.far} transparent={true} animationType="slide">
                    <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <View style={{ backgroundColor: 'white', padding: 15, borderRadius: 10, alignItems: 'center' }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 17 }}>Try to be Closer !</Text>
                            <Image source={require('../../assets/illustrations/location.png')} style={{ width: 150, height: 150, marginTop: 10, marginBottom: 10 }} />
                            <Text style={{ fontSize: 15, marginTop: 10 }}>You are too far away from school</Text>
                            <Text style={{ fontSize: 15 }}>Try to be closer 15 meters</Text>

                            <TouchableOpacity onPress={() => this.setState({ far: false })}>
                                <Text style={{ fontSize: 15, marginTop: 10, color: '#00a8ff' }}>Okay</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

                <Modal visible={this.state.fake_gps} transparent={true} animationType="slide">
                    <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <View style={{ backgroundColor: 'white', padding: 15, borderRadius: 10, alignItems: 'center' }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 17 }}>Not today buddy !</Text>
                            <Image source={require('../../assets/illustrations/fake_gps.png')} style={{ width: 170, height: 150, marginTop: 15, marginBottom: 10 }} />
                            <Text style={{ fontSize: 15, marginTop: 10 }}>It's looks like you're using</Text>
                            <Text style={{ fontSize: 15 }}>Fake gps, plz disable it</Text>
                            <Text style={{ fontSize: 15 }}>If you want to get attendance</Text>

                            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                                <Text style={{ fontSize: 15, marginTop: 10, color: '#00a8ff' }}>Okay</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

                <Modal visible={this.state.sick} transparent={true} animationType="slide">
                    <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <View style={{ backgroundColor: 'white', padding: 25, borderRadius: 10, alignItems: 'center' }}>
                            <View style={{ flexDirection: 'row', alignSelf: 'flex-end', justifyContent: 'flex-end' }}>
                                    <TouchableOpacity onPress={() => this.setState({ sick: false })}>
                                        <Icons name="close" size={30} color="#4E9F3D" />
                                    </TouchableOpacity>
                            </View>
                            <Text style={{ fontWeight: 'bold', fontSize: 17, marginTop: 3 }}>Are you sick today ?</Text>
                            <Image source={require('../../assets/illustrations/sick.png')} style={{ width: 150, height: 150, marginTop: 10, marginBottom: 10 }} />
                            <Text style={{ fontSize: 15, marginTop: 10 }}>Drop your absent down below</Text>
                            <TextInput placeholder="Description" style={{ marginTop: 15, backgroundColor: 'white', elevation: 10, borderRadius: 10, width: 170, padding: 5 }} multiline={true} />

                            <TouchableOpacity onPress={() => this.sick()} style={{ backgroundColor: '#4E9F3D', marginTop: 15, padding: 5, borderRadius: 7, width: 90, elevation: 10 }}>
                                <Text style={{ fontSize: 15, fontWeight: 'bold', color: 'white', textAlign: 'center' }}>Send</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

                <View style={{ alignItems: 'center', marginTop: 15 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 17, color: '#4E9F3D' }}>Next Lecture</Text>
                </View>
                <View style={{ marginTop: 15 }}>
                    {this.state.next_lecture.length == 0 ? <View style={{ backgroundColor: 'white', padding: 15, borderRadius: 15, elevation: 15, marginRight: 10, marginLeft: 10, justifyContent: 'center', alignItems: 'center', marginBottom: 88 }}>
                            <Icons name="logo-dropbox" size={40} color="grey" />
                            <Text style={{ color: 'grey', fontWeight: 'bold' }}>There's no lecture</Text>
                            </View> : <View style={{ backgroundColor: 'white', padding: 15, borderRadius: 15, elevation: 15, marginRight: 10, marginLeft: 10 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <View>
                                <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{this.state.next_lecture[0].lessons}</Text>
                            </View>

                            <View style={{ backgroundColor: '#4E9F3D', padding: 5, borderRadius: 100 }}>
                                <Text style={{ fontWeight: 'bold' }}>Grade - {this.state.next_lecture[0].class}</Text>
                            </View>
                        </View>

                        <View style={{ flexDirection: 'column' }}>
                            <Text style={{ marginTop: 15, color: 'grey', marginLeft: 10 }}>The Teacher</Text>
                            <View style={{ flexDirection: 'row', marginTop: 10, alignItems: 'center' }}>
                                <Image source={require('../../assets/illustrations/lecture/teacher.png')} style={{ width: 50, height: 50, marginLeft: 5 }} />
                                <Text style={{ fontWeight: 'bold', marginLeft: 15, fontSize: 16, color: '#4E9F3D' }}>{this.state.next_lecture[0].teacher}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', marginTop: 15, marginLeft: 10, justifyContent: 'space-between' }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Icons name='time-outline' size={20} color="#4E9F3D" />
                                    <Text style={{ marginLeft: 5, fontWeight: 'bold', color: '#4E9F3D' }}>{this.state.next_lecture[0].date}</Text>
                                </View>

                                <View style={{ marginTop: -10, marginRight: 5, flexDirection: 'row' }}>
                                    <TouchableOpacity style={{ backgroundColor: 'white', elevation: 15, padding: 5, borderRadius: 10, marginRight: 10 }} onPress={() => this.setState({ sick: true })}>
                                        <Icons name={this.state.hand} size={30} color='orange' />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{ backgroundColor: 'white', elevation: 15, padding: 5, borderRadius: 10 }} onPress={() => this.attendance()}>
                                        <Icons name={this.state.hand} size={30} color='#4E9F3D' />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                    }
                </View>

                <View style={{ alignItems: 'center' }}>
                    <Text>Just in case, if gps doesn't accurate</Text>
                    <Text>You can use QR Code attendance in menu :)</Text>
                </View>

                <View style={{ backgroundColor: 'white', elevation: 15, padding: 10, borderTopLeftRadius: 15, borderTopRightRadius: 15, marginTop: 25 }}>
                    <View style={{ alignItems: 'center' }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 17 }}>Estimation Time</Text>
                    </View>

                    <View style={{ flexDirection: 'row', alignSelf: 'center', alignItems: 'center', marginTop: 5, marginBottom: 5 }}>
                        <Text style={{ fontWeight: 'bold', color: '#4E9F3D', fontSize: 17 }}>{this.state.total_distance}m</Text>
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 10 }}>
                        <View style={{ alignItems: 'center'}}>
                            <Icons name='bicycle-outline' size={25} />
                        </View>

                        <View style={{ alignItems: 'center'}}>
                            <Icons name='walk-outline' size={25} />
                        </View>

                        <View style={{ alignItems: 'center'}}>
                            <Icons name='car-outline' size={25} />
                        </View>
                    </View>
                </View>

                <WebView ref={'Map_Ref'} source={{ html: html_script }} style={{ width: 420, height: 250  }} key={1} javascriptEnabledAndroid={true} />

            </ScrollView>
        )
    }
}
