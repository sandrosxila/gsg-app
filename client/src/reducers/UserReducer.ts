import { SetUser, SET_USER } from './../actions/userTypes';

export interface IUser{
    id: string,
    fullName: string;
    username: string;
}

const initialState: IUser = {
    id: '',
    fullName: '',
    username: '',
};

type UserAction = SetUser;

export default function UserReducer(state = initialState, action: UserAction) {
    switch (action.type) {
    case SET_USER:
        return {
            ...state,
            id: action.payload.id,
            fullName: action.payload.fullName,
            username: action.payload.username,
        };
    default:
        return state;
    }
}