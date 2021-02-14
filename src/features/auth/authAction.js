import { LOGIN_USER, SIGN_OUT_USER } from "./authconstant"

export const login = (creds)=>{
    return {
        type: LOGIN_USER,
        payload:{
            creds
        }
    }
}

export const logout = ()=>{
    return{
        type:SIGN_OUT_USER
    }
}