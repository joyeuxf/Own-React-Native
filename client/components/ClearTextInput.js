import React from 'react';
import {
    View,
    StyleSheet,
    TextInput,
    TouchableHighlight,
    TouchableOpacity
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const ClearTextInput = props => {
    return (
        <View style={{...styles.parent, ...props.style}}>
            <TextInput
                clearTextOnFocus={false}
                style={{...styles.input, ...props.inputStyle}}
                placeholder={props.placeholder}
                placeholderTextColor={props.placeholderTextColor}
                keyboardType={props.keyboardType}
                onChangeText={props.onChangedText}
                value={props.onValue}
                onBlur={props.onBlur}
                secureTextEntry={props.secureTextEntry}
                returnKeyType="next"
                contextMenuHidden={true}
            />
            
            {  
            
            props.onValue.length > 0 &&
                <TouchableHighlight style={{...styles.closeButtonParent, ...props.closeButtonStyles}}>
                    <MaterialIcons
                        name={props.icon}
                        size={24}
                        color='#ffffff'
                        onPress={props.onAction}
                    />
                </TouchableHighlight>
            }
    
        </View>
    )
};


const styles = StyleSheet.create({
    parent: {
        width: 300,
        marginTop: 15,
        borderColor: '#fff',
        borderRadius: 25,
        borderWidth: 1,
        flexDirection: 'row',
    },

    input: {
        width: 250,
        padding: 20,
        borderRadius: 25,
        borderColor: '#fff',
        fontSize: 16,
        color: '#fff',

    },

    closeButtonParent: {
        justifyContent: 'center',
        marginLeft: 10,

    },
});

export default ClearTextInput;

