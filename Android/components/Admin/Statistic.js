import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, AsyncStorage, ScrollView, Dimensions, FlatList, ActivityIndicator, Alert } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import axios from 'axios';
import konfigurasi from '../../config';

export default class Statistic extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: []
        }
    }

    componentDidMount(){
        AsyncStorage.getItem('token').then(token => {
            axios.post(konfigurasi.server + 'attendance/getall', {
                token: token,
                secret: konfigurasi.secret,
                class: '',
                major: '',
                username: ''
            }).then(data => {
                this.setState({
                    data: this.state.data.concat(data.data.data)
                })
            }).catch(err => {
                alert('Error', 'Terjadi kesalahan saat mengambil data')
            })
        })
    }

    render() {
        return (
            <View style={{ flex: 1, flexDirection: 'column', backgroundColor: 'white' }}>
                <View style={{ alignItems: 'center', marginTop: 55 }}>
                    <Image source={require('../../assets/illustrations/statistic.png')} style={{ width: 200, height: 130 }} />
                    <Text style={{ fontSize: 20, fontWeight: 'bold', marginTop: 20 }}>Statistic of Attendance</Text>
                </View>
                <View style={{ alignItems: 'center', marginTop: 35 }}>
                    <LineChart
                        data={{
                            labels: ["January", "February", "March", "April", "May"],
                            datasets: [
                                {
                                    data: [
                                            Math.random() * 100,
                                            Math.random() * 100,
                                            Math.random() * 100,
                                            Math.random() * 100,
                                            Math.random() * 100,
                                        ]
                                }
                            ]
                            }}
                width={330} // from react-native
                height={220}
                yAxisLabel="$"
                yAxisSuffix="k"
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
                              stroke: "#ffa726"
                            }
                    }}
                bezier
                style={{
                      marginVertical: 8,
                      borderRadius: 16
                    }}
              />
                </View>
            </View>
        )
    }

}
