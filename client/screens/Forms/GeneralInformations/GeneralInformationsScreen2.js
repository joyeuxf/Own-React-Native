import React, { useState, useEffect, useRef } from 'react';
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
    Layout,
    CheckBox,
} from '@ui-kitten/components';

import helpers from '../../../utils/KeyboardUtils';

import { useDispatch, useSelector } from 'react-redux';
import { Formik } from 'formik'
import * as yup from 'yup';
import GeneralInformationsMessages from '../../../constants/GeneralInformationsMessages';
import * as authActions from '../../../redux/actions/authActions';

import AutoCompleteComp from '../../../components/AutoCompleteComp';
import CITIES from '../../../data/dataCities.js';

const formSchema = yup.object({

    ethnie: yup.array()
        .min(1, GeneralInformationsMessages.ERROR_ETHNIE_MIN)
        .max(2, GeneralInformationsMessages.ERROR_ETHNIE_MAX)
        .required(),

    city: yup.string().required(GeneralInformationsMessages.ERROR_CITY),
})

const marginLeftPoucentage = '10%';

const GeneralInformationsScreen2 = navData => {
    const formikRef = useRef();
    const dataGeneralInformation = useSelector(state => state.auth.generalInformations2);
    const [firstLoaded, setFirstLoaded] = useState(true);
    const [searchCity, setCitySearch] = useState("");
    
    const init = (props) => {
        if (Object.keys(dataGeneralInformation).length !== 0) {
            const copy = [...ethnie];
            for (let i = 0; i < dataGeneralInformation.ethnie.length; i++) {
                const elem = copy.find(x => x.id == dataGeneralInformation.ethnie[i].id);
                elem.checked = dataGeneralInformation.ethnie[i].checked;
            }
            const checkedByUser = copy.filter(c => c.checked);

            if (formikRef) {
                formikRef.current.setFieldValue('ethnie', checkedByUser);
                formikRef.current.setFieldValue('city', dataGeneralInformation.city);
            }
        }
    }

    useEffect(() => {
        formikRef.current.setFieldValue('isValid', false);
        init();
    }, [])


    const [initialValues, setInitialValues] = useState({
        city: "",
        ethnie: dataGeneralInformation.ethnie,
    });

    const [ethnie, setEthnie] = useState([
        {
            id: 1,
            title: GeneralInformationsMessages.EUROPEAN_ETHNIE,
            checked: false,
        },
        {
            id: 2,
            title: GeneralInformationsMessages.MAGREB_ETHNIE,
            checked: false,
        },
        {
            id: 3,
            title: GeneralInformationsMessages.METISSSE_ETHNIE,
            checked: false,
        },
        {
            id: 4,
            title: GeneralInformationsMessages.LATINO_ETHNIE,
            checked: false,
        },
        {
            id: 5,
            title: GeneralInformationsMessages.AFRO_ETHNIE,
            checked: false,
        },
        {
            id: 6,
            title: GeneralInformationsMessages.ASIATIQUE_ETHNIE,
            checked: false,
        },
        {
            id: 7,
            title: GeneralInformationsMessages.EURASIENNE_ETHNIE,
            checked: false,
        },
        {
            id: 8,
            title: GeneralInformationsMessages.ANTILLAISE_ETHNIE,
            checked: false,
        },

    ]);

    const modifyEthenie = (id, props) => {
        helpers.dismissKeyboard();
        const copy = [...ethnie];
        const elem = copy[id - 1];
        elem.checked = !elem.checked;
        setEthnie(copy);
        const checkedByUser = copy.filter(c => c.checked);
        props.setFieldValue('ethnie', checkedByUser);
    }

    const getSelectedCity = (city) => {                
        setCitySearch(city.zipCode + " - " + helpers.capitalize(city.name));
        formikRef.current.setFieldValue('city', city.zipCode + " - " + helpers.capitalize(city.name));
        setFirstLoaded(false);
    }

    const ClearText = () => { 
        setCitySearch("");        
        formikRef.current.setFieldValue('city', "");        
    }

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
            style={{ flex: 1 }}>
            <Formik
                innerRef={formikRef}
                initialValues={initialValues}
                validationSchema={formSchema}
                enableReinitialize
                onSubmit={async (values) => {
                    console.log(values);
                    dispatch(authActions.saveGeneralInformations2(values));
                    navData.navigation.navigate('GeneralInformationsScreen3');
                }}
            >
                {(props) => (

                    <ScrollView
                        keyboardShouldPersistTaps="always"
                        style={styles.scrollview}>

                        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                            <Layout style={styles.container} level='1'>

                                <View style={styles.content}>
                                    <Text style={styles.text}>{GeneralInformationsMessages.TITLE_ETHNIE}</Text>
                                    {
                                        props.errors.ethnie &&  props.dirty && !firstLoaded  &&
                                        <Text style={styles.errorWithOffset}>{props.errors.ethnie}</Text>
                                    }
                                </View>
                                <View style={styles.ethnie}>
                                    {ethnie.map((et) => (
                                        <CheckBox
                                            key={et.id}
                                            checked={et.checked}
                                            onChange={() => modifyEthenie(et.id, props)}
                                            style={styles.itemEthnie}
                                        >
                                            {`${et.title}`}
                                        </CheckBox>
                                    ))}


                                </View>

                                <View style={{
                                    flex: 1
                                }}>
                                    {props.errors.city &&
                                        <Text style={styles.error}>{props.errors.city}</Text>
                                    }

                                    <AutoCompleteComp
                                        onSelectedCity={getSelectedCity}
                                        onChangedText={setCitySearch}
                                        onValue={searchCity}
                                        onAction={ClearText}
                                        onBlur={null}
                                        placeholder="City"
                                        placeholderTextColor="#fff"
                                        icon="clear"
                                        secureTextEntry={false}

                                    />
                                </View>

                                <View style={styles.centeredButton}>
                                    <TouchableOpacity
                                        disabled={!(props.isValid && props.dirty)}
                                        style={[!(props.isValid && props.dirty) ? styles.disabledbutton : styles.button]}
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

    /* Ethnie */
    ethnie: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        marginLeft: '8%',
        marginTop: 10
    },

    itemEthnie: {
        paddingTop: 10,
        paddingLeft: 11,
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
        justifyContent: 'flex-end',
        flex: 1,
        marginTop: '85%'
    },

    disabledbutton: {
        opacity: 0.2,
        width: 300,
        backgroundColor: "#7885AB",
        borderRadius: 25,
        marginVertical: 10,
        paddingVertical: 13,
        justifyContent: 'flex-end',
        flex: 1,
        marginTop: '85%'
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

    /* Error */
    errorWithOffset: {
        alignSelf: 'flex-start',
        color: 'red',
        marginTop: 10,
        marginLeft: 1
    },
})

export default GeneralInformationsScreen2;