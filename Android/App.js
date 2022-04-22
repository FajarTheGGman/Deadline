import React, { Component } from 'react'
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, AsyncStorage } from 'react-native';
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

// List of components

// Authentication
import Login from './components/Auth/Login'
import Register from './components/Auth/Register'

// Banners
import Banner from './components/Banner/Banner'
import Guide from './components/Banner/Guide'

// Users
import Home from './components/Users/Home'
import Profile from './components/Users/Profile'
import Lecture from './components/Users/Lecture'
import Attendance from './components/Users/Attendance'
import Events from './components/Users/Events'
import Homework from './components/Users/Homework'
import Notifications from './components/Users/Notifications'
import Class from './components/Users/Class'
import Leaderboard from './components/Users/Leaderboard'
import Inbox from './components/Users/Inbox'
import About from './components/Users/About'

// Settings
import Passwords from './components/Settings/Passwords'
import Username from './components/Settings/Username'

// Admin
import Admin from './components/Admin/Home'
import Teacher from './components/Admin/HomeTeacher.js'
import AttendanceAdmin from './components/Admin/Attendance'
import LectureAdmin from './components/Admin/LectureAdmin'
import Role from './components/Admin/Role'
import ClassAdmin from './components/Admin/Class'
import Location from './components/Admin/Location'
import EventAdmin from './components/Admin/Events'
import InboxAdmin from './components/Admin/Inbox'
import AdminNew from './components/Admin/Admin'
import HomeworkAdmin from './components/Admin/Homework'
import Testing from './components/Users/Testing'

export default class Navigation extends Component{
    constructor(props){
        super(props)
        this.state = {
            redirect: 'Banner',
            component: 'Home',
            token: false
        }
    }

    componentDidMount(){
        AsyncStorage.getItem('token').then(token => {
            if(token){
                this.setState({
                    token: true
                })
                AsyncStorage.getItem('level').then(level => {
                    if(level == 'admin'){
                        this.setState({
                            redirect: 'Admin',
                            component: 'Admin'
                        })
                    }else if(level == 'teacher'){
                        this.setState({
                            redirect: 'Teacher',
                            component: 'Teacher'
                        })
                    }else{
                        this.setState({
                            redirect: 'Home',
                            component: 'Home'
                        })
                    }
                })
            }
        })
    }

    render(){
        const Stack = createNativeStackNavigator()
        return(
            <NavigationContainer>
                <Stack.Navigator initialRouteName={this.state.redirect}>
                    <Stack.Screen name="Home" component={Home} options={{
                        headerShown: false
                    }} />
                    <Stack.Screen name="Testing" component={Testing} options={{
                        headerShown: false
                    }} />
                    <Stack.Screen name="Banner" component={Banner} options={{
                        headerShown: false
                    }} />
                    <Stack.Screen name="Guide" component={Guide} options={{
                        headerShown: false
                    }} />
                    <Stack.Screen name="Admin" component={Admin} options={{
                        headerShown: false
                    }} />
                    <Stack.Screen name="Teacher" component={Teacher} options={{
                        headerShown: false
                    }} />
                    <Stack.Screen name="Login" component={Login} options={{
                        headerShown: false
                    }} />
                    <Stack.Screen name="Register" component={Register} options={{
                        headerShown: false
                    }} />
                    <Stack.Screen name="Profile" component={Profile} options={{
                        headerShown: true,
                        headerShadowVisible: false,
                        headerStyle: {
                            backgroundColor: '#4E9F3D',
                            borderRadius: 20,
                        }
                    }} />
                    <Stack.Screen name="About" component={About} options={{
                        headerShown: true,
                        headerShadowVisible: false,
                        headerTitle: "About Me :)"
                    }} />
                    <Stack.Screen name="Lecture" component={Lecture} options={{
                        headerShown: true,
                        headerShadowVisible: false,
                        headerStyle: {
                            backgroundColor: '#4E9F3D',
                            borderRadius: 20,
                        }
                    }} />
                    <Stack.Screen name="Attendance" component={Attendance} options={{
                        headerShown: true,
                        headerShadowVisible: false,
                        headerStyle: {
                            backgroundColor: '#4E9F3D',
                            borderRadius: 20,
                        }
                    }} />
                    <Stack.Screen name="Events" component={Events} options={{
                        headerShown: true,
                        headerShadowVisible: false,
                        headerStyle: {
                            backgroundColor: '#4E9F3D',
                            borderRadius: 20,
                        }
                    }} />
                    <Stack.Screen name="Inbox" component={Inbox} options={{
                        headerShown: true,
                        headerShadowVisible: false,
                        headerStyle: {
                            backgroundColor: '#4E9F3D',
                            borderRadius: 20,
                        }
                    }} />
                    <Stack.Screen name="Leaderboard" component={Leaderboard} options={{
                        headerShown: true,
                        headerShadowVisible: false,
                        headerStyle: {
                            backgroundColor: '#4E9F3D',
                            borderRadius: 20,
                        }
                    }} />
                    <Stack.Screen name="Homework" component={Homework} options={{
                        headerShown: true,
                        headerShadowVisible: false,
                        headerStyle: {
                            backgroundColor: '#4E9F3D',
                            borderRadius: 20,
                        }
                    }} />
                    <Stack.Screen name="Notifications" component={Notifications} options={{
                        headerShown: true,
                        headerShadowVisible: false,
                        headerStyle: {
                            backgroundColor: '#4E9F3D',
                            borderRadius: 20,
                        }
                    }} />

                    {/* Settings */}
                    <Stack.Screen name="Passwords" component={Passwords} options={{
                        headerShown: true,
                        headerShadowVisible: false,
                        headerTitle: 'Change Passwords',
                        headerStyle: {
                            backgroundColor: '#4E9F3D',
                            borderRadius: 20,
                        }
                    }} />
                    <Stack.Screen name="Username" component={Username} options={{
                        headerShown: true,
                        headerShadowVisible: false,
                        headerTitle: 'Change Username',
                        headerStyle: {
                            backgroundColor: '#4E9F3D',
                            borderRadius: 20,
                        }
                    }} />


                    {/* Admin Sections */}
                    <Stack.Screen name="LectureAdmin" component={LectureAdmin} options={{
                        headerShown: true,
                        headerShadowVisible: true,
                        headerTitle: "The Lecture",
                        headerStyle: {
                            backgroundColor: '#4E9F3D',
                            borderRadius: 20,
                        }
                    }} />
                    <Stack.Screen name="Role" component={Role} options={{
                        headerShown: true,
                        headerShadowVisible: false,
                        headerTitle: "The Roles",
                        headerStyle: {
                            backgroundColor: '#4E9F3D',
                            borderRadius: 20,
                        }
                    }} />
                    <Stack.Screen name="ClassAdmin" component={ClassAdmin} options={{
                        headerShown: true,
                        headerShadowVisible: false,
                        headerTitle: "The Class",
                        headerStyle: {
                            backgroundColor: '#4E9F3D',
                            borderRadius: 20,
                        }
                    }} />
                    <Stack.Screen name="Location" component={Location} options={{
                        headerShown: true,
                        headerShadowVisible: false,
                        headerTitle: "Your Location",
                        headerStyle: {
                            backgroundColor: '#4E9F3D',
                            borderRadius: 20,
                        }
                    }} />
                    <Stack.Screen name="EventAdmin" component={EventAdmin} options={{
                        headerShown: true,
                        headerShadowVisible: false,
                        headerTitle: "The Events",
                        headerStyle: {
                            backgroundColor: '#4E9F3D',
                            borderRadius: 20,
                        }
                    }} />
                    <Stack.Screen name="InboxAdmin" component={InboxAdmin} options={{
                        headerShown: true,
                        headerShadowVisible: false,
                        headerTitle: "The Inbox",
                        headerStyle: {
                            backgroundColor: '#4E9F3D',
                            borderRadius: 20,
                        }
                    }} />
                    <Stack.Screen name="AdminNew" component={AdminNew} options={{
                        headerShown: true,
                        headerShadowVisible: false,
                        headerTitle: "New Admin",
                        headerStyle: {
                            backgroundColor: '#4E9F3D',
                            borderRadius: 20,
                        }
                    }} />
                    <Stack.Screen name="AttendanceAdmin" component={AttendanceAdmin} options={{
                        headerShown: true,
                        headerShadowVisible: false,
                        headerTitle: "The Attendance",
                        headerStyle: {
                            backgroundColor: '#4E9F3D',
                            borderRadius: 20,
                        }
                    }} />
                    <Stack.Screen name="HomeworkAdmin" component={HomeworkAdmin} options={{
                        headerShown: true,
                        headerShadowVisible: false,
                        headerTitle: "The Homework",
                        headerStyle: {
                            backgroundColor: '#4E9F3D',
                            borderRadius: 20,
                        }
                    }} />
                    
                </Stack.Navigator>
            </NavigationContainer>
        )
    }
}

