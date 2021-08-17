import React from 'react';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import SmsScreen from '../screens/SmsScreen';
import GeneralInformationsScreen from '../screens/Forms/GeneralInformations/GeneralInformationsScreen';
import GeneralInformationsScreen2 from '../screens/Forms/GeneralInformations/GeneralInformationsScreen2';
import GeneralInformationsScreen3 from '../screens/Forms/GeneralInformations/GeneralInformationsScreen3';
import GeneralInformationsMessage from '../constants/GeneralInformationsMessages';
import { useSelector, useDispatch } from 'react-redux';
import * as authActions from '../redux/actions/authActions';
import HeaderButton from '../components/HeaderButton';
import { Platform } from 'react-native';

const AuthStackNavigator = createStackNavigator();
export const AuthNavigator = () => {
    return (
        <AuthStackNavigator.Navigator>
            <AuthStackNavigator.Screen
                name="Login"
                component={LoginScreen}
                options={({ navigation, route }) => ({
                    headerShown: false,
                    headerBackTitle: () => null,
                    headerTintColor: 'white',
                    headerStyle: {
                        backgroundColor: '#0D131F'
                    },

                })}
            />

            <AuthStackNavigator.Screen
                name="Register"
                component={RegisterScreen}
                options={({ navigation, route }) => ({

                    headerTintColor: 'white',
                    headerStyle: {
                        backgroundColor: '#0D131F'
                    },

                })}
            />

            <AuthStackNavigator.Screen
                name="SmsScreen"
                component={SmsScreen}
            />

        </AuthStackNavigator.Navigator>
    )
};



const NewdeStackNavigator = createStackNavigator();
export const NewdeNavigator = () => {
    const isAuth = useSelector(state => state.auth.user);

    return (
        <NewdeStackNavigator.Navigator>
            {!isAuth.token ? (
                <NewdeStackNavigator.Screen
                    name="AuthNavigator"
                    component={AuthNavigator}
                    options={({ navigation, route }) => ({
                        headerShown: false,
                        title: GeneralInformationsMessage.CREATE_ACCOUNT,
                        headerTintColor: 'white',
                        headerStyle: {
                            backgroundColor: '#0D131F'
                        },

                    })}

                />
            ) : (

                <NewdeStackNavigator.Screen
                    name="RouteLogin"
                    component={RouteLogin}
                    options={({ navigation, route }) => ({
                        headerShown: false,
                        title: GeneralInformationsMessage.CREATE_ACCOUNT,
                        headerTintColor: 'white',
                        headerStyle: {
                            backgroundColor: '#0D131F'
                        }
                    })}

                />
            )}


        </NewdeStackNavigator.Navigator>
    )
};

const RouteLoginStackNavigator = createStackNavigator();
export const RouteLogin = () => {
    const user = useSelector(state => state.auth.user);
    return (
        <RouteLoginStackNavigator.Navigator>
            {user.firstConnection ? (
                <RouteLoginStackNavigator.Screen
                    name="FormsNavigator"
                    component={FormsNavigator}
                    options={({ navigation, route }) => ({
                        headerShown: false,
                        title: GeneralInformationsMessage.CREATE_ACCOUNT,
                        headerTintColor: 'white',
                        headerStyle: {
                            backgroundColor: '#0D131F'
                        },
                    })}
                />

            ) : (
                <RouteLoginStackNavigator.Screen
                    name="HomeNavigator"
                    component={HomeNavigator}
                    options={{
                        headerShown: false,
                        title: GeneralInformationsMessage.CREATE_ACCOUNT,
                        headerTintColor: 'white',
                        headerBackTitle: () => null,
                        headerStyle: {
                            backgroundColor: '#0D131F'
                        },
                    }}
                />
            )}

        </RouteLoginStackNavigator.Navigator>
    )
}


const FormsStackNavigator = createStackNavigator();
export const FormsNavigator = () => {
    const dispatch = useDispatch();
    return (
        <FormsStackNavigator.Navigator>

             <FormsStackNavigator.Screen
                name="GeneralInformationsScreen"
                component={GeneralInformationsScreen}
                options={({ navigation, route }) => ({
                    headerShown: true,
                    title: GeneralInformationsMessage.CREATE_ACCOUNT,
                    headerTintColor: 'white',
                    headerStyle: {
                        backgroundColor: '#0D131F'
                    },

                    headerLeft: () => (
                        <HeaderButtons HeaderButtonComponent={HeaderButton}>
                            <Item
                                title="Header"
                                iconName={Platform.OS === 'ios' ? 'chevron-back-outline' : 'arrow-back'}
                                onPress={() => {
                                    dispatch(authActions.logout())
                                }}
                            />
                        </HeaderButtons>
                    ),
                })}
            /> 

            <FormsStackNavigator.Screen
                name="GeneralInformationsScreen2"
                component={GeneralInformationsScreen2}
                options={({ navigation, route }) => ({
                    headerShown: true,
                    title: GeneralInformationsMessage.CREATE_ACCOUNT,
                    headerTintColor: 'white',
                    headerStyle: {
                        backgroundColor: '#0D131F'
                    },
                    headerLeft: () => (
                        <HeaderButtons HeaderButtonComponent={HeaderButton}>
                            <Item
                                title="Header"
                                iconName={Platform.OS === 'ios' ? 'chevron-back-outline' : 'arrow-back'}
                                onPress={() => {
                                    navigation.navigate(GeneralInformationsScreen);
                                }}
                            />
                        </HeaderButtons>
                    ),
                })}
            />

            <FormsStackNavigator.Screen
                name="GeneralInformationsScreen3"
                component={GeneralInformationsScreen3}
                options={({ navigation, route }) => ({
                    headerShown: true,
                    title: GeneralInformationsMessage.CREATE_ACCOUNT,
                    headerTintColor: 'white',
                    headerStyle: {
                        backgroundColor: '#0D131F'
                    },
                    headerLeft: () => (
                        <HeaderButtons HeaderButtonComponent={HeaderButton}>
                            <Item
                                title="Header"
                                iconName={Platform.OS === 'ios' ? 'chevron-back-outline' : 'arrow-back'}
                                onPress={() => {
                                    navigation.navigate(GeneralInformationsScreen2);
                                }}
                            />
                        </HeaderButtons>
                    ),
                })}
            />

        </FormsStackNavigator.Navigator>
    )
};


const HomeStackNavigator = createStackNavigator();
export const HomeNavigator = () => {
    return (
        <HomeStackNavigator.Navigator>
            <HomeStackNavigator.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    headerLeft: null
                }}
            />
        </HomeStackNavigator.Navigator>
    )
};