import React, { Component } from 'react';
import { View, Text, Image, StatusBar, AsyncStorage, ScrollView, TouchableOpacity } from 'react-native';
import Icons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import konfigurasi from '../../config';

export default class Events extends Component {
  constructor(props) {
    super(props);

      this.state = {
        events: [],
        user: {},
        token: '',
        isLoading: true,
      };
  }

    componentDidMount() {
        AsyncStorage.getItem('token').then(token => {
            axios.post(konfigurasi.server + 'events/getall', {
                token: token,
                secret: konfigurasi.secret
            }).then(res => {
                console.log(res.data)
                if(!res.data.error){
                    this.setState({ events: this.state.events.concat(res.data.events) });
                }
            })
        })
    }

    render(){
        return(
            <ScrollView contentContainerStyle={{ flex: 1, flexDirection: 'column', backgroundColor: 'white' }}>
                <StatusBar
                    backgroundColor="white"
                    barStyle="dark-content"
                />

                <View style={{ marginTop: 25, alignItems: 'center' }}>
                    <Image source={require('../../assets/illustrations/events/banner.png')} style={{ width: 150, height: 150 }} />
                    <Text style={{ marginTop: 15, fontWeight: 'bold', fontSize: 20 }}>This is Your Events</Text>
                </View>

                <View style={{ flexDirection: 'column', marginTop: 15 }}>
                    <View style={{ marginLeft: 20, marginRight: 20 }}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 20, color: '#4E9F3D', }}>
                            This month's events
                        </Text>
                        {this.state.events.length == 0 ?  <View style={{ marginTop: 65, alignItems: 'center', flexDirection: 'column', justifyContent: 'center' }}>
                        <Icons name='logo-dropbox' size={80} color="grey" />
                        <Text style={{ fontWeight: 'bold', color: 'grey' }}>Leaderboards not available yet!</Text>
                    </View> : this.state.events.map((x,y) => {
                            return <TouchableOpacity style={{ flexDirection: "column", marginTop: 25 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={{ fontWeight: 'bold' }}>{x.events}</Text>
                            </View>

                            <View>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Icons name='calendar-outline' size={20} color="#4E9F3D" />
                                    <Text style={{ color: '#4E9F3d', marginLeft: 10, marginTop: 5, marginBottom: 5 }}>{x.date}</Text>
                                </View>
                                <Text>{x.desc}</Text>
                            </View>
                        </TouchableOpacity>

                        })}
                    </View>
                </View>
            </ScrollView>
        )
    }

}

