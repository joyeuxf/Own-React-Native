import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    Keyboard,
    Alert,
    ActivityIndicator
} from 'react-native';

import ClearTextInput from '../components/ClearTextInput';
import * as yup from 'yup';
import { Formik } from 'formik'
import Messages from '../constants/LoginMessages';
import { useDispatch } from 'react-redux';
import * as authActions from '../redux/actions/authActions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoginMessages from '../constants/LoginMessages';

const formSchema = yup.object({
    email: yup.string().email(Messages.EMAIL_ERROR).required(Messages.EMAIL_REQUIRED_ERROR),
    password: yup.string().required(Messages.PASSWORD_REQUIRED_ERROR).min(8, Messages.PASSWORD_ERROR)
})

const LoginScreen = navData => {
    const dispatch = useDispatch();

    const [showPassword, setShowPassword] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    if (isLoading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size='large' color="#BFD1E5" />
            </View>
        )
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.keyboard}
        >
            <Formik
                initialValues={{
                    email: "joyeuxflorian@gmail.com",
                    password: "Floinfo540",
                }}
                validationSchema={formSchema}
                onSubmit={async (values, actions) => {
                    setIsLoading(true);
                    const result = await dispatch(authActions.login(values));
                    
                    if (result.success) {
                        try {
                            await AsyncStorage.setItem('token', result.token);                            
                        }

                        catch {
                            setIsLoading(false);
                            Alert.alert(LoginMessages.ISSUE_TRIGGER);
                        }
                        
                    } else {
                        setIsLoading(false);
                        Alert.alert(result.message);
                    }
                }}
            >
                {(props) => (
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View style={styles.container}>
                            <View style={styles.containerInside}>

                                <ClearTextInput
                                    onChangedText={props.handleChange('email')}
                                    onValue={props.values.email}
                                    onBlur={props.handleBlur('email')}
                                    onAction={() => props.setFieldValue('email', '')}
                                    placeholder="Adresse email"
                                    keyboardType="email-address"
                                    placeholderTextColor="#fff"
                                    secureTextEntry={false}
                                    icon="clear"
                                />

                                <Text style={styles.error}>{props.touched.email && props.errors.email}</Text>


                                <ClearTextInput
                                    onChangedText={props.handleChange('password')}
                                    onValue={props.values.password}
                                    onBlur={props.handleBlur('password')}
                                    onAction={() => setShowPassword(!showPassword)}
                                    placeholder="Mot de passe"
                                    placeholderTextColor="#fff"
                                    secureTextEntry={showPassword ? true : false}
                                    icon={showPassword ? "visibility" : "visibility-off"}
                                />


                                <Text style={styles.error}>{props.touched.password && props.errors.password}</Text>

                                <TouchableOpacity style={styles.button}
                                    onPress={props.handleSubmit}>
                                    <Text style={styles.buttonText}>Se connecter</Text>
                                </TouchableOpacity>

                                <View style={styles.registerContainer}>
                                    <Text style={styles.registerText}>Pas de compte ?</Text>
                                    <TouchableOpacity onPress={() => {
                                        props.resetForm();
                                        navData.navigation.navigate('Register')
                                    }}>
                                        <Text style={styles.registerButton}>Je m'inscris</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                )}

            </Formik>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({

    input: {
        width: 250,
        padding: 20,
        borderRadius: 25,
        borderColor: '#fff',
        fontSize: 16,
        color: '#fff',

    },
    keyboard: {
        flex: 1,
        bottom: 0
    },

    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#0D131F"
    },

    button: {
        backgroundColor: "#7885AB",
        marginLeft: 15,
        marginRight: 15,
        borderRadius: 25,
        marginVertical: 10,
        paddingVertical: 13,
        marginTop: 60
    },

    buttonText: {
        fontSize: 16,
        fontWeight: "500",
        color: "#ffffff",
        textAlign: "center",
    },

    registerContainer: {
        alignItems: "flex-end",
        justifyContent: "center",
        paddingVertical: 16,
        flexDirection: "row",
    },

    registerText: {
        color: "#fff",
        fontSize: 16,
    },

    registerButton: {
        color: '#E8DCB9',
        fontSize: 16,
        fontWeight: "bold",
        paddingLeft: 10
    },

    error: {
        marginTop: 15,
        marginLeft: 15,
        color: '#E8DCB9'
    },

    centered: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0D131F',
    }
});

export default LoginScreen;
