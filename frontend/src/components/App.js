import React, { useEffect, useReducer } from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import axios from 'axios';

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

export const AuthContext = React.createContext();
export const RedirectContext = React.createContext();

const authInitialState = {
    loading: false,
    error: '',
    auth: null
};

const redirectInitialState = {
    toLanding: true
};

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
                error: 'Something went wrong.',
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

const App = () => {
    const [auth, authDispatch] = useReducer(authReducer, authInitialState);
    const [redirect, redirectDispatch] = useReducer(
        redirectReducer,
        redirectInitialState
    );

    const fetchUserInfo = async () => {
        try {
            const res = await axios.get('/api/user');
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
                        <Nav />
                        <Switch>
                            <Route path="/" exact>
                                <Landing />
                            </Route>
                            <Route path="/home" exact>
                                <Home />
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
                            <Route
                                render={() => (
                                    <h4>
                                        there doesn't seem to be anything
                                        here...
                                    </h4>
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
