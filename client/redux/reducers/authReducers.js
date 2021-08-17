import {
    LOGIN_USER_SUCCESS,
    LOGIN_USER_FAIL,
    LOGOUT,
    SAVE_GENERAL_INFORMATIONS,
    SAVE_GENERAL_INFORMATIONS_2
} from '../actions/authActions';

const initialState = {
    user: {},
    errors: {},
    forms: {
        generalInformations3: {}
    },
    generalInformations: {},
    generalInformations2: {},
};

export default function (state = initialState, action) {    
    switch (action.type) {
        case LOGIN_USER_SUCCESS:
            return {
                ...state,
                user: action.payload
            }
        case LOGIN_USER_FAIL:
            return {
                ...state,
                errors: true
            }
        case LOGOUT:
            return initialState;

        case SAVE_GENERAL_INFORMATIONS:
            return {
                ...state,
                generalInformations: action.payload
            }

        case SAVE_GENERAL_INFORMATIONS_2:            
            return {
                ...state,
                generalInformations2: action.payload
            }
    }

    return state;
}