import React, { Component } from 'react'
import { View, Text, Image, RefreshControl, TouchableOpacity, AsyncStorage, ScrollView, StatusBar } from 'react-native'
import Modal from 'react-native-modal'
import Icons from 'react-native-vector-icons/Ionicons'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Permissions, Notifications } from 'expo'
import { StackActions } from '@react-navigation/native'
import konfigurasi from '../../config'
import axios from 'axios'
import { BarCodeScanner } from 'expo-barcode-scanner'
import base64 from 'react-native-base64'

// expo packages
import * as Location from 'expo-location'

export default class Tab extends Component{

    componentDidMount(){
        AsyncStorage.getItem('token').then(token => {
            if(!token){
                this.props.navigation.dispatch(
                    StackActions.replace('Login')
                )
            }
        })
    }

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

    handleBarCodeScanned = ({ type, data }) => {
        AsyncStorage.getItem('token').then(token => {
            const dec = base64.decode(data)
            const js_data = JSON.parse(dec)
            axios.post(konfigurasi.server + 'attendance/add', {
                token: token,
                secret: konfigurasi.secret,
                class: js_data.class,
                lessons: this.state.next_lecture[0].lessons,
                major: this.state.major,
                time: this.state.time,
            }).then(res => {
                if(res.data.status == 'success'){
                    alert(js_data.callback)
                }
            })
        })
    }

    render(){
        return(
            <View style={{ flex: 1, flexDirection: 'column', backgroundColor: 'white' }}>
                <StatusBar barStyle={"dark-content"} backgroundColor={"white"} />
                <BarCodeScanner
                    onBarCodeScanned={this.handleBarCodeScanned}
                    style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
                >
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Icons name="qr-code-outline" size={120} color="black" />
                        <Text style={{ fontWeight: 'bold', marginTop: 15 }}>Scan QR Here!, to get attendance</Text>
                    </View>
                </BarCodeScanner>
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
            gender: 'male',
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
                console.log(res.data.picture)
                this.setState({
                    username: res.data.name,
                    picture: res.data.picture,
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
            <ScrollView contentContainerStyle={{ flexGrow: 1, flexDirection: 'column', backgroundColor: 'white' }} refreshControl={<RefreshControl refreshing={this.state.refresh} onRefresh={() => this.refresh()}/>}>
                <StatusBar barStyle={"dark-content"} backgroundColor={"white"} />
                
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View style={{ flexDirection: 'row', marginTop: 25, marginLeft: 20 }}>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('Profile')}>
                            <Image source={this.state.picture.length == 0 ? this.state.gender == 'male' ? require('../../assets/illustrations/male.png') : require('../../assets/illustrations/female.png') : this.state.picture} style={{ width: 50, height: 50, borderRadius: 100, borderWidth: 2, borderColor: '#191A19' }} />
                        </TouchableOpacity>

                        <View style={{ flexDirection: 'column', marginLeft: 15 }}>
                            <Text style={{ color: '#191A19', fontSize: 16 }}>Wellcome Back</Text>
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
                            {this.state.schedule.length == 0 ? <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 17 }}>There's no class today</Text> : <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 17 }}>Class Begin in - {this.state.schedule}</Text>  }
                        </View>
                    </View>

                    <View style={{ flexDirection: 'column', marginTop: 25 }}>
                        <Text style={{ fontSize: 17, fontWeight: 'bold', color: '#191A19', alignSelf: 'center' }}>Your Navigation</Text>
                        <View style={{ flexDirection: "row", marginTop: 15, justifyContent: 'space-evenly', alignItems: 'center' }}>
                            <TouchableOpacity style={{ alignItems: 'center' }} onPress={() => this.props.navigation.navigate('Lecture')}>
                                <Icons name="library-outline" size={30} color="#191A19" />
                                <Text style={{ color: '#191A19' }}>Lecture</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={{ alignItems: 'center' }} onPress={() => this.props.navigation.navigate('Attendance')}>
                                <Icons name="hand-left-outline" size={30} color="#191A19" />
                                <Text style={{ color: '#191A19' }}>Attendance</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={{ alignItems: 'center' }} onPress={() => this.props.navigation.navigate('Leaderboard')}>
                                <Icons name="trophy-outline" size={30} color="#191A19" />
                                <Text style={{ color: '#191A19' }}>Leaderboard</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={{ flexDirection: "row", marginTop: 35, justifyContent: 'space-evenly' }}>
                            <TouchableOpacity style={{ alignItems: 'center' }} onPress={() => this.props.navigation.navigate('Events')}>
                                <Icons name="golf-outline" size={30} color="#191A19" />
                                <Text style={{ color: '#191A19' }}>Events</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={{ alignItems: 'center', marginLeft: 18 }} onPress={() => this.props.navigation.navigate('Inbox')}>
                                <Icons name="file-tray-outline" size={30} color="#191A19" />
                                <Text style={{ color: '#191A19' }}>Inbox</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={{ alignItems: 'center', marginLeft: 10 }} onPress={() => this.props.navigation.navigate('Homework')}>
                                <Icons name="newspaper-outline" size={30} color="#191A19" />
                                <Text style={{ color: '#191A19' }}>Home Work</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>
        )
    }
}
