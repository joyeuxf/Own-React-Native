import React, { useState, useEffect } from 'react';
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
    TextInput,
    TouchableOpacity,

} from 'react-native';

import {
    Radio,
    RadioGroup,
    Datepicker,
    Layout,
    CheckBox,
    NativeDateService,
} from '@ui-kitten/components';

import { useDispatch, useSelector } from 'react-redux';
import { Formik } from 'formik'
import * as yup from 'yup';
import GeneralInformationsMessages from '../../../constants/GeneralInformationsMessages';
import moment from 'moment';
import * as authActions from '../../../redux/actions/authActions';

const i18n = {
    dayNames: {
        short: ['Dim', 'Lu', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
        long: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
    },
    monthNames: {
        short: ['Jan', 'Fév', 'Mars', 'Apr', 'Mai', 'Juin', 'Juill', 'Août', 'Sept', 'Oct', 'Nov', 'Déc'],
        long: [
            'Janvier',
            'Février',
            'Маrs',
            'Аvril',
            'Мai',
            'Juin',
            'Juillet',
            'Аoût',
            'Septembre',
            'Оctobre',
            'Novembre',
            'Décembre',
        ],
    },
};

const formSchema = yup.object({
    height: yup.number().required(GeneralInformationsMessages.ERROR_HEIGHT).min(120, GeneralInformationsMessages.ERROR_HEIGHT_MIN).max(240, GeneralInformationsMessages.ERROR_HEIGHT_MAX),
    weight: yup.number().required(GeneralInformationsMessages.ERROR_WEIGHT).min(30, GeneralInformationsMessages.ERROR_WEIGHT_MIN).max(200, GeneralInformationsMessages.ERROR_WEIGHT_MAX),
    date: yup.string().nullable(false).required(GeneralInformationsMessages.ERROR_FORMAT_DATE),
    sexualOrientation: yup.array().min(1, GeneralInformationsMessages.ERROR_SEXUAL_ORIENTATION_MIN).required(),
})

const marginLeftPoucentage = '10%';
const genres = [GeneralInformationsMessages.NEUTRE, GeneralInformationsMessages.WOMANS, GeneralInformationsMessages.MENS];
const localeDateService = new NativeDateService('fr', { i18n, startDayOfWeek: 1 });


const GeneralInformationsScreen = navData => {

    const dataGeneralInformation = useSelector(state => state.auth.generalInformations);

    useEffect(() => {
        calculateMaxDate();
    }, [])

    const [initialValues, setInitialValues] = useState({
        genre: genres[0],
        height: "",
        weight: "",
        date: undefined,
        sexualOrientation: [],
    });

    const minDate = new Date(1929, 12, 1);
    const [maxDate, setMaxDate] = useState();
    const [firstLoaded, setFirstLoaded] = useState(true);
    const [selectedIndexGenre, setSelectedIndexGenre] = useState(0);
    const [sexualOrientation, setSexualOrientation] = useState([
        {
            id: 1,
            title: GeneralInformationsMessages.ASEXUEL,
            checked: false,
        },
        {
            id: 2,
            title: GeneralInformationsMessages.BISEXUEL,
            checked: false,
        },
        {
            id: 3,
            title: GeneralInformationsMessages.GAYS,
            checked: false,
        },
        {
            id: 4,
            title: GeneralInformationsMessages.HETERO,
            checked: false,
        },
        {
            id: 5,
            title: GeneralInformationsMessages.LESBIENS,
            checked: false,
        },
        {
            id: 6,
            title: GeneralInformationsMessages.PANSEXUEL,
            checked: false,
        },
        {
            id: 7,
            title: GeneralInformationsMessages.POLYSEXUEL,
            checked: false,
        },
        {
            id: 8,
            title: GeneralInformationsMessages.SAPIOSEXUEL,
            checked: false,
        },
        {
            id: 9,
            title: GeneralInformationsMessages.TRANSGENRES,
            checked: false,
        },

        {
            id: 10,
            title: GeneralInformationsMessages.TRASVESTI,
            checked: false,
        },

    ]);

    const [isLoading, setIsLoading] = useState(false);
    const [date, setDate] = useState();
    const dispatch = useDispatch();

    const updateSelectIndexGenre = (index, props) => {
        setSelectedIndexGenre(index);
        props.setFieldValue('genre', genres[index]);
        Keyboard.dismiss();
    }

    const modifySexualOrientation = (id, props) => {
        dismissKeyboard();
        const copy = [...sexualOrientation];
        const elem = copy[id - 1];
        elem.checked = !elem.checked;
        setSexualOrientation(copy);
        const checkedByUser = copy.filter(c => c.checked);
        props.setFieldValue('sexualOrientation', checkedByUser);
        setFirstLoaded(false);
    }

    const calculateMaxDate = () => {

        var datetime = moment(new Date()).format('DD MM YYYY');
        const splitDate = datetime.split(' ')

        const day = splitDate[0];
        const month = splitDate[1];
        const year = splitDate[2];

        const maxYear = year - 18;
        const maxDate = new Date(maxYear, month - 1, day);
        setMaxDate(maxDate);
    }

    const updateDate = (nextDate, props) => {
        setDate(nextDate);
        props.setFieldValue('date', nextDate);
    }

    const dismissKeyboard = () => {
        Keyboard.dismiss();
    }

    const viewMensurations = (props) => {

        if (props.errors.height && props.dirty && !firstLoaded) {
            return (
                <Text style={{ ...styles.errorWithOffset, marginLeft: 0 }}>{props.errors.height}</Text>
            )
        }

        if (props.errors.weight && props.dirty && !firstLoaded) {

            return (
                <Text style={{ ...styles.errorWithOffset, marginLeft: 0 }}>{props.errors.weight}</Text>
            )
        }
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
                    // console.log(values);
                    // authActions.saveGeneralInformations(values);
                    navData.navigation.navigate('GeneralInformationsScreen2');
                }}
            >
                {(props) => (

                    <ScrollView
                        keyboardShouldPersistTaps="always"
                        style={styles.scrollview}>

                        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                            <Layout style={styles.container} level='1'>
                                <View style={styles.content}>
                                    <Text style={styles.text}>{GeneralInformationsMessages.TITLE_GENRE}</Text>
                                    <RadioGroup style={styles.radioGroup}
                                        selectedIndex={selectedIndexGenre}
                                        onChange={index => updateSelectIndexGenre(index, props)}>
                                        <Radio>{genres[0]}</Radio>
                                        <Radio>{genres[1]}</Radio>
                                        <Radio>{genres[2]}</Radio>
                                    </RadioGroup>
                                </View>

                                <View style={styles.content}>
                                    <Text style={styles.text}>{GeneralInformationsMessages.TITLE_MENSURATIONS} *</Text>
                                    {
                                        viewMensurations(props)
                                    }

                                    <View style={styles.mensurationsContainer}>
                                        <View style={styles.textInputMensuration}>
                                            <TextInput
                                                keyboardType="number-pad"
                                                onChangeText={props.handleChange('height')}
                                                onBlur={props.handleBlur('height')}
                                                placeholder="0"
                                                placeholderTextColor="#fff"
                                                style={styles.mensurations}
                                                value={props.values.height}
                                                maxLength={3}
                                            />
                                            <Text style={styles.textMensuration}> cm</Text>

                                        </View>
                                        <View style={{
                                            ...styles.textInputMensuration,
                                            marginLeft: 30,
                                        }}>
                                            <TextInput
                                                keyboardType="number-pad"
                                                onChangeText={props.handleChange('weight')}
                                                onBlur={props.handleBlur('weight')}
                                                placeholder="0"
                                                placeholderTextColor="#fff"
                                                style={styles.mensurations}
                                                value={props.values.weight}
                                                maxLength={3}
                                            />
                                            <Text style={styles.textMensuration}> kg</Text>
                                        </View>
                                    </View>


                                    <View>
                                        <Text style={{ ...styles.text, marginTop: 15 }}>{GeneralInformationsMessages.TITLE_BIRTH}</Text>
                                        {
                                            props.errors.date && props.dirty && !firstLoaded &&
                                            <Text style={styles.errorWithOffset}>{props.errors.date}</Text>
                                        }
                                    </View>

                                </View>


                                <View style={{ marginHorizontal: 0 }}>
                                    <Datepicker
                                        style={styles.picker}
                                        placeholder={GeneralInformationsMessages.SELECTED_BIRTH}
                                        date={date}
                                        onFocus={dismissKeyboard}
                                        onSelect={nextDate => updateDate(nextDate, props)}
                                        dateService={localeDateService}
                                        min={minDate}
                                        max={maxDate}
                                    />
                                </View>


                                <View style={styles.content}>
                                    <Text style={styles.text}>{GeneralInformationsMessages.TITLE_SEXUAL_ORIENTATION}</Text>
                                    {
                                        props.dirty && props.errors.sexualOrientation && !firstLoaded &&
                                        <Text style={styles.errorWithOffset}>{props.errors.sexualOrientation}</Text>
                                    }
                                </View>
                                <View style={styles.sexualOrientation}>
                                    {sexualOrientation.map((so) => (
                                        <CheckBox
                                            key={so.id}
                                            checked={so.checked}
                                            onChange={() => modifySexualOrientation(so.id, props)}
                                            style={styles.itemSexualOrientation}
                                        >
                                            {`${so.title}`}
                                        </CheckBox>
                                    ))}
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


    /* Mensurations */
    mensurationsContainer: {
        marginTop: 15,
        flexDirection: 'row',
        alignItems: 'center',
    },

    mensurations: {
        color: '#fff',
        borderWidth: 1,
        borderColor: '#7885AB',
        borderRadius: 5,
        width: 45,
        height: 45,
        textAlign: 'center',
    },

    textInputMensuration: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    textMensuration: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 15,
        marginLeft: 10

    },


    /* Sexual orientation */
    sexualOrientation: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        marginLeft: '8%',
        marginTop: 10
    },

    itemSexualOrientation: {
        paddingTop: 10,
        paddingLeft: 11,
        width: '50%',
    },


    /* Family Status */
    familyStatus: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap-reverse',
        alignItems: 'flex-start',
        marginLeft: '6%',
        marginTop: 10
    },

    itemFamilyStatus: {
        paddingTop: 10,
        paddingLeft: 20,
        width: '50%',
    },



    /* Calendar */
    contentCalendar: {
        marginTop: 20
    },

    textCalendar: {
        marginTop: 30,
        marginHorizontal: '10.5%',
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
        color: '#E8DCB9'
    },

    picker: {
        flex: 1,
        marginHorizontal: '10%',
        paddingTop: 20,
    },


    /* Error */
    errorWithOffset: {
        alignSelf: 'flex-start',
        color: 'red',
        marginTop: 10,

    },

    error: {
        alignSelf: 'flex-start',
        color: 'red',
        marginTop: 20,
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
        marginTop: 15
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

    disabledbutton: {
        opacity: 0.2,
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
        marginTop: 1,
        padding: 2,
        fontWeight: 'bold',
        fontSize: 14,
        color: '#E8DCB9'
    },

    radioGroup: {
        flexDirection: 'row',
        marginTop: 10,
        marginLeft: '1%'
    },


})

export default GeneralInformationsScreen;