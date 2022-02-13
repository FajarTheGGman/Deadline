import React, { Component } from 'react'
import { View, Text, Image, ScrollView, StatusBar, Linking, TouchableOpacity } from 'react-native'
import Icons from 'react-native-vector-icons/Ionicons'

export default class About extends Component{
    render(){
        return(
            <View style={{ flex: 1, flexDirection: 'column', backgroundColor: 'white' }}>
                <StatusBar animated={true} backgroundColor="white" barStyle="dark-content" />

                <View style={{ flexDirection: 'column', justifyContent: 'space-between' }}>
                    <View style={{ alignItems: 'center' }}>
                        <Image source={require('../../assets/icons/author.jpeg')} style={{ width: 120, height: 120, marginTop: 25, borderRadius: 100 }} />
                        <Text style={{ fontWeight: 'bold', fontSize: 20, marginTop: 10 }}>FajarTheGGman</Text>
                        <Text>Known as fajar firdaus</Text>
                    </View>
                    <View style={{ marginTop: 35, flexDirection: 'row', justifyContent: 'space-between' }}>
                        <TouchableOpacity style={{ flexDirection: 'column', padding: 10, backgroundColor: 'white', elevation: 15, borderRadius: 13, marginLeft: 20, alignItems: 'center' }} onPress={() => Linking.openURL('https://instagram.com/FajarTheGGman')}>
                            <Icons name='logo-instagram' size={40} />
                        </TouchableOpacity>

                        <TouchableOpacity style={{ flexDirection: 'column', padding: 10, backgroundColor: 'white', elevation: 15, borderRadius: 13, alignItems: 'center' }} onPress={() => Linking.openURL('https://github.com/FajarTheGGman')}>
                            <Icons name='logo-github' size={40} />
                        </TouchableOpacity>

                        <TouchableOpacity style={{ flexDirection: 'column', padding: 10, backgroundColor: 'white', elevation: 15, borderRadius: 13, marginRight: 20, aligmItems: 'center' }} onPress={() => Linking.openURL('https://twitter.com/kernel024')}>
                            <Icons name='logo-twitter' size={40} />
                        </TouchableOpacity>
                    </View>

                    <View style={{ flexDirection: 'column', alignItems: 'center', marginTop: 20 }}>
                        <Text style={{ color: 'grey', fontWeight: 'bold' }}>THE REASONS</Text>
                        <Text>So, the reasons i create this project is to help</Text>
                        <Text>The students to improve their productivity at schools</Text>
                        <Text>So i made this kinda application to help their activities</Text>
                    </View>

                    <View style={{ flexDirection: 'column', marginTop: 150, alignItems: 'center' }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Special Thanks!</Text>
                        <View style={{ flexDirection: 'row', marginTop: 10, justifyContent: 'space-between' }}>
                            <Icons name='logo-stackoverflow' size={30} color="grey" style={{ marginRight: 10 }} />
                            <Icons name='logo-github' size={30} color='grey' style={{ marginLeft: 10, marginRight: 10 }}/>
                            <Icons name='logo-npm' size={30} color='grey' style={{ marginLeft: 10, marginRight: 10 }}/>
                            <Icons name='logo-nodejs' size={30} color='grey' style={{ marginLeft: 10, marginRight: 10 }}/>
                            <Icons name='logo-react' size={30} color='grey' style={{ marginLeft: 10, marginRight: 10 }} />
                            <Icons name='logo-google' size={30} color='grey' style={{ marginLeft: 10 }} />
                        </View>
                    </View>
                </View>
            </View>
        )
    }
}
