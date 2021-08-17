import Messages from '../../constants/LoginMessages';

const BASE_URL = 'http://192.168.121.204:3000';
const timeout = 6000;

export const LOGIN_USER_SUCCESS = 'LOGIN_USER_SUCCESS';
export const LOGIN_USER_FAIL = 'LOGIN_USER_FAIL';
export const LOGOUT = 'LOGOUT';
export const SAVE_GENERAL_INFORMATIONS = 'SAVE_GENERAL_INFORMATIONS';
export const SAVE_GENERAL_INFORMATIONS_2 = 'SAVE_GENERAL_INFORMATIONS_2';

const fetchRegister = async (email, phoneNumber) => {

    let controller = new AbortController();
    setTimeout(() => controller.abort(), timeout);
    const resp = await fetch(`${BASE_URL}/newde/api/auth/checkUserExist`, {
        signal: controller.signal,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email,
            phoneNumber
        })
    });

    const json = await resp.json();
    return json;
}

export const checkUserExist = (authData) => {
    const { email, phoneNumber } = authData;
    return async dispatch => {
        try {
            const resultData = await fetchRegister(email, phoneNumber);
            return resultData;
        }

        catch (error) {
            return {
                success: false,
                message: Messages.NETWORK_PROBLEM
            }
        }
    }
}


export const getSms = (authData) => {
    const { firstName, lastName, email, password, phoneNumber } = authData;

    return async dispatch => {
        try {
            const result = await fetch(`${BASE_URL}/newde/api/auth/getSMS`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    firstName,
                    lastName,
                    email,
                    password,
                    phoneNumber
                })
            });

            const resultData = await result.json();

            if (resultData.success) {

                return {
                    success: true,
                    data: {
                        requestId: resultData.requestId,
                        firstName: firstName,
                        lastName: lastName,
                        email: email,
                        phoneNumber: phoneNumber,
                        password: password
                    }
                }
            }
            else {
                return {
                    success: resultData.success,
                    message: resultData.message
                }
            }
        }

        catch (error) {
            return {
                success: false,
                message: error.message
            }
        }

    }
}

export const checkSMS = (infos, code) => {

    const infosUser = infos.data;

    return async dispatch => {
        const result = await fetch(`${BASE_URL}/newde/api/auth/verifySMS`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                infosUser,
                code
            })
        });

        const resultData = await result.json();

        return resultData;
    }
}

export const cancelSMS = (requestId) => {

    return async dispatch => {
        const result = await fetch(`${BASE_URL}/newde/api/auth/cancelSMS`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                requestId
            })
        });

        const resultData = await result.json();

        return resultData;
    }
}

const fetchLogin = async (email, password) => {

    let controller = new AbortController()
    setTimeout(() => controller.abort(), timeout);  // abort after 3 seconds
    const resp = await fetch(`${BASE_URL}/newde/api/auth/Login`, {
        signal: controller.signal,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email,
            password
        })
    });

    const json = await resp.json();

    return json;
}

export const login = (infosUser) => {

    const email = infosUser.email;
    const password = infosUser.password;

    return async dispatch => {

        try {
            const jsonResp = await fetchLogin(email, password);
            if (jsonResp.success) {

                dispatch({
                    type: LOGIN_USER_SUCCESS,
                    payload: jsonResp
                });
            } else {
                dispatch({
                    type: LOGIN_USER_FAIL
                })
            }

            return jsonResp;

        } catch (error) {
            return {
                success: false,
                message: Messages.NETWORK_PROBLEM
            };
        }
    }
}

export const logout = () => {
    return {
        type: 'LOGOUT'
    };
}

export const saveGeneralInformations = (generalInformationToSave) => {
    return {
        type: SAVE_GENERAL_INFORMATIONS,
        payload: generalInformationToSave
    }
}

export const saveGeneralInformations2 = (generalInformation2ToSave) => {
    return {
        type: SAVE_GENERAL_INFORMATIONS_2,
        payload: generalInformation2ToSave
    }
}
