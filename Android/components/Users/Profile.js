import React, { Component } from 'react';
import { View, Text, Image, FlatList, AsyncStorage, TouchableOpacity, ScrollView, StatusBar, ImageBackground } from 'react-native';

export default class Profile extends Component{
    constructor(props){
        super(props);
        this.state = {
            status_offline: [
                {
                    pallete: '#1E5128',
                    status: 'Offline'
                },
                {
                    pallete: '#191A19',
                    status: 'Online'
                }
            ]
        }
    }

    renderStatus = ({ item }) => {
        return(
            <TouchableOpacity style={{ flexDirection: 'row', marginTop: 10, padding: 10 }}>
                <View style={{ flexDirection: 'column', alignItems: 'flex-start', marginLeft: 10, backgroundColor: item.pallete, elevation: 25, padding: 10, borderRadius: 50 }}>
                    <Text style={{ fontSize: 16, color: 'white' }}>{item.status}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    render(){
        return(
            <View style={{ flex: 1, flexDirection: 'column', backgroundColor: 'white' }}>
                <StatusBar backgroundColor="white" barStyle="dark-content" />

                <View style={{ flexDirection: 'column', alignItems: 'center', marginTop: 15 }}>
                    <Image source={{ uri: 'https://66.media.tumblr.com/103172bc54793536858f3c75b6bc9a63/tumblr_nbflsfo9kM1sgccggo1_1280.jpg' }} style={{ width: 120, height: 120, borderRadius: 100, borderWidth: 2, borderColor: 'black' }} />
                    <Text style={{ fontWeight: 'bold', fontSize: 22 }}>Victoria Justice</Text>
                    <Text style={{ fontSize: 16, color: 'grey' }}>@Victoria</Text>
               </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 25 }}>
                    <View style={{ flexDirection: 'column', alignItems: 'center', backgroundColor: 'white', elevation: 10, padding: 5, paddingLeft: 10, paddingRight: 10, borderRadius: 10 }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 17 }}>Grade</Text>
                        <Text>11</Text>
                    </View>

                    <View style={{ flexDirection: 'column', alignItems: 'center', backgroundColor: 'white', elevation: 10, padding: 5, paddingLeft: 10, paddingRight: 10, borderRadius: 10 }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 17 }}>Since</Text>
                        <Text>05/02/2022</Text>
                    </View>

                    <View style={{ flexDirection: 'column', alignItems: 'center', backgroundColor: 'white', elevation: 10, padding: 5, paddingLeft: 10, paddingRight: 10, borderRadius: 10 }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 17 }}>Major</Text>
                        <Text>RPL</Text>
                    </View>
                </View>

                <View style={{ marginTop: 25, marginLeft: 10 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 17 }}>Last Lecture</Text>
                    <ScrollView horizontal={true} contentContainerStyle={{ marginTop: 15 }}>
                        <TouchableOpacity>
                            <ImageBackground source={require('../../assets/illustrations/lecture/math.png')} style={{ flexDirection: 'column', width: 100, height: 120, borderRadius: 10, padding: 5, borderColor: 'black', borderWidth: 2 }}>
                                <Text style={{ fontWeight: 'bold', fontSize: 17, color: 'black' }}>Math</Text>
                            </ImageBackground>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </View>
        )
    }
}
