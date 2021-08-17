import React, { useState, useEffect  } from 'react'
import {
    StyleSheet,
    View,
    Text,
    Button
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import jwtDecode from 'jwt-decode';

const HomeScreen = props => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    const loadProfile = async () => {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
            props.navigation.navigate('Login');
        }
        const decode = jwtDecode(token);
        
        setFirstName(decode.firstName);
        setLastName(decode.lastName);
    }

    useEffect(() => {
        loadProfile();
    }, [])

    return (
        <View style={styles.containerFullName}>
            
            <Text style={styles.fullName}>{firstName} {lastName}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    fullName: {
        fontSize: 20,
        marginTop: 10,
        fontWeight: '600'
    },

    containerFullName: {
        alignItems: 'center'
    }
})

export default HomeScreen;