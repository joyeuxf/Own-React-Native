import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,    
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    Alert,
    ActivityIndicator,
    TouchableWithoutFeedback,
    Keyboard,
    ScrollView
} from 'react-native';
import { useDispatch } from 'react-redux';
import { Formik } from 'formik'
import * as yup from 'yup';
import * as authActions from '../redux/actions/authActions';
import Messages from '../constants/RegisterMessages';
import ClearTextInput from '../components/ClearTextInput';

// const phoneRegExp = /(\b(0041|0)|\B\+41)(\s?\(0\))?(\s)?[1-9]{2}(\s)?[0-9]{3}(\s)?[0-9]{2}(\s)?[0-9]{2}\b/
var phoneRegExp = /^\+(?:[0-9] ?){6,14}[0-9]$/;

const formSchema = yup.object({
    firstName: yup.string().required(Messages.FISRTNAME_REQUIRED_ERROR).min(3, Messages.FIRSTNAME_ERROR),
    lastName: yup.string().required(Messages.LASTNAME_REQUIRED_ERROR).min(3, Messages.LASTNAME_ERROR),
    email: yup.string().email(Messages.EMAIL_ERROR).required(Messages.EMAIL_REQUIRED_ERROR),
    password: yup.string().required(Messages.PASSWORD_REQUIRED_ERROR).min(8, Messages.PASSWORD_ERROR),
    phoneNumber: yup.string().required(Messages.PHONE_NUMBER_REQUIRED).matches(phoneRegExp, Messages.PHONE_NUMBER_ERROR_FORMAT)
        .min(10, Messages.PHONE_NUMBER_ERROR_MIN)
})


const RegisterScreen = navData => {
    
    const [initialValues, setInitialValues] = useState({
        firstName: "Florian",
        lastName: "Joyeux",
        email: "joyeuxflorian@gmail.com",
        password: "Floinfo540",
        phoneNumber: "+33626288407"
    });

    const showAlertSendSmsFail = (result) => {
        Alert.alert(
            Messages.TITLE_NEWDE_CONTACT,
            result.message,
            [
              { text: "OK", onPress: () => {
                navData.navigation.navigate('Register');
                setIsLoading(false);
              }}
            ]
          );
    }

    const [showPassword, setShowPassword] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();

    if (isLoading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size='large' color="#BFD1E5" />
            </View>
        )
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : ""}
            style={styles.keyboard}
        >
            <Formik
                initialValues={initialValues}
                validationSchema={formSchema}
                enableReinitialize
                onSubmit={async (values) => {
                    setIsLoading(true);
                    dispatch(authActions.checkUserExist(values))
                        .then(result => {
                            setIsLoading(false);
                            if (result.success) {                                
                                setIsLoading(true);
                                dispatch(authActions.getSms(values))
                                    .then(result => {                                        
                                        if (!result.success) {
                                            setIsLoading(false);
                                            showAlertSendSmsFail(result);
                                        }
                                        else {
                                            setIsLoading(false);
                                            navData.navigation.navigate('SmsScreen', {
                                                result: result
                                            });
                                        }

                                    })
                                    .catch(() => {
                                        setIsLoading(false);
                                        Alert.alert('An error occured during sms sending. Try Again', [{ text: 'OK' }]);
                                    });
                            } else {
                                Alert.alert(result.message);
                                initialValues.firstName = values.firstName;
                                initialValues.lastName = values.lastName;
                                initialValues.email = values.email;
                                initialValues.password = "";
                                initialValues.phoneNumber = values.phoneNumber;
                            }
                        })
                        .catch(() => {
                            setIsLoading(false);
                            Alert.alert('An error occured during check user exist. Try Again', [{ text: 'OK' }]);
                        })
                        
                }}
            >
                {(props) => (

                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
                        keyboardShouldPersistTaps="always"
                    >
                        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                            <View style={styles.container}>

                                <View style={styles.containerInside}>

                                    <ClearTextInput
                                        onChangedText={props.handleChange('firstName')}
                                        onValue={props.values.firstName}
                                        onBlur={props.handleBlur('firstName')}
                                        onAction={() => props.setFieldValue('firstName', '')}
                                        placeholder="Prénom"
                                        placeholderTextColor="#fff"
                                        secureTextEntry={false}
                                        icon="clear"
                                    />

                                    <Text style={styles.error}>{props.touched.firstName && props.errors.firstName}</Text>

                                    <ClearTextInput
                                        onChangedText={props.handleChange('lastName')}
                                        onValue={props.values.lastName}
                                        onBlur={props.handleBlur('lastName')}
                                        onAction={() => props.setFieldValue('lastName', '')}
                                        placeholder="Nom"
                                        placeholderTextColor="#fff"
                                        secureTextEntry={false}
                                        icon="clear"
                                    />

                                    <Text style={styles.error}>{props.touched.lastName && props.errors.lastName}</Text>

                                    <ClearTextInput
                                        onChangedText={props.handleChange('email')}
                                        onValue={props.values.email}
                                        onBlur={props.handleBlur('email')}
                                        onAction={() => props.setFieldValue('email', '')}
                                        placeholder="Adresse mail"
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


                                    <ClearTextInput
                                        onChangedText={props.handleChange('phoneNumber')}
                                        onValue={props.values.phoneNumber}
                                        onBlur={props.handleBlur('phoneNumber')}
                                        onAction={() => props.setFieldValue('phoneNumber', '')}
                                        keyboardType="phone-pad"
                                        placeholder="Numéro de téléphone"
                                        placeholderTextColor="#fff"
                                        secureTextEntry={false}
                                        icon="clear"
                                    />

                                    <Text style={styles.error}>{props.touched.phoneNumber && props.errors.phoneNumber}</Text>

                                    <TouchableOpacity
                                        style={styles.button}
                                        onPress={props.handleSubmit}>
                                        <Text style={styles.buttonText}>S'inscrire</Text>
                                    </TouchableOpacity>

                                    <View style={styles.registerContainer}>
                                        <Text style={styles.registerText}>Déjà un compte ?</Text>
                                        <TouchableOpacity onPress={() => navData.navigation.navigate('Login')}>
                                            <Text style={styles.registerButton}>Connexion</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </ScrollView>
                )}

            </Formik>
        </KeyboardAvoidingView>

    )

}

const styles = StyleSheet.create({

    keyboard: {
        flex: 1,
    },

    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#0D131F"
    },

    button: {
        width: 300,
        backgroundColor: "#7885AB",
        borderRadius: 25,
        marginVertical: 10,
        paddingVertical: 13,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: "500",
        color: "#ffffff",
        textAlign: "center",
    },

    input: {
        width: 300,
        borderWidth: 1,
        borderColor: '#fff',
        borderRadius: 25,
        padding: 16,
        fontSize: 16,
        marginVertical: 10,
        color: '#fff',
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
        color: 'red'
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
})

export default RegisterScreen;