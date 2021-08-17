import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    TouchableWithoutFeedback,
    Keyboard,
    ScrollView,
    TouchableOpacity,

} from 'react-native';

import {
    Radio,
    RadioGroup,
    Layout,
    CheckBox
} from '@ui-kitten/components';

import { useDispatch } from 'react-redux';
import { Formik } from 'formik'
import * as yup from 'yup';
import GeneralInformationsMessages from '../../../constants/GeneralInformationsMessages';

const formSchema = yup.object({
    
})

const marginLeftPoucentage = '10%';
const animals = [GeneralInformationsMessages.ANIMAL_YES, GeneralInformationsMessages.ANIMAL_NO, GeneralInformationsMessages.OPEN_TO_HAVE_ANIMALS];
const tabac = [GeneralInformationsMessages.TABAC_YES, GeneralInformationsMessages.TABAC_NO];

const GeneralInformationsScreen3 = navData => {

    const [initialValues, setInitialValues] = useState({

        familySituation: [],
        animals: animals[0],
        tabac: tabac[0],
        
    });
    
    const [familyStatus, setFamilyStatus] = useState([
        {
            id: 1,
            title: GeneralInformationsMessages.NO_CHILDREN,
            checked: false,
        },
        {
            id: 2,
            title: GeneralInformationsMessages.DONT_WANT_CHILDREN,
            checked: false,
        },
        {
            id: 3,
            title: GeneralInformationsMessages.HAVE_CHILDREN,
            checked: false,
        },
        {
            id: 4,
            title: GeneralInformationsMessages.WANT_CHILDREN,
            checked: false,
        }
    ]);
    const [selectedIndexAnimals, setSelectedIndexAnimal] = useState(0);
    const [selectedIndexTabac, setSelectedIndexTabac] = useState(0);

    const [isLoading, setIsLoading] = useState(false);    
    const dispatch = useDispatch();

    const modifyFamilySituation = (id, props) => {
        const copy = [...familyStatus];
        const elem = copy[id - 1];
        elem.checked = !elem.checked;

        if (elem.title == GeneralInformationsMessages.WANT_CHILDREN) {
            copy.find(wc => wc.title == GeneralInformationsMessages.DONT_WANT_CHILDREN).checked = false;
        }

        if (elem.title == GeneralInformationsMessages.DONT_WANT_CHILDREN) {
            copy.find(wc => wc.title == GeneralInformationsMessages.WANT_CHILDREN).checked = false;
        }

        if (elem.title == GeneralInformationsMessages.HAVE_CHILDREN) {
            copy.find(wc => wc.title == GeneralInformationsMessages.NO_CHILDREN).checked = false;
        }

        if (elem.title == GeneralInformationsMessages.NO_CHILDREN) {
            copy.find(wc => wc.title == GeneralInformationsMessages.HAVE_CHILDREN).checked = false;
        }

        setFamilyStatus(copy);
        const checkedByUser = copy.filter(c => c.checked);

        props.setFieldValue('familySituation', checkedByUser);

    }

    const updateSelectIndexAnimals = (index, props) => {
        setSelectedIndexAnimal(index);
        props.setFieldValue('animals', animals[index]);
    }

    const updateSelectIndexTabac = (index, props) => {
        setSelectedIndexTabac(index);
        props.setFieldValue('tabac', tabac[index]);
    }

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
            style={{ flex: 1 }}>
            <Formik
                initialValues={initialValues}
                validationSchema={formSchema}
                enableReinitialize
                onSubmit={async (values) => {
                    values.date = date.toLocaleDateString();
                    console.log(values);
                    navData.navigation.navigate('SexeInformationsScreen');
                }}
            >
                {(props) => (

                    <ScrollView
                        keyboardShouldPersistTaps="always"
                        style={styles.scrollview}>

                        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                            <Layout style={styles.container} level='1'>
                              
                                <View style={styles.content}>
                                    <Text style={styles.text}>{GeneralInformationsMessages.TITLE_FAMILY_STATUS}</Text>
                                </View>
                                <View style={styles.familyStatus}>
                                    {familyStatus.map((fs) => (
                                        <CheckBox
                                            key={fs.id}
                                            checked={fs.checked}
                                            onChange={() => modifyFamilySituation(fs.id, props)}
                                            style={styles.itemFamilyStatus}
                                        >
                                            {`${fs.title}`}
                                        </CheckBox>
                                    ))}
                                </View>

                                <View style={styles.content}>
                                    <Text style={styles.text}>{GeneralInformationsMessages.TITLE_ANIMAL}</Text>
                                    <RadioGroup style={styles.radioGroup}
                                        selectedIndex={selectedIndexAnimals}
                                        onChange={index => updateSelectIndexAnimals(index, props)}>
                                        <Radio>{animals[0]}</Radio>
                                        <Radio>{animals[1]}</Radio>
                                        <Radio>{animals[2]}</Radio>
                                    </RadioGroup>
                                </View>

                                <View style={styles.content}>
                                    <Text style={styles.text}>{GeneralInformationsMessages.TITLE_TABAC}</Text>
                                    <RadioGroup style={styles.radioGroup}
                                        selectedIndex={selectedIndexTabac}
                                        onChange={index => updateSelectIndexTabac(index, props)}>
                                        <Radio>{tabac[0]}</Radio>
                                        <Radio>{tabac[1]}</Radio>
                                    </RadioGroup>
                                </View>

                                <View style={styles.centeredButton}>
                                    <TouchableOpacity
                                        style={styles.button}
                                        onPress={props.handleSubmit}>
                                        <Text style={styles.buttonText}>{GeneralInformationsMessages.NEXT}</Text>
                                    </TouchableOpacity>
                                </View>
                            </Layout>

                        </TouchableWithoutFeedback>
                    </ScrollView>
                )}
            </Formik>
        </KeyboardAvoidingView>
    )

}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: "#0D131F",
    },

    /* Family Status */

    familyStatus: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap-reverse',
        alignItems: 'flex-start',
        marginLeft: ' 6%',
        marginTop: 10,
        width: '80%',
    },

    itemFamilyStatus: {
        paddingTop: 10,
        paddingLeft: 20,
        width: '50%',
    },


    /* Error */
    error: {
        alignSelf: 'flex-start',
        color: 'red',
        marginTop: 20,
        marginLeft: marginLeftPoucentage
    },

    /* Spinner */
    centered: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0D131F',
    },

    /* General */
    content: {
        alignSelf: 'flex-start',
        marginLeft: marginLeftPoucentage,
        marginTop: 10
    },
    scrollview: {
        backgroundColor: '#0D131F'
    },

    centeredButton: {
        alignItems: 'center'
    },

    button: {
        width: 300,
        backgroundColor: "#7885AB",
        borderRadius: 25,
        marginVertical: 10,
        paddingVertical: 13,
        marginTop: 100,
    },

    buttonText: {
        fontSize: 16,
        fontWeight: "500",
        color: "#ffffff",
        textAlign: "center",
    },

    rowContainer: {
        flexDirection: 'row',
        marginTop: 15,
        marginLeft: marginLeftPoucentage,
        marginRight: marginLeftPoucentage
    },

    text: {
        color: '#fff',
        marginTop: 10,
        padding: 2,
        fontWeight: 'bold',
        fontSize: 14,
        color: '#E8DCB9'
    },

    radioGroup: {
        flexDirection: 'row',
        paddingTop: 15,
        marginLeft: '1%'
    },


})

export default GeneralInformationsScreen3;