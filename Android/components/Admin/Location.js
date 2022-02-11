import React, { Component } from 'react';
import { View, Text, TextInput, AsyncStorage, TouchableOpacity, Image, StatusBar, ScrollView } from 'react-native'
import axios from 'axios'
import konfigurasi from '../../config'
import Icons from 'react-native-vector-icons/Ionicons'
import MapView, { Marker } from 'react-native-maps'

export default class Location extends Component{
    constructor(props){
        super(props)

        this.state = {
            id: '',
            latitude: -6.914744,
            longitude: 107.609810,
            newLatitude: -6.914744,
            newLongitude: 107.609810,
            nameLocation: '',
        }
    }

    componentDidMount(){
        AsyncStorage.getItem('token').then(token => {
            axios.post(konfigurasi.server + 'location/get', {
                token: token,
                secret: konfigurasi.secret
            }).then(res => {
                if(res.data.location){
                    this.setState({
                        id: res.data.location[0]._id,
                        latitude: res.data.location[0].latitude,
                        longitude: res.data.location[0].longitude,
                        nameLocation: res.data.location[0].location,
                    })
                }
            })
        })
    }

    update(){
        AsyncStorage.getItem('token').then(token => {
            axios.post(konfigurasi.server + 'location/update', {
                token: token,
                secret: konfigurasi.secret,
                id: this.state.id,
                latitude: this.state.newLatitude,
                longitude: this.state.newLongitude,
                location: this.state.nameLocation
            }).then(res => {
                if(res.data.location){
                    alert('Location Updated')
                }
            })
        })
    }

    render(){
        return(
            <View style={{flex:1}}>
                <MapView
                    style={{flex:1, flexDirection:'column'}}
                    initialRegion={{
                        latitude: -6.914744,
                        longitude: 107.609810,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}

                    onPress={(val) => this.setState({
                        newLatitude: val.nativeEvent.coordinate.latitude,
                        newLongitude: val.nativeEvent.coordinate.longitude,
                    })}

                >
                    <Marker
                        coordinate={{
                            latitude: this.state.latitude,
                            longitude: this.state.longitude,
                        }}
                        title="School"
                        description="Current Location"
                    />
                    <Marker
                        coordinate={{
                            latitude: this.state.newLatitude,
                            longitude: this.state.newLongitude,
                        }}
                        title="New School"
                        description="This is my school"
                    />
                </MapView>
                <View style={{ flexDirection: 'column', backgroundColor: 'white', borderTopLeftRadius: 10, borderTopRightRadius: 10, padding: 5, elevation: 15 }}>
                    <View style={{ alignItems: 'center' }}>
                        <Text style={{ fontSize: 17, fontWeight: 'bold' }}>Your Current Location</Text>

                        <Text style={{ marginTop: 15, fontWeight: 'bold' }}>{this.state.nameLocation}</Text>
                        <Text>{this.state.newLatitude}, {this.state.newLongitude}</Text>
                        <TextInput placeholder="Change Name ?" onChangeText={(val) => this.setState({ nameLocation: val })} />

                        <TouchableOpacity style={{ marginTop: 15, borderRadius: 10, backgroundColor: '#4E9F3D', padding: 5, elevation: 15, marginBottom: 10 }} onPress={() => this.update()}>
                            <Text style={{ fontWeight: 'bold' }}>Update Location</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }
}
