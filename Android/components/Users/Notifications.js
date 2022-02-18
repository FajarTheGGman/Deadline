import React, { Component } from 'react'
import { View, StatusBar, Text, TouchableOpacity, Image, AsyncStorage, ScrollView } from 'react-native'
import axios from 'axios'
import Icons from 'react-native-vector-icons/Ionicons'
import konfigurasi from '../../config'

export default class Notification extends Component{
    constructor(props){
        super(props)

        this.state = {
            notif: []
        }
    }
    
    componentDidMount(){
        AsyncStorage.getItem('token').then(token => {
            axios.post(konfigurasi.server + 'notification/getall', {
                token: token,
                secret: konfigurasi.secret
            }).then(res => {
                this.setState({ notif: this.state.notif.concat(res.data.notif) })
            })
        })
    }

    render(){
        return(
            <View style={{ flex: 1, flexDirection: 'column', backgroundColor: 'white' }}>
                <StatusBar backgroundColor="white" barStyle="dark-content" />

                <View style={{ marginLeft: 17, marginTop: 15 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 20 }}>What's New ?</Text>
                    {this.state.notif.length == 0 ? <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginTop: 170 }}>
                        <Icons name='logo-dropbox' size={80} color="grey" />
                        <Text style={{ color: 'grey', fontWeight: 'bold' }}>Looks like the notifications is empty</Text>

                    </View>:this.state.notif.map((x,y) => {
                        return <View style={{ marginTop: 25 }}>
                        <TouchableOpacity style={{ flexDirection: 'row' }}>
                            <View>
                                <Icons name={x.type == undefined ? "notifications" : x.type} size={30} color="white" style={{ backgroundColor: 'black', padding: 10, borderRadius: 10 }} />
                            </View>
                            <View style={{ flexDirection: 'row', marginLeft: 10, alignItems: 'center', justifyContent: 'space-between' }}>
                                <View style={{ flexDirection: 'column' }}>
                                    <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{x.title.length > 16 ? x.title.slice(0,24) + '...' : x.title}</Text>
                                    <Text style={{ color: 'grey' }}>{x.message.length > 20 ? x.message.slice(0,25) + '...' : x.message}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>

                    })}
                </View>
            </View>
        )
    }
}
