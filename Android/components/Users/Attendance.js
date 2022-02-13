import React, { Component } from 'react';
import { View, StatusBar, Text, TouchableOpacity, AsyncStorage, ScrollView, Image } from 'react-native';
import axios from 'axios'
import Modal from 'react-native-modal'
import Icons from 'react-native-vector-icons/Ionicons'
import MapView, { Marker } from 'react-native-maps'
import * as geolib from 'geolib'
import * as Location from 'expo-location'
import konfigurasi from '../../config'

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
            far: false
        }
    }

    componentDidMount(){
        const dayOrigin = new Date().getDay();
        const dayName = (dayOrigin) => {
            const day = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            return day[dayOrigin];
        }

        const day = dayName(dayOrigin);

        AsyncStorage.removeItem('attendance');
        AsyncStorage.getItem('attendance').then(check => {
            if(check == 'true'){
                this.setState({ hand: 'hand-left' })
            }else{
                this.setState({ hand: 'hand-left-outline' })
            }
        })

        AsyncStorage.getItem('token').then(token => {
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
                }
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
            timeInterval: 1,
            distanceInterval: 1
        }, (location) => {
            this.setState({
                my_lat: location.coords.latitude,
                my_lon: location.coords.longitude
            })

            const total_distance = geolib.getDistance(
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
    }

    attendance(){
        AsyncStorage.getItem('token').then(token => {
            AsyncStorage.getItem('attendance').then(check => {
                if(check == 'true'){
                    this.setState({ hand: 'hand-left' })
                }else{
                    if(this.state.total_distance < 15){
                        AsyncStorage.getItem('expire').then(x => {
                            let getDate = new Date();
                            if(x == getDate){
                                alert('You have already attended today')
                            }else{
                                this.setState({ hand: 'hand-left-outline' })
                                axios.post(konfigurasi.server + 'attendance/add', {
                                    token: token,
                                    secret: konfigurasi.secret,
                                    lessons: this.state.next_lecture[0].lessons,
                                    major: this.state.major,
                                    class: this.state.class,
                                    time: this.state.time,
                                }).then(res => {
                                    if(res.data.success){
                                        alert('Attendance Success')
                                        AsyncStorage.setItem('attendance', 'true');
                                        AsyncStorage.setItem('expire', new Date());
                                    }
                                })
                            }
                        })
                    }else{
                        this.setState({ far: true })
                    }
                }
            })
        })
    }

    render(){
        return(
            <ScrollView contentContainerStyle={{ flex: 1, flexDirection: 'column', backgroundColor: 'white' }}>
                <StatusBar backgroundColor="white" barStyle="dark-content" />

                <Modal isVisible={this.state.far}>
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

                <View style={{ alignItems: 'center', marginTop: 15 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 17, color: '#4E9F3D' }}>Next Lecture</Text>
                </View>
                <View style={{ marginTop: 15 }}>
                    {this.state.next_lecture.length == 0 ? <View style={{ backgroundColor: 'white', padding: 15, borderRadius: 15, elevation: 15, marginRight: 10, marginLeft: 10, justifyContent: 'center', alignItems: 'center', marginBottom: 88 }}>
                            <Icons name="logo-dropbox" size={40} color="grey" />
                            <Text style={{ color: 'grey', fontWeight: 'bold' }}>There's no lecture</Text>
                            </View> : this.state.next_lecture.map((x,y) => {
                        return <View style={{ backgroundColor: 'white', padding: 15, borderRadius: 15, elevation: 15, marginRight: 10, marginLeft: 10 }}>
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
                            <View style={{ flexDirection: 'row', marginTop: 15, marginLeft: 10, justifyContent: 'space-between' }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Icons name='time-outline' size={20} color="#4E9F3D" />
                                    <Text style={{ marginLeft: 10, color: '#4E9F3D' }}>{x.date}</Text>
                                </View>

                                <View style={{ marginTop: -10, marginRight: 5 }}>
                                    <TouchableOpacity onPress={() => this.attendance()}>
                                        <Icons name={this.state.hand} size={30} color='#4E9F3D' />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                    })}
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
                            <Text>30 minutes</Text>
                        </View>

                        <View style={{ alignItems: 'center'}}>
                            <Icons name='walk-outline' size={25} />
                            <Text>1 Hour</Text>
                        </View>

                        <View style={{ alignItems: 'center'}}>
                            <Icons name='car-outline' size={25} />
                            <Text>25 Minutes</Text>
                        </View>
                    </View>
                </View>

                <View>
                    <MapView initialRegion={{ latitude: -6.578968462396026, longitude: 106.80924899876119, latitudeDelta: 0.0263, longitudeDelta: 0.0274  }} style={{ width: 420, height: 250  }}>
                        <Marker coordinate={{ latitude: this.state.my_lat, longitude: this.state.my_lon}} title="You" description="You are here !">
                            <Image source={require('../../assets/icons/student.png')} style={{ width: 50, height: 50 }} />
                        </Marker>
                        <Marker coordinate={{ latitude: this.state.end_lat, longitude: this.state.end_lon }} title={this.state.end_location} description="This is Your School">
                            <Image source={require('../../assets/icons/school.png')} style={{ width: 50, height: 50 }} />
                        </Marker>
                    </MapView>
                </View>

            </ScrollView>
        )
    }
}
