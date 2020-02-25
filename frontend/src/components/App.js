import React, { useEffect, useReducer } from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import axios from 'axios';

import Home from '../pages/Home';
import SignUp from '../pages/SignUp';
import Login from '../pages/Login';
import Nav from '../components/Nav';

export const AuthContext = React.createContext();

const initialState = {
    loading: false,
    error: '',
    auth: null
};

const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_SUCCESS':
            return {
                loading: false,
                error: '',
                auth: action.payload
            };
        case 'FETCH_ERROR':
            return {
                loading: false,
                error: 'Something went wrong.',
                auth: null
            };
        default:
            return state;
    }
};

const App = () => {
    const [auth, dispatch] = useReducer(reducer, initialState);

    const fetchUserInfo = async () => {
        try {
            const res = await axios.get('/api/user');
            dispatch({ type: 'FETCH_SUCCESS', payload: res.data });
        } catch (err) {
            dispatch({ type: 'FETCH_ERROR' });
        }
    };

    useEffect(() => {
        fetchUserInfo();
    }, []);

    return (
        <Router>
            <AuthContext.Provider
                value={{
                    authState: auth,
                    authDispatch: dispatch
                }}
            >
                <div className="App">
                    <Nav></Nav>
                    <nav className="App-header">
                        <ul>
                            <li>
                                <Link to="/">Home</Link>
                            </li>
                            <li>
                                <Link to="/signup">SignUp</Link>
                            </li>
                            <li>
                                <Link to="/login">Login</Link>
                            </li>
                        </ul>
                    </nav>

                    <Switch>
                        <Route path="/" exact>
                            <Home />
                        </Route>
                        <Route path="/signup" exact>
                            <SignUp />
                        </Route>
                        <Route path="/login" exact>
                            <Login />
                        </Route>
                    </Switch>
                </div>
            </AuthContext.Provider>
        </Router>
    );
};

export default App;
