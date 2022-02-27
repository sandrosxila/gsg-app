import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { LOGOUT } from '../../actions/authTypes';
import { RootState } from '../../reducers';

const Header: React.FC = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { fullName } = useSelector((state: RootState) => state.user);

    const onLogoutButtonClick = () => {
        dispatch({ type: LOGOUT });
        navigate('/');
    };

    return (
        <HeaderLayout>
            <HeaderTitle>
                GSG
            </HeaderTitle>
            <HeaderPanel>
                <HeaderPanelItem>
                    {`user: ${fullName}`}
                </HeaderPanelItem>
                <HeaderPanelItem>
                    <LogoutButton onClick={ onLogoutButtonClick }>
                        Log Out
                    </LogoutButton>
                </HeaderPanelItem>
            </HeaderPanel>
        </HeaderLayout>
    );
};

const HeaderLayout = styled.header`
    background-color: #f5f5f5;
    height: 60px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 1.5rem;
`;

const HeaderTitle = styled.h1`
    font-size: 1.5rem;
    padding: 0.5rem;
    font-weight: 600;
    user-select: none;
`;

const HeaderPanel = styled.div`
    display: flex;
    align-items: center;
`;

const HeaderPanelItem = styled.div`
    padding: 0.5rem;
`;

const LogoutButton = styled.button`
    all: unset;
    display: inline-flex;
    padding: 0.5rem;
    align-items: center;
    justify-content: center;
    background: black;
    color: #fff;
    transition: all 0.2s ease-in-out;
    border-radius: 0.25rem;
    text-transform: capitalize;

    &:hover {
        background: #212121;
        cursor: pointer;
    }

    &:focus {
        outline: 1px solid #cccccc;
    }

    &:active {
        background: #303030
    }

`;

export default React.memo(Header);