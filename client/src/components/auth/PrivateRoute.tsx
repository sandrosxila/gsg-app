import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { RootState } from '../../reducers';

type Props = {
    element: JSX.Element
}

const PrivateRoute: React.FC<Props> = ({ element }) => {
    const location = useLocation();

    const { isUserLoggedIn } = useSelector((state: RootState) => state.auth);
    // const [isUserLoggedIn, setIsUserLoggedIn] = useState(expiresAt && expiresAt * 1000 >= Date.now());


    return isUserLoggedIn ? element : <Navigate to={ '/login' } state={ location.state }/>;
};

export default PrivateRoute;