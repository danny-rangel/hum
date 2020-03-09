import React, { useState, useEffect, useReducer } from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { getAPIURL } from '../config/api';
import MODAXIOS from '../config/modaxios';

import Landing from '../pages/Landing';
import Home from '../pages/Home';
import SignUp from '../pages/SignUp';
import Login from '../pages/Login';
import Notifications from '../pages/Notifications';
import Profile from '../pages/Profile';
import Nav from '../components/Nav';
import Likes from '../pages/Likes';
import Followers from '../pages/Followers';
import Following from '../pages/Following';
import Sidebar from './Sidebar';
import Edit from '../pages/Edit';
import ViewHum from '../pages/ViewHum';
import Search from '../pages/Search';

const authInitialState = {
    loading: false,
    error: '',
    auth: null
};

const redirectInitialState = {
    toLanding: true
};

interface AuthContextProps {
    auth: any;
    authDispatch: React.Dispatch<any>;
}

interface RedirectContextProps {
    redirect: any;
    redirectDispatch: React.Dispatch<any>;
}

export const AuthContext = React.createContext({} as AuthContextProps);
export const RedirectContext = React.createContext({} as RedirectContextProps);

const authReducer = (state, action) => {
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
                error: action.payload,
                auth: null
            };
        default:
            return state;
    }
};

const redirectReducer = (state, action) => {
    switch (action.type) {
        case 'AUTH_TRUE':
            return {
                toLanding: false
            };
        case 'AUTH_FALSE':
            return {
                toLanding: true
            };
        default:
            return state;
    }
};

interface Props {}

const App: React.FC<Props> = () => {
    const [show, setShow] = useState(false);
    const [auth, authDispatch] = useReducer(authReducer, authInitialState);
    const [redirect, redirectDispatch] = useReducer(
        redirectReducer,
        redirectInitialState
    );

    const setShowSidebar = result => {
        setShow(result);
    };

    const fetchUserInfo = async () => {
        try {
            const res = await MODAXIOS.get(getAPIURL() + '/api/user');
            authDispatch({ type: 'FETCH_SUCCESS', payload: res.data });
        } catch (err) {
            authDispatch({ type: 'FETCH_ERROR' });
        }
    };

    useEffect(() => {
        fetchUserInfo();
    }, []);

    useEffect(() => {
        if (auth.auth && auth.auth.username !== '') {
            redirectDispatch({ type: 'AUTH_TRUE' });
        }
    }, [auth]);

    return (
        <Router>
            <RedirectContext.Provider
                value={{
                    redirect,
                    redirectDispatch
                }}
            >
                <AuthContext.Provider
                    value={{
                        auth,
                        authDispatch
                    }}
                >
                    <div className="App">
                        <Nav setShowSidebar={setShowSidebar} />
                        <Sidebar show={show} setShowSidebar={setShowSidebar} />
                        <Switch>
                            <Route path="/" exact>
                                <Landing />
                            </Route>
                            <Route path="/home" exact>
                                <Home />
                            </Route>
                            <Route path="/search" exact>
                                <Search />
                            </Route>
                            <Route path="/signup" exact>
                                <SignUp />
                            </Route>
                            <Route path="/login" exact>
                                <Login />
                            </Route>
                            <Route path="/notifications" exact>
                                <Notifications />
                            </Route>
                            <Route path="/:username" exact>
                                <Profile />
                            </Route>
                            <Route path="/likes/:humID" exact>
                                <Likes />
                            </Route>
                            <Route path="/followers/:id" exact>
                                <Followers />
                            </Route>
                            <Route path="/following/:id" exact>
                                <Following />
                            </Route>
                            <Route path="/edit/:username" exact>
                                <Edit />
                            </Route>
                            <Route path="/hum/:humID" exact>
                                <ViewHum />
                            </Route>
                            <Route
                                render={() => (
                                    <h2>
                                        there doesn't seem to be anything
                                        here...
                                    </h2>
                                )}
                            />
                        </Switch>
                    </div>
                </AuthContext.Provider>
            </RedirectContext.Provider>
        </Router>
    );
};

export default App;
