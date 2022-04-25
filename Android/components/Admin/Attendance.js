import React, { Component } from 'react';
import { View, Text, TextInput, Picker, TouchableOpacity, AsyncStorage, Image, ScrollView, StatusBar } from 'react-native'
import axios from 'axios'
import SwipeUpDownModal from 'react-native-swipe-modal-up-down'
import Icons from 'react-native-vector-icons/Ionicons'
import { LineChart } from 'react-native-chart-kit'
import konfigurasi from '../../config'
import DateTimePicker from '@react-native-community/datetimepicker'

export default class AttendanceAdmin extends Component{
    constructor(props){
        super(props)

        this.state = {
            data: [],
            choose_class: [],
            choose_major: [],
            user: '',
            class: '',
            filter_class: '',
            filter_major: '',
            filter: false,
            month_begin: ["January", "February", "March", "April", "May"],
            month_last: ["June", "July", "August", "September", "October"],
            data_month_begin: [],
            user_attendance: [],
            lessons: [],
            lesson_input: '',
            user_name: '',
            month: {
                january: 0,
                february: 0,
                march: 0,
                april: 0,
                may: 0,
                june: 0,
                july: 0,
                august: 0,
                september: 0,
                october: 0,
                november: 0,
                december: 0
            },
            manual: false,
            date: false,
            attendance_date: null
        }
    }

    componentDidMount(){
        AsyncStorage.getItem('token').then(token => {
            axios.post(konfigurasi.server + 'attendance/getall?all=false', {
                token: token,
                secret: konfigurasi.secret,
                username: this.state.user,
                class: this.state.filter_class,
                major: this.state.filter_major,
                date: new Date().toLocaleDateString()
            }).then(res => {
                if(res.data.success){
                    this.setState({ data: this.state.data.concat(res.data.data) })
                    for(var i = 0; i < this.state.data.length; i++){
                        if(this.state.data[i].date.split('/')[0] == '01'){
                            this.setState({ month: { ...this.state.month, january: this.state.month.january + 1 } })
                        }else if(this.state.data[i].date.split('/')[0] == '02'){
                            this.setState({ month: { ...this.state.month, february: this.state.month.february + 1 } })
                        }else if(this.state.data[i].date.split('/')[0] == '03'){
                            this.setState({ month: { ...this.state.month, march: this.state.month.march + 1 } })
                        }else if(this.state.data[i].date.split('/')[0] == '04'){
                            this.setState({ month: { ...this.state.month, april: this.state.month.april + 1 } })
                        }else if(this.state.data[i].date.split('/')[0] == '05'){
                            this.setState({ month: { ...this.state.month, may: this.state.month.may + 1 } })
                        }else if(this.state.data[i].date.split('/')[0] == '06'){
                            this.setState({ month: { ...this.state.month, june: this.state.month.june + 1 } })
                        }else if(this.state.data[i].date.split('/')[0] == '07'){
                            this.setState({ month: { ...this.state.month, july: this.state.month.july + 1 } })
                        }else if(this.state.data[i].date.split('/')[0] == '08'){
                            this.setState({ month: { ...this.state.month, august: this.state.month.august + 1 } })
                        }else if(this.state.data[i].date.split('/')[0] == '09'){
                            this.setState({ month: { ...this.state.month, september: this.state.month.september + 1 } })
                        }else if(this.state.data[i].date.split('/')[0] == '10'){
                            this.setState({ month: { ...this.state.month, october: this.state.month.october + 1 } })
                        }else if(this.state.data[i].date.split('/')[0] == '11'){
                            this.setState({ month: { ...this.state.month, november: this.state.month.november + 1 } })
                        }else if(this.state.data[i].date.split('/')[0] == '12'){
                            this.setState({ month: { ...this.state.month, december: this.state.month.december + 1 } })
                        }
                    }
                }
            })

            axios.post(konfigurasi.server + 'class/getall', {
                token: token,
                secret: konfigurasi.secret
            }).then(res => {
                if(res.data.class){
                    this.setState({ choose_class: this.state.choose_class.concat(res.data.class) })
                }
            })

            // get all lessons
            axios.post(konfigurasi.server + 'lessons/getall', {
                token: token,
                secret: konfigurasi.secret
            }).then(res => {
                if(res.data.lessons){
                    this.setState({ lessons: this.state.lessons.concat(res.data.lessons) })
                    this.setState({ lesson_input: this.state.lessons[0].lessons })
                }
            })

            axios.post(konfigurasi.server + 'class/major/getall', {
                token: token,
                secret: konfigurasi.secret
            }).then(res => {
                if(res.data.majors){
                    this.setState({ choose_major: this.state.choose_major.concat(res.data.majors) })
                }
            })
        })
    }

    refresh(){
        AsyncStorage.getItem('token').then(token => {
            axios.post(konfigurasi.server + 'attendance/getall?all=false', {
                token: token,
                secret: konfigurasi.secret,
                username: this.state.user,
                class: this.state.filter_class,
                major: this.state.filter_major,
                date: this.state.attendance_date == null ? '' : new Date().toLocaleDateString()
             }).then(res => {
                if(res.data.success){
                    this.setState({ data: [] })
                    this.setState({ data: this.state.data.concat(res.data.data) })
                    // count attendance by month
                    for(var i = 0; i < this.state.data.length; i++){
                        if(this.state.data[i].date.split('/')[0] == '01'){
                            this.setState({ month: { ...this.state.month, january: this.state.month.january + 1 } })
                        }else if(this.state.data[i].date.split('/')[0] == '02'){
                            this.setState({ month: { ...this.state.month, february: this.state.month.february + 1 } })
                        }else if(this.state.data[i].date.split('/')[0] == '03'){
                            this.setState({ month: { ...this.state.month, march: this.state.month.march + 1 } })
                        }else if(this.state.data[i].date.split('/')[0] == '04'){
                            this.setState({ month: { ...this.state.month, april: this.state.month.april + 1 } })
                        }else if(this.state.data[i].date.split('/')[0] == '05'){
                            this.setState({ month: { ...this.state.month, may: this.state.month.may + 1 } })
                        }else if(this.state.data[i].date.split('/')[0] == '06'){
                            this.setState({ month: { ...this.state.month, june: this.state.month.june + 1 } })
                        }else if(this.state.data[i].date.split('/')[0] == '07'){
                            this.setState({ month: { ...this.state.month, july: this.state.month.july + 1 } })
                        }else if(this.state.data[i].date.split('/')[0] == '08'){
                            this.setState({ month: { ...this.state.month, august: this.state.month.august + 1 } })
                        }else if(this.state.data[i].date.split('/')[0] == '09'){
                            this.setState({ month: { ...this.state.month, september: this.state.month.september + 1 } })
                        }else if(this.state.data[i].date.split('/')[0] == '10'){
                            this.setState({ month: { ...this.state.month, october: this.state.month.october + 1 } })
                        }else if(this.state.data[i].date.split('/')[0] == '11'){
                            this.setState({ month: { ...this.state.month, november: this.state.month.november + 1 } })
                        }else if(this.state.data[i].date.split('/')[0] == '12'){
                            this.setState({ month: { ...this.state.month, december: this.state.month.december + 1 } })
                        }
                    }
                }
            })

            axios.post(konfigurasi.server + 'class/getall', {
                token: token,
                secret: konfigurasi.secret
            }).then(res => {
                if(res.data.class){
                    this.setState({ choose_class: [] })
                    this.setState({ choose_class: this.state.choose_class.concat(res.data.class) })
                }
            })

            axios.post(konfigurasi.server + 'class/major/getall', {
                token: token,
                secret: konfigurasi.secret
            }).then(res => {
                if(res.data.majors){
                    this.setState({ choose_major: [] })
                    this.setState({ choose_major: this.state.choose_major.concat(res.data.majors) })
                }
            })
        })
    }


    search(){
        AsyncStorage.getItem('token').then(token => {
            axios.post(konfigurasi.server + 'attendance/getall?all=false', {
                token: token,
                secret: konfigurasi.secret,
                class: this.state.filter_class,
                major: this.state.filter_major,
                date: this.state.attendance_date == null ? '' : this.state.attendance_date,
                username: '',
            }).then(res => {
                console.log(res.data)
                if(res.data.success){
                    this.setState({ data: [] })
                    this.setState({ data: this.state.data.concat(res.data.data) })
                }
            })
        })
    }

    search_user(){
        AsyncStorage.getItem('token').then(token => {
            axios.post(konfigurasi.server + 'auth/get', {
                token: token,
                secret: konfigurasi.secret,
                name: this.state.user,
                class: this.state.filter_class,
                major: this.state.filter_major,
            }).then(res => {
                if(res.status == 200){
                    this.setState({ user_attendance: this.state.user_attendance.concat(res.data.data) })
                }
            })
        })
    }

    delete(id){
        AsyncStorage.getItem('token').then(token => {
            axios.post(konfigurasi.server + 'attendance/delete', {
                token: token,
                secret: konfigurasi.secret,
                id: id
            }).then(res => {
                if(res.data.success){
                    this.setState({ data: [] })
                    this.refresh()
                }
            })
        })
    }

    add(index){
        AsyncStorage.getItem('token').then(token => {
            axios.post(konfigurasi.server + 'attendance/add/manual', {
                token: token,
                secret: konfigurasi.secret,
                date: new Date().toLocaleDateString(),
                name: this.state.user_attendance[index].name,
                username: this.state.user_attendance[index].username,
                class: this.state.user_attendance[index].class,
                major: this.state.user_attendance[index].major,
                lessons: this.state.lessons_input,
                time: new Date().getHours() + ':' + new Date().getMinutes(),
            }).then(res => {
                console.log(res.data)
                if(res.status == 200){
                    alert('Successfully adding attendance')
                    this.setState({ data: [] })
                    this.refresh()
                }else if(res.status == 301){
                    alert('Failed adding attendance')
                }
            })
        })
    }

    render(){
        return(
            <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 15, flexDirection: 'column', backgroundColor: 'white' }}>
                <StatusBar backgroundColor={"#4E9F3D"} barStyle='dark-content' />

                <SwipeUpDownModal 
                    modalVisible={this.state.manual}
                    ContentModal={
                        <View style={{ flex: 1, flexDirection: 'column', backgroundColor: 'white', marginTop: 70, borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
                            <View style={{ backgroundColor: 'white', elevation: 15, alignItems: 'center', borderTopLeftRadius: 15, borderTopRightRadius: 15 }}>
                                <Icons name='remove-outline' size={40} color="black" />
                                <Text style={{ fontWeight: 'bold', fontSize: 17, marginTop: -8, paddingBottom: 15 }}>Add Attendance</Text>
                            </View>

                            <ScrollView contentContainerStyle={{ flexGrow: 1, flexDirection: 'column', marginTop: 20, alignItems: 'center', paddingBottom: 35 }}>
                                <View style={{ marginTop: 25 }}>
                                    <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                                        <View style={{ flexDirection: 'row', backgroundColor: '#ededed', width: 270, padding: 10, borderRadius: 10, alignItems: 'center' }}>
                                            <Icons name="search-outline" size={20} color="black" />
                                            <TextInput placeholder="Search Users" style={{ width: 200, marginLeft: 10 }} onChangeText={(val) => this.setState({ user: val })} />
                                        </View>
                                        <TouchableOpacity style={{ backgroundColor: "#4E9F3D", padding: 10, borderRadius: 10, marginLeft: 8 }} onPress={() => this.search_user()}>
                                            <Icons name="search-outline" size={25} color="black" />
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{  elevation: 10, borderRadius: 10, width: 280, backgroundColor: 'white', alignSelf: 'center', marginTop: 25}}>
                                    <Picker selectedItem={this.state.lesson} onValueChange={(val) => this.setState({ lesson_input: val })}>
                                        {this.state.lessons.map((val, index) => {
                                            return(
                                                <Picker.Item label={val.lessons} value={val.lessons} key={index} />
                                            )
                                        })}
                                    </Picker>
                                </View>
                        {this.state.user_attendance.map((x,y) => {
                        return <View style={{ backgroundColor: 'white', padding: 10, marginLeft: 10, marginRight: 10, elevation: 15, borderRadius: 15, flexDirection: 'row', justifyContent: 'space-between', marginTop: 25 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Image source={require('../../assets/illustrations/male.png')} style={{ width: 50, height: 50, borderRadius: 100 }} />
                            <View style={{ flexDirection: 'column', marginLeft: 10 }}>
                                <Text style={{ fontWeight: 'bold' }}>{x.name}</Text>
                                <Text>@{x.username}</Text>
                                <Text style={{ color: 'grey' }}>Grade {x.class}</Text>
                            </View>
                        </View>

                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{ flexDirection: 'column', marginRight: 10, alignItems: 'center', marginTop: 10 }}>
                                <Text style={{ color: 'grey' }}>{x.major.length > 5 ? x.major.slice(0, 5)+'...' : x.major}</Text>
                            </View>

                            <TouchableOpacity onPress={() => this.add(y)}>
                                <Icons name='add-circle-outline' size={25} color="#4E9F3D" />
                            </TouchableOpacity>
                        </View>
                    </View>
                    })}
                                </View>
                            </ScrollView>

                        </View>
                    }

                    onClose={() => this.setState({ manual: false })}
                />

                <SwipeUpDownModal 
                    modalVisible={this.state.filter}
                    ContentModal={
                        <View style={{ flex: 1, flexDirection: 'column', backgroundColor: 'white', marginTop: 70, borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
                            <View style={{ backgroundColor: 'white', elevation: 15, alignItems: 'center', borderTopLeftRadius: 15, borderTopRightRadius: 15 }}>
                                <Icons name='remove-outline' size={40} color="black" />
                                <Text style={{ fontWeight: 'bold', fontSize: 17, marginTop: -8, paddingBottom: 15 }}>Filters Users</Text>
                            </View>

                            <ScrollView contentContainerStyle={{ flexGrow: 1, flexDirection: 'column', marginTop: 20, alignItems: 'center' }}>

                                <Text style={{ fontSize: 15, marginLeft: 45, marginBottom: 10, alignSelf: 'flex-start', marginTop: 20 }}>Attendance Date</Text>
                                <TouchableOpacity style={{ padding: 10, elevation: 10, borderRadius: 10, width: 280, backgroundColor: 'white', alignItems: 'center'}} onPress={() => this.setState({ date: true })}>
                                    {this.state.attendance_date == null ? <Text>Click here to set attendance date</Text> : <Text style={{ fontWeight: 'bold' }}>{this.state.attendance_date}</Text>}
                                </TouchableOpacity>

                                {this.state.date && (
                                <DateTimePicker
                                    value={new Date()}
                                    mode={'date'}
                                    is24Hour={true}
                                    display="default"
                                    onChange={(event, selectedDate) => {
                                        let month = selectedDate.getMonth() < 10 ? '0' + selectedDate.getMonth() : selectedDate.getMonth() 
                                        let date = month + '/' + selectedDate.getDate() + '/' + selectedDate.getFullYear();
                                        this.setState({ attendance_date: date, date: false });
                                    }}/>
                                )}
                                <Text style={{ fontSize: 15, marginLeft: 45, marginBottom: 10, alignSelf: 'flex-start', marginTop: 20 }}>Filter Class</Text>
                                <View style={{ padding: 5, elevation: 10, borderRadius: 10, width: 280, backgroundColor: 'white' }}>
                                    <Picker selectedItem={this.state.filter_class} onValueChange={(val) => this.setState({ filter_class: val })}>
                                        {this.state.choose_class.map((x,y) => {
                                            return <Picker.Item label={"Class - " + x.class} value={x.class} />
                                        })}
                                    </Picker>
                                </View>

                                <Text style={{ fontSize: 15, marginLeft: 45, marginBottom: 10, alignSelf: 'flex-start', marginTop: 20 }}>Filter Majors</Text>
                                <View style={{ padding: 5, elevation: 10, borderRadius: 10, width: 280, backgroundColor: 'white' }}>
                                    <Picker selectedItem={this.state.filter_major} onValueChange={(val) => this.setState({ filter_major: val })}>
                                        {this.state.choose_major.map((x,y) => {
                                            return <Picker.Item label={x.major} value={x.major} />
                                        })}
                                    </Picker>
                                </View>

                                <TouchableOpacity style={{ marginTop: 25, elevation: 10, borderRadius: 10, width: 280, padding: 10, backgroundColor: '#4E9F3D', alignItems: 'center', justifyContent: 'center' }} onPress={() => this.search()}>
                                    <Text style={{ color: 'white', fontWeight: 'bold' }}>Apply Filters</Text>
                                </TouchableOpacity>

                                <View style={{ padding: 10, paddingBottom: 50 }}>
                                </View>

                            </ScrollView>

                        </View>
                    }

                    onClose={() => this.setState({ filter: false })}
                />

                <View style={{ marginTop: 25 }}>
                    <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                        <View style={{ flexDirection: 'row', backgroundColor: '#ededed', width: 270, padding: 10, borderRadius: 10, alignItems: 'center' }}>
                            <Icons name="search-outline" size={20} color="black" />
                            <TextInput placeholder="Search Users" style={{ width: 200, marginLeft: 10 }} onChangeText={(val) => this.setState({ user: val })} />
                        </View>
                        <TouchableOpacity style={{ backgroundColor: "#4E9F3D", padding: 10, borderRadius: 10, marginLeft: 8 }} onPress={() => this.search()}>
                            <Icons name="search-outline" size={25} color="black" />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={{ flexDirection: 'row', marginRight: 20, marginLeft: 20, marginTop: 10, justifyContent: 'space-between' }}>
                    <TouchableOpacity onPress={() => this.setState({ filter: true })}>
                        <Text style={{ color: '#4E9F3D' }}>Filters</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => this.setState({ manual: true })}>
                        <Text style={{ color: '#4E9F3D' }}>Add</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ flexDirection: 'column', marginTop: 5 }}>
                <View style={{ alignItems: 'center', marginTop: 15 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 17 }}>Statistic Per Month</Text>
                    <LineChart
                        data={{
                            labels: new Date().getMonth() == 5 ? this.state.month_last : this.state.month_begin,
                            datasets: [
                                {
                                    data: new Date().getMonth == 5 ? [
                                        this.state.month.june,
                                        this.state.month.july,
                                        this.state.month.august,
                                        this.state.month.september,
                                        this.state.month.october,
                                        this.state.month.november,
                                        this.state.month.december,
                                    ] : [
                                            this.state.month.january,
                                            this.state.month.february,
                                            this.state.month.march,
                                            this.state.month.april,
                                            this.state.month.may,
                                        ]
                                }
                            ]
                            }}
                width={330} // from react-native
                height={220}
                yAxisLabel=""
                yAxisSuffix=""
                yAxisInterval={1} // optional, defaults to 1
                chartConfig={{
                      backgroundColor: "#4E9F3D",
                      backgroundGradientFrom: "#4E9F3D",
                      backgroundGradientTo: "#4E9F3D",
                      decimalPlaces: 2, // optional, defaults to 2dp
                      color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                      labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                      style: {
                            borderRadius: 16,
                            padding: 10,
                        },
                      propsForDots: {
                              r: "6",
                              strokeWidth: "2",
                              stroke: "skyblue"
                            }
                    }}
                bezier
                style={{
                      marginVertical: 8,
                      borderRadius: 16
                    }}
              />
                </View>
                    <Text style={{ marginLeft: 15, fontWeight: 'bold', fontSize: 18, marginTop: 15 }}>Today Attendance</Text>
                    {this.state.data.length == 0 ? <View style={{ alignItems: "center", marginTop: 25 }}>
                            <Icons name='logo-dropbox' color="grey" size={70} />
                        <Text style={{ fontSize: 15, marginTop: 10, fontWeight: 'bold', color: 'grey' }}>Attendance not available yet!</Text>
                            </View> : this.state.data.map((x,y) => {
                        return <TouchableOpacity style={{ backgroundColor: 'white', padding: 10, marginLeft: 10, marginRight: 10, elevation: 15, borderRadius: 15, flexDirection: 'row', justifyContent: 'space-between', marginTop: 25 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Image source={require('../../assets/illustrations/male.png')} style={{ width: 50, height: 50, borderRadius: 100 }} />
                            <View style={{ flexDirection: 'column', marginLeft: 10 }}>
                                {x.absent == true ? <Text style={{ fontWeight: 'bold', color: 'red' }}>{x.name} (absent)</Text> : <Text style={{ fontWeight: 'bold' }}>{x.name}</Text>}

                                <Text>@{x.username}</Text>
                                <Text style={{ color: 'grey' }}>Grade {x.class}</Text>
                            </View>
                        </View>

                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{ flexDirection: 'column', marginRight: 10, alignItems: 'center', marginTop: 10 }}>
                                <Text style={{ color: 'grey' }}>{x.time}</Text>
                                <Text style={{ color: 'grey' }}>{x.major.length > 5 ? x.major.slice(0, 5)+'...' : x.major}</Text>
                            </View>

                            <TouchableOpacity onPress={() => this.delete(x._id)}>
                                <Icons name='trash-outline' size={25} color="red" />
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                    })}
                </View>
            </ScrollView>
        )
    }
}
