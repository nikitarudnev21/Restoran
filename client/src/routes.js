import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { AuthPage } from './pages/AuthPage';
import UsersPage from './pages/UsersPage';
import RestarauntsPage from './pages/RestarauntsPage';
import CreateApiKey from './pages/CreateApiKey';
import CreateRestaraunt from './pages/CreateRestaraunt';
import { DetailRestarauntPage } from './pages/DetailRestarauntPage';

export const useRoutes = (isAuthenticated, role) => {
    if (isAuthenticated && role) {
        switch (role) {
            case "Admin":
                return (
                    <Switch>
                        <Route path="/createAPIKey" exact>
                            <CreateApiKey />
                        </Route>
                        <Route path="/restaraunts" exact>
                            <RestarauntsPage />
                        </Route>
                        <Route path="/users" exact>
                            <UsersPage />
                        </Route>
                        <Route path="/detailrestoran/:id" exact>
                            <DetailRestarauntPage />
                        </Route>
                        <Redirect to="/restaraunts" />
                    </Switch>
                )
            case "Owner":
                return (
                    <Switch>
                        <Route path="/restaraunts" exact>
                            <RestarauntsPage />
                        </Route>
                        <Route path="/createrest" exact>
                            <CreateRestaraunt />
                        </Route>
                        <Route path="/detailrestoran/:id" exact>
                            <DetailRestarauntPage />
                        </Route>
                        <Redirect to="/restaraunts" />
                    </Switch>
                )
            default:
                break;
        }
        
    }
    return (
        <Switch>
            <Route path="/" exact>
                <AuthPage />
            </Route>
            <Redirect to="/" />
        </Switch>
    )
}