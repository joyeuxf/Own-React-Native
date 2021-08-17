import React, { useState, useCallback } from 'react';
import {
    View,
    StyleSheet,
    Alert,
    Text,
    ActivityIndicator,
    SafeAreaView,
    Button
} from 'react-native';

import AnimatedCodeInput from "@brainsbeards/react-native-animated-code-input";
import { useDispatch } from 'react-redux';
import * as authActions from '../redux/actions/authActions';
import SmsMessages from '../constants/SmsMessages';
import { MaterialIcons } from '@expo/vector-icons';

const SmsScreen = navData => {
    const infosUser = navData.route.params.result;
    const [isLoading, setIsLoading] = useState(false);
    const [code, setCode] = useState("");
    const dispatch = useDispatch();

    const onChangeText = useCallback((text) => {
        setCode(text);
    }, []);

    const onSubmit = useCallback((codeValue) => {
        checkCodeSMS(codeValue);
        setCode("");
    }, []);


    const checkCodeSMS = (value) => {
        setIsLoading(true);        
        dispatch(authActions.checkSMS(infosUser, value))
            .then(async result => {
                if (result.success) {
                    Alert.alert(
                        SmsMessages.SEND_EMAIL,
                        SmsMessages.SEND_EMAIL_INFORMATIONS,
                        [
                            {
                                text: "OK", onPress: () => {

                                    navData.navigation.navigate('Login');
                                    setIsLoading(false);
                                }
                            }
                        ]
                    );
                } else {
                    Alert.alert(
                        SmsMessages.ERROR_CHECK_SMS,
                        result.message,
                        [
                            {
                                text: "OK", onPress: () => {
                                    navData.navigation.navigate('SmsScreen');
                                    setIsLoading(false);
                                }
                            }
                        ]
                    );
                }
            })
            .catch(() => {
                setIsLoading(false);
                Alert.alert(
                    SmsMessages.ERROR_CHECK_SMS,
                    ""
                    [
                        {
                            text: "OK", onPress: () => {

                                navData.navigation.navigate('SmsScreen');
                                setIsLoading(false);
                            }
                        }
                    ]
                );
            })
    }


    const showAlertSendSmsFail = (result, message) => {
        Alert.alert(
            message,
            result.message,
            [
              { text: "OK", onPress: () => {
                navData.navigation.navigate('SmsScreen');
                setIsLoading(false);
              }}
            ]
          );
    }

    const resendSmsCode = () => {
        
        setIsLoading(true);
       
        dispatch(authActions.cancelSMS(infosUser.data.requestId))
            .then(async result => {
                
                const authData = { 
                    firstName: infosUser.data.firstName,
                    lastName: infosUser.data.lastName,
                    email: infosUser.data.email,
                    password: infosUser.data.password,
                    phoneNumber: infosUser.data.phoneNumber,
                }

                if (!result.success) {                
                    setIsLoading(false);
                    Alert.alert(
                        SmsMessages.ERROR_RESEND_SMS,
                        result.message,
                        [
                            {
                                text: "OK", onPress: () => {

                                    navData.navigation.navigate('SmsScreen');
                                    setIsLoading(false);
                                }
                            }
                        ]
                    );                    
                } else {
                    dispatch(authActions.getSms(authData))
                    .then(result => {
                        if (!result.success) {
                            setIsLoading(false);
                            showAlertSendSmsFail(result, SmsMessages.WRONG_SMS);
                        }
                        else {                            
                            setIsLoading(false);
                            Alert.alert(
                                SmsMessages.SMS_RESEND,
                                "",
                                [
                                    {
                                        text: "OK", onPress: () => {
                                            setIsLoading(false);
                                            navData.navigation.navigate('SmsScreen');
                                            infosUser.data.requestId = result.data.requestId;
                                        }
                                    }
                                ]
                            );                            
                            
                        }
    
                    })
                    .catch(() => {
                        setIsLoading(false);
                        Alert.alert(
                            SmsMessages.WRONG_SMS,
                            "",
                            [
                                {
                                    text: "OK", onPress: () => {
        
                                        navData.navigation.navigate('SmsScreen');
                                        setIsLoading(false);
                                    }
                                }
                            ]
                        ); 
                    });
                }
               
            })
            .catch(() => {
                Alert.alert(
                    SmsMessages.ERROR_RESEND_SMS,
                    "",
                    [
                        {
                            text: "OK", onPress: () => {
                                navData.navigation.navigate('SmsScreen');
                                setIsLoading(false);
                            }
                        }
                    ]
                );                   
                setIsLoading(false);
            });
    }

    if (isLoading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size='large' color="#BFD1E5" />
            </View>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.containerText}>
                <MaterialIcons size={30} color="#fff" name="lock" />
                <Text style={styles.contentText}>{SmsMessages.TITLE_SCREEN}</Text>

            </View>
            <View style={styles.containerCode}>
                <AnimatedCodeInput
                    value={code}
                    numberOfInputs={4}
                    onChangeText={onChangeText}
                    onSubmitCode={onSubmit}
                    textColor={"white"}
                    cursorStyle={styles.cursorStyle}
                    activeCodeContainerStyle={{
                        customStyle: styles.customActiveCodeContainer,
                    }}
                    codeContainerStyle={{ customStyle: styles.customCodeContainer }}
                />
            </View>

            <Button color="#E8DCB9" title={SmsMessages.BUTTON_RESEND} onPress={resendSmsCode} />
        </SafeAreaView>
    )
};

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#0D131F'
    },

    containerCode: {
        justifyContent: 'center',
        marginTop: '45%',
        padding: '10%'
    },

    containerText: {
        marginTop: 50,
        alignItems: 'center',
    },

    contentText: {
        marginTop: 30,
        color: '#fff',
        fontSize: 20
    },

    cursorStyle: {
        color: '#fff',
    },

    customCodeContainer: {
        backgroundColor: "#0D131F",
        color: "#c1cefa",
        borderColor: '#0D131F',
        borderBottomColor: '#fff',
        borderRadius: 0
    },
    customActiveCodeContainer: {
        backgroundColor: "#0D131F",
        borderColor: '#0D131F',
        borderBottomColor: '#fff',
        borderRadius: 0
    },

    centered: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0D131F'
    }

});

export default SmsScreen;