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
            time: '10:10:09',
            date: null,
            region_lat: null,
            region_lon: null,
            total_distance: null,
            my_lat: 0,
            my_lon: 0,
            end_location: 'School',
            end_lat: 0,
            end_lon: 0
        }
    }

    componentDidMount(){
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

    render(){
        return(
            <ScrollView contentContainerStyle={{ flex: 1, flexDirection: 'column', backgroundColor: 'white' }}>
                <StatusBar backgroundColor="white" barStyle="dark-content" />

                <View style={{ alignItems: 'center', marginTop: 15 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 17, color: '#4E9F3D' }}>Started Lecture</Text>
                </View>
                <View style={{ marginTop: 15 }}>
                    <View style={{ backgroundColor: 'white', padding: 15, borderRadius: 15, elevation: 15, marginRight: 10, marginLeft: 10 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <View>
                                <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Computer Science</Text>
                            </View>

                            <View style={{ backgroundColor: '#4E9F3D', padding: 5, borderRadius: 100 }}>
                                <Text style={{ fontWeight: 'bold' }}>Type</Text>
                            </View>
                        </View>

                        <View style={{ flexDirection: 'column' }}>
                            <Text style={{ marginTop: 15, color: 'grey', marginLeft: 10 }}>The Teacher</Text>
                            <View style={{ flexDirection: 'row', marginTop: 10, alignItems: 'center' }}>
                                <Image source={require('../../assets/illustrations/lecture/teacher.png')} style={{ width: 50, height: 50, marginLeft: 5 }} />
                                <Text style={{ fontWeight: 'bold', marginLeft: 15, fontSize: 16, color: '#4E9F3D' }}>Richard Stallman</Text>
                            </View>
                            <View style={{ flexDirection: 'row', marginTop: 15, marginLeft: 10, justifyContent: 'space-between' }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Icons name='time-outline' size={20} color="#4E9F3D" />
                                    <Text style={{ marginLeft: 10, color: '#4E9F3D' }}>07:30 - 09:00</Text>
                                </View>

                                <View style={{ marginTop: -10, marginRight: 5 }}>
                                    <TouchableOpacity>
                                        <Icons name='hand-left-outline' size={30} color='#4E9F3D' />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
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
