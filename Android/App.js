import React, { Component } from 'react'
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

// List of components

// Authentication
import Login from './components/Auth/Login'
import Register from './components/Auth/Register'

// Users
import Home from './components/Users/Home'
import Profile from './components/Users/Profile'
import Lecture from './components/Users/Lecture'
import Attendance from './components/Users/Attendance'
import Events from './components/Users/Events'
import Homework from './components/Users/Homework'
import Notifications from './components/Users/Notifications'
import Class from './components/Users/Class'

// Admin
import Admin from './components/Admin/Home'
import LectureAdmin from './components/Admin/LectureAdmin'
import Role from './components/Admin/Role'
import ClassAdmin from './components/Admin/Class'

export default class Navigation extends Component{
    render(){
        const Stack = createNativeStackNavigator()
        return(
            <NavigationContainer>
                <Stack.Navigator initialRouteName={"Login"}>
                    <Stack.Screen name="Home" component={Home} options={{
                        headerShown: false
                    }} />
                    <Stack.Screen name="Admin" component={Admin} options={{
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
                    }} />
                    <Stack.Screen name="Lecture" component={Lecture} options={{
                        headerShown: true,
                        headerShadowVisible: false,
                    }} />
                    <Stack.Screen name="Attendance" component={Attendance} options={{
                        headerShown: true,
                        headerShadowVisible: false,
                    }} />
                    <Stack.Screen name="Events" component={Events} options={{
                        headerShown: true,
                        headerShadowVisible: false,
                    }} />
                    <Stack.Screen name="Homework" component={Homework} options={{
                        headerShown: true,
                        headerShadowVisible: false,
                    }} />
                    <Stack.Screen name="Notifications" component={Notifications} options={{
                        headerShown: true,
                        headerShadowVisible: false,
                    }} />

                    {/* Admin Sections */}
                    <Stack.Screen name="LectureAdmin" component={LectureAdmin} options={{
                        headerShown: true,
                        headerShadowVisible: false,
                        headerTitle: ""
                    }} />
                    <Stack.Screen name="Role" component={Role} options={{
                        headerShown: true,
                        headerShadowVisible: false,
                        headerTitle: ""
                    }} />
                    <Stack.Screen name="ClassAdmin" component={ClassAdmin} options={{
                        headerShown: true,
                        headerShadowVisible: false,
                        headerTitle: ""
                    }} />
                    
                </Stack.Navigator>
            </NavigationContainer>
        )
    }
}

