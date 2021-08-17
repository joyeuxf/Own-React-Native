import React from 'react';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { NewdeNavigator } from './NewdeNavigator';

const AppNavigator = props => {    
    return (
        <NavigationContainer
            theme={DarkTheme}
        >
            <NewdeNavigator />            
        </NavigationContainer>
    );
};

export default AppNavigator;