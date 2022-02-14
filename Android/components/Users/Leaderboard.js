import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, AsyncStorage, StatusBar } from 'react-native'
import axios from 'axios'
import Icons from 'react-native-vector-icons/Ionicons'
import konfigurasi from '../../config'

export default class Leaderboard extends Component {
    constructor(props){
        super(props)
        
        this.state = {
            data: []
        }
    }
    
    componentDidMount(){
        AsyncStorage.getItem('token').then(token => {
            axios.post(konfigurasi.server + 'attendance/getall', {
                token: token,
                secret: konfigurasi.secret
            }).then(res => {
                console.log(res.data)
                this.setState({ data: this.state.data.concat(res.data.data) })
            })
        })
    }

    render(){
        return(
            <ScrollView style={{ flexGrow: 1, flexDirection: 'column', backgroundColor: 'white' }}>
                <StatusBar backgroundColor="white" barStyle={"dark-content"} />
                <View style={{ flexDirection: 'column', alignItems: 'center', marginTop: 25 }}>
                    <Image source={require('../../assets/illustrations/leaderboard/banner.png')} style={{ width: 260, height: 140 }} />
                    <Text style={{ marginTop: 15, fontWeight: 'bold', fontSize: 17 }}>Leaderboard of Attendance</Text>
                </View>

                <View style={{ marginTop: 25, paddingBottom: 25, marginLeft: 20, marginRight: 20 }}>
                    {this.state.data.length == 0 ? <View style={{ marginTop: 65, alignItems: 'center', flexDirection: 'column', justifyContent: 'center' }}>
                        <Icons name='logo-dropbox' size={80} color="grey" />
                        <Text style={{ fontWeight: 'bold', color: 'grey' }}>Leaderboards not available yet!</Text>
                    </View>: this.state.data.map((x,y) => {
                        return <View style={{ backgroundColor: 'white', marginTop: 25, padding: 10, borderRadius: 20, elevation: 15, flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Image source={{ uri: 'https://66.media.tumblr.com/84044fea94e02406aedf531c3f787fc5/tumblr_mr4hj0tzgS1qbpxtio1_540.png' }} style={{ width: 50, height: 50, borderRadius: 100 }} />
                            <View style={{ flexDirection: 'column', marginLeft: 10 }}>
                                <Text style={{ fontWeight: 'bold', fontSize: 15 }}>{x.name}</Text>
                                <Text style={{ fontSize: 12 }}>@{x.username}</Text>
                            </View>
                        </View>

                        <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginRight: 10 }}>
                            <Text>{x.time}</Text>
                        </View>
                    </View>

                    })}
                </View>
            </ScrollView>
        )
    }
}
