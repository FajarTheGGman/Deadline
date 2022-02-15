import React, { Component } from 'react'
import { View, AsyncStorage, RefreshControl, Text, Image, TouchableOpacity, ScrollView, StatusBar, TextInput, Picker } from 'react-native'
import Modal from 'react-native-modal'
import Icons from 'react-native-vector-icons/Ionicons'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Notifications } from 'expo'
import { StackActions } from '@react-navigation/native'
import base64 from 'react-native-base64'
import axios from 'axios'
import konfigurasi from '../../config'
import QRCode from 'react-native-qrcode-svg'
import ViewShot from 'react-native-view-shot'
import * as MediaLibrary from 'expo-media-library'
import * as Permissions from 'expo-permissions'

// expo packages
import * as Location from 'expo-location'

export default class Tab extends Component{
    render(){
        let Tabs = createBottomTabNavigator()
        return(
            <Tabs.Navigator screenOptions={({ route }) => ({
               tabBarStyle: {
                    backgroundColor: '#191A19',
                    color: 'black',
                    elevation: 0,
                    width: 300,
                    marginLeft: 25,
                    marginRight: 25,
                    borderRadius: 20,
                    marginBottom: 25,
                    position: 'absolute'
                },

            })}>
                <Tabs.Screen name="Index" component={Index} options={{ headerShown: false, tabBarIcon: ({ color, size }) => (
                    <Icons name='home-outline' size={25} color={"white"} />
                ), tabBarLabel: () => { return null } }} />
                <Tabs.Screen name="Barcode" component={Barcode} options={{ headerShown: false, tabBarIcon: ({ color, size }) => (
                    <Icons name='qr-code-outline' size={25} color={"white"} />
                ), tabBarLabel: () => { return null } }} />
                <Tabs.Screen name="Settings" component={Settings} options={{ headerShown: false, tabBarIcon: ({ color, size }) => (
                    <Icons name='cog-outline' size={25} color={"white"} />
                ), tabBarLabel: () => { return null } }} />
            </Tabs.Navigator>
        )
    }
}

class Barcode extends Component{
    constructor(props){
        super(props)

        this.state = {
            raw: 'There is no data yet!',
            class: '',
            callback: '',
            classList: [],
        }
    }

    async componentDidMount(){
        const check = await Permissions.getAsync(Permissions.MEDIA_LIBRARY)
        if(check.status !== 'granted'){
            const newPermisson = await Permissions.askAsync(Permissions.MEDIA_LIBRARY)
            if(newPermisson.status !== 'granted'){
                alert('You need to give permission to access your media library')
            }
        }

        AsyncStorage.getItem('token').then(token => {
            axios.post(konfigurasi.server + 'class/getall', {
                token: token,
                secret: konfigurasi.secret
            }).then(res => {
                if(res.status === 200){
                    this.setState({
                        classList: this.state.classList.concat(res.data.class),
                        class: res.data.class[0].class
                    })
                }
            }).catch(err => {
                console.log(err)
            })
        })
    }

    create(){
        AsyncStorage.getItem('token').then(token => {
            this.refs.viewShot.capture().then(uri => {
                MediaLibrary.saveToLibraryAsync(uri).then(() => {
                    alert('QR Saved to your gallery')
                })
            })
            const data = {
                class: this.state.class,
                callback: this.state.callback,
                message: 'Be careful, this is a users data'
            }
            const encryption = base64.encode(JSON.stringify(data))
            console.log('before : ' + encryption)
            const decryption = base64.decode(encryption)
            console.log('after : ' + decryption)
            this.setState({ raw: encryption.length === 0 ? 'There is no data yet!' : encryption })
        })
    }

    render(){
        return(
            <View style={{ flex: 1, flexDirection: 'column', backgroundColor: 'white' }}>
                <StatusBar barStyle={"dark-content"} backgroundColor={"white"} />
                <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'black' }}>Create QR Code</Text>
                    <ViewShot ref="viewShot" options={{ format: "jpg", quality: 0.9 }}>
                        <View style={{ backgroundColor: 'white', padding: 15, marginTop: 15, borderRadius: 10, elevation: 15 }}>
                            <QRCode
                                value={this.state.raw}
                                size={200}
                                logo={require('../../assets/icon.png')}
                                logoSize={52}
                                bgColor='black'
                                fgColor='white' />
                        </View>
                    </ViewShot>
                    <TextInput placeholder="Message ?" style={{ backgroundColor: 'white', padding: 10, borderRadius: 10, elevation: 15, marginTop: 20, width: 200 }} onChangeText={(val) => this.setState({ callback: val })} />
                    <View style={{ marginTop: 20, backgroundColor: 'white', borderRadius: 10, padding: 5, width: 220, elevation: 15 }}>
                        <Picker selectedItem={this.state.class} onValueChange={(val) => this.setState({ class: val })}>
                            {this.state.classList.map((val, index) => {
                                return(
                                    <Picker.Item label={'Class - '+val.class} value={val.class} key={index} />
                                )
                            })}
                        </Picker>
                    </View>
                    <TouchableOpacity style={{ backgroundColor: '#4E9F3D', padding: 10, borderRadius: 10, elevation: 15, marginTop: 20, width: 200, alignItems: 'center' }} onPress={() => this.create()}>
                        <Text style={{ color: 'white', fontWeight: 'bold' }}>Create QR Code</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

class Settings extends Component{
    constructor(props){
        super(props)
        this.state = {
        }
    }

    logout(){
        AsyncStorage.removeItem('token')
        this.props.navigation.dispatch(
            StackActions.replace("Banner")
        )
    }

    // make a method to send file data to server with axios
    async sendFile(uri){
        const token = await AsyncStorage.getItem('token')
        const formData = new FormData()
        formData.append('file', {
            uri: uri,
            name: 'file.jpg',
            type: 'image/jpg'
        })
        formData.append('token', token)
        formData.append('secret', konfigurasi.secret)
        axios.post(konfigurasi.server + 'user/upload', formData).then(res => {
            if(res.status === 200){
                alert('Success')
            }
        }).catch(err => {
            console.log(err)
        })
    }



    render(){
        return(
            <View style={{ flex: 1, flexDirection: 'column', backgroundColor: 'white' }}>
                <StatusBar barStyle={"dark-content"} backgroundColor={"white"} />
                <Text style={{ color: '#191A19', fontWeight: 'bold', fontSize: 17, alignSelf: 'center', marginTop: 15 }}>Settings <Icons name='hammer-outline' size={20} color="#191A19" /></Text>
                
                <View style={{ flexDirection: 'column', marginLeft: 20, marginRight: 20, justifyContent: 'space-between' }}>
                    <View style={{ flexDirection: 'column' }}>
                        <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10  }}  onPress={() => this.props.navigation.navigate('Username')}>
                            <View style={{ flexDirection: 'row', marginTop: 10  }}>
                                <Icons name="text-outline" size={25} color='black' />
                                <Text style={{ fontWeight: 'bold', marginLeft: 10, marginTop: 3  }}>Change The Username</Text>
                            </View>
                                    
                            <View style={{ marginTop: 10  }}>
                                <Icons name="chevron-forward-outline" size={25} color='black' />
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10  }} onPress={() => this.props.navigation.navigate('Passwords')}>
                            <View style={{ flexDirection: 'row', marginTop: 10  }}>
                                <Icons name="key-outline" size={25} color='black' />
                                <Text style={{ fontWeight: 'bold', marginLeft: 10, marginTop: 3  }}>Change The Password</Text>
                            </View>
                                    
                            <View style={{ marginTop: 10  }}>
                                <Icons name="chevron-forward-outline" size={25} color='black' />
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10  }} onPress={() => this.props.navigation.navigate('About')}>
                            <View style={{ flexDirection: 'row', marginTop: 10  }}>
                                <Icons name="logo-octocat" size={25} color='black' />
                                <Text style={{ fontWeight: 'bold', marginLeft: 10, marginTop: 3  }}>About Developer</Text>
                            </View>
                                    
                            <View style={{ marginTop: 10  }}>
                                <Icons name="chevron-forward-outline" size={25} color='black' />
                            </View>
                        </TouchableOpacity>
                    </View>

                    <View style={{ flexDirection: 'column' }}>
                        <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10  }} onPress={() => this.logout()}>
                            <View style={{ flexDirection: 'row', marginTop: 10  }}>
                                <Icons name="log-out-outline" size={25} color='red' />
                                <Text style={{ fontWeight: 'bold', marginLeft: 10, color: 'red', marginTop: 3  }}>Get Out</Text>
                            </View>
                                    
                            <View style={{ marginTop: 10  }}>
                                <Icons name="chevron-forward-outline" size={25} color='red' />
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }
}

class Index extends Component{
    constructor(props){
        super(props)
        this.state = {
            username: '',
            schedule: '',
            lessons: [],
            next_lecture: [],
            time: '',
            picture: '',
            gender: '',
            refresh: false
        }
    }

    componentDidMount(){
        const dayOrigin = new Date().getDay();
        const dayName = (dayOrigin) => {
            const day = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            return day[dayOrigin];
        }

        const day = dayName(dayOrigin);


        AsyncStorage.getItem("token").then((token) => {
            axios.post(konfigurasi.server + 'auth/profile', {
                token: token,
                secret: konfigurasi.secret
            }).then((res) => {
                this.setState({
                    username: res.data.name,
                    picture: res.data.picture,
                    level: res.data.level,
                    gender: res.data.gender
                })
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
                            this.setState({ time: item.date })
                            console.log(this.state.time)
                            this.setState({ next_lecture: this.state.next_lecture.concat(item) })

                        // count time from now to 14:20:01 with parseTime
                        const countTime = (time) => {
                            let time_split = time.split(':');
                            let hour = time_split[0];
                            let minute = time_split[1];
                            let second = time_split[2];
                            let now = new Date();
                            let time_now = now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds();
                            let time_now_split = time_now.split(':');
                            let hour_now = time_now_split[0];
                            let minute_now = time_now_split[1];
                            let second_now = time_now_split[2];
                            let hour_diff = hour - hour_now;
                            let minute_diff = minute - minute_now;
                            let second_diff = second - second_now;
                            if(second_diff < 0){
                                second_diff = 60 - second_diff;
                                minute_diff = minute_diff - 1;
                            }
                            if(minute_diff < 0){
                                minute_diff = 60 - minute_diff;
                                hour_diff = hour_diff - 1;
                            }
                            return { hour_diff, minute_diff, second_diff }
                        }



                        let hours = 1
                        let minutes = 10
                        let sec = 60
                        setInterval(() => {
                            this.setState({
                                schedule: `${countTime(this.state.time).hour_diff} : ${countTime(this.state.time).minute_diff} : ${countTime(this.state.time).second_diff}`
                            })
                            sec--;
                            if(sec == 0){
                                minutes--;
                                sec = 60;
                                if(minutes == 0){
                                    hours--;
                                    minutes = 60;
                                    if(hours == 0){
                                        this.setState({
                                            schedule: 'Class Begin'
                                        })
                                    }
                                }
                            }
                        }, 1000)
                        }
                    })
                }
            })
        })
    }

    refresh(){
        const dayOrigin = new Date().getDay();
        const dayName = (dayOrigin) => {
            const day = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            return day[dayOrigin];
        }

        const day = dayName(dayOrigin);


        AsyncStorage.getItem("token").then(async (token) => {
            this.setState({ refresh: true })
            await axios.post(konfigurasi.server + 'auth/profile', {
                token: token,
                secret: konfigurasi.secret
            }).then((res) => {
                this.setState({
                    username: res.data.name,
                })
            })

            await axios.post(konfigurasi.server + 'lessons/getall', {
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
                            this.setState({ time: item.date })
                            console.log(this.state.time)
                            this.setState({ next_lecture: this.state.next_lecture.concat(item) })

                        // count time from now to 14:20:01 with parseTime
                        const countTime = (time) => {
                            let time_split = time.split(':');
                            let hour = time_split[0];
                            let minute = time_split[1];
                            let second = time_split[2];
                            let now = new Date();
                            let time_now = now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds();
                            let time_now_split = time_now.split(':');
                            let hour_now = time_now_split[0];
                            let minute_now = time_now_split[1];
                            let second_now = time_now_split[2];
                            let hour_diff = hour - hour_now;
                            let minute_diff = minute - minute_now;
                            let second_diff = second - second_now;
                            if(second_diff < 0){
                                second_diff = 60 - second_diff;
                                minute_diff = minute_diff - 1;
                            }
                            if(minute_diff < 0){
                                minute_diff = 60 - minute_diff;
                                hour_diff = hour_diff - 1;
                            }
                            return { hour_diff, minute_diff, second_diff }
                        }



                        let hours = 1
                        let minutes = 10
                        let sec = 60
                        setInterval(() => {
                            this.setState({
                                schedule: `${countTime(this.state.time).hour_diff} : ${countTime(this.state.time).minute_diff} : ${countTime(this.state.time).second_diff}`
                            })
                            sec--;
                            if(sec == 0){
                                minutes--;
                                sec = 60;
                                if(minutes == 0){
                                    hours--;
                                    minutes = 60;
                                    if(hours == 0){
                                        this.setState({
                                            schedule: 'Class Begin'
                                        })
                                    }
                                }
                            }
                        }, 1000)
                        }
                    })
                }
                this.setState({ refresh: false })
            })
        })

    }

    render(){
        return(
            <ScrollView style={{ flex: 1, flexDirection: 'column', backgroundColor: 'white' }} refreshControl={<RefreshControl refreshing={this.state.refresh} onRefresh={() => this.refresh()} />}>
                <StatusBar barStyle={"dark-content"} backgroundColor={"white"} />
                
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View style={{ flexDirection: 'row', marginTop: 25, marginLeft: 20 }}>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('Profile')}>
                            <Image source={this.state.picture.length == 0 ? this.state.gender == 'male' ? require('../../assets/illustrations/male.png') : require('../../assets/illustrations/female.png') : this.state.picture} style={{ width: 50, height: 50, borderRadius: 100, borderWidth: 2, borderColor: '#191A19' }} />
                        </TouchableOpacity>

                        <View style={{ flexDirection: 'column', marginLeft: 15 }}>
                            <Text style={{ color: '#191A19', fontSize: 16 }}>Wellcome {this.state.level}</Text>
                            <Text style={{ color: '#191A19', fontWeight: 'bold', fontSize: 18 }}>{this.state.username}</Text>
                        </View>
                    </View>

                    <View style={{ flexDirection: 'column', marginRight: 30, marginTop: 30 }}>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('Notifications')}>
                            <Icons name="notifications-outline" size={30} color="#191A19" />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={{ marginTop: 35, marginLeft: 15 }}>
                    <Text style={{ color: '#191A19', fontSize: 20, fontWeight: 'bold' }}>What lesson would you</Text>
                    <Text style={{ color: '#191A19', fontSize: 20, fontWeight: 'bold' }}>like to learn today ?</Text>

                    <View>
                        <View style={{ marginTop: 15, backgroundColor: '#191A19', borderRadius: 10, padding: 7, alignSelf: 'flex-start' }}>
                            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 17 }}>Class Begin in - {this.state.schedule}</Text>
                        </View>
                    </View>

                    <View style={{ flexDirection: 'column', marginTop: 25 }}>
                        <Text style={{ fontSize: 17, fontWeight: 'bold', color: '#191A19', alignSelf: 'center' }}>Your Navigation</Text>
                        <View style={{ flexDirection: "row", marginTop: 15, justifyContent: 'space-evenly', alignItems: 'center' }}>
                            <TouchableOpacity style={{ alignItems: 'center' }} onPress={() => this.props.navigation.navigate('LectureAdmin')}>
                                <Icons name="library-outline" size={30} color="#191A19" />
                                <Text style={{ color: '#191A19' }}>Lecture</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={{ alignItems: 'center' }} onPress={() => this.props.navigation.navigate('Role')}>
                                <Icons name="person-outline" size={30} color="#191A19" />
                                <Text style={{ color: '#191A19' }}>Roles</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={{ alignItems: 'center' }} onPress={() => this.props.navigation.navigate('ClassAdmin')}>
                                <Icons name="school-outline" size={30} color="#191A19" />
                                <Text style={{ color: '#191A19' }}>Class</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={{ flexDirection: "row", marginTop: 35, marginLeft: 20, justifyContent: 'space-evenly' }}>
                            <TouchableOpacity style={{ alignItems: 'center' }} onPress={() => this.props.navigation.navigate('EventAdmin')}>
                                <Icons name="golf-outline" size={30} color="#191A19" />
                                <Text style={{ color: '#191A19' }}>Events</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={{ alignItems: 'center', marginLeft: 18 }} onPress={() => this.props.navigation.navigate('InboxAdmin')}>
                                <Icons name="file-tray-outline" size={30} color="#191A19" />
                                <Text style={{ color: '#191A19' }}>Inbox</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={{ alignItems: 'center', marginLeft: 10 }} onPress={() => this.props.navigation.navigate('HomeworkAdmin')}>
                                <Icons name="newspaper-outline" size={30} color="#191A19" />
                                <Text style={{ color: '#191A19' }}>Home Work</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ flexDirection: "row", marginTop: 35, justifyContent: 'space-evenly' }}>
                            <TouchableOpacity style={{ alignItems: 'center' }} onPress={() => this.props.navigation.navigate('AdminNew')}>
                                <Icons name="person-circle-outline" size={30} color="#191A19" />
                                <Text style={{ color: '#191A19' }}>Admin</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={{ alignItems: 'center' }} onPress={() => this.props.navigation.navigate('AttendanceAdmin')}>
                                <Icons name="hand-left-outline" size={30} color="#191A19" />
                                <Text style={{ color: '#191A19' }}>Attendance</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={{ alignItems: 'center' }} onPress={() => this.props.navigation.navigate('Location')}>
                                <Icons name="location-outline" size={30} color="#191A19" />
                                <Text style={{ color: '#191A19' }}>Location</Text>
                            </TouchableOpacity>

                        </View>
                    </View>
                </View>
            </ScrollView>
        )
    }
}
