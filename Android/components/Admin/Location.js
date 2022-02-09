import React, { Component } from 'react';
import { View, Text, TextInput, AsyncStorage, TouchableOpacity, Image, StatusBar, ScrollView } from 'react-native'
import axios from 'axios'
import konfigurasi from '../../config'
import Icons from 'react-native-vector-icons/Ionicons'
import MapView, { Marker } from 'react-native-maps'

export default class Location extends Component{
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
                >
                    <Marker
                        coordinate={{
                            latitude: -6.914744,
                            longitude: 107.609810,
                        }}
                        title="Lokasi"
                        description="Lokasi"
                    />
                </MapView>
            </View>
        )
    }
}
