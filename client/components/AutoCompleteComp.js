import React, { useState, useEffect, useMemo } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    ScrollView
} from 'react-native';
import GeneralInformationsMessages from '../constants/GeneralInformationsMessages';
import helpers from '../utils/KeyboardUtils';
import CITIES from '../data/dataCities.js';
import ClearTextInput from '../components/ClearTextInput';

String.prototype.toSearch = function () {
    var chars = ['aáàãäâ', 'eéèëê', 'iíìïî', 'oóòõöô', 'uúùüû'],
        value = this;
    for (var i in chars) value = value.replace(new RegExp('[' + chars[i] + ']', 'g'), '[' + chars[i] + ']');
    return new RegExp(value);
};

String.prototype.toSearch = function () {
    var chars = ['aáàãäâ', 'eéèëê', 'iíìïî', 'oóòõöô', 'uúùüû'],
        value = this;
    for (var i in chars) value = value.replace(new RegExp('[' + chars[i] + ']', 'g'), '[' + chars[i] + ']');
    return new RegExp(value);
};

const AutoCompleteComp = props => {
    const [selectedCity, setSelectedCity] = useState('');

    const filteredData = useMemo(() => props.onValue
        ? CITIES.filter(p => p.name.toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, "")
        .replaceAll('-', ' ')
        .startsWith(props.onValue.toLocaleLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ""))).slice(0, 5)
        : [],
        [props.onValue]);
    
    const SelectedCity = (item) => {
        setSelectedCity(item);
        props.onSelectedCity(item);
        helpers.dismissKeyboard();
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.container}>

                <ClearTextInput
                    style={styles.searchTextInput}
                    onChangedText={props.onChangedText}
                    onValue={props.onValue}
                    onBlur={props.onBlur}
                    onAction={props.onAction}
                    placeholder={GeneralInformationsMessages.PLACEHOLDER_CITY}
                    placeholderTextColor="#fff"
                    icon="clear"
                    closeButtonStyles={styles.closeButtonStyle}
                />

                <ScrollView
                    keyboardShouldPersistTaps='handled'
                >
                    {filteredData.map((item, index) => (
                        <View key={index}>
                            <TouchableOpacity onPress={SelectedCity.bind(this, item)}>
                                <View style={styles.listItem}>
                                    <Text style={styles.listItemText}>{item.zipCode} - {helpers.capitalize(item.name)}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    ))}
                </ScrollView>

            </View>
        </SafeAreaView>
    )

};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginHorizontal: '10%'
    },
    listItem: {
        borderWidth: 0.5,
        borderColor: '#7885AB',
        width: '100%',
        borderRadius: 5,
        marginTop: 15,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center'
    },
    listItemText: {
        fontSize: 18,
        color: '#fff',
        borderRadius: 5,

    },
    searchTextInput: {
        fontSize: 18,
        color: '#fff',
        borderWidth: 2,
        borderColor: '#7885AB',
        marginTop: 20,
        width: '100%',
        borderRadius: 5,
    },

    closeButtonStyle: {
        marginLeft: 50,
    }
});


export default AutoCompleteComp;