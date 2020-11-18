import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import 'materialize-css';
import { useRoutes } from '../src/routes';
import { useAuth } from './hooks/auth.hook';
import { AuthContext } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Loader } from './components/Loader';
function App() {
  const { token, login, logout, userId, ready } = useAuth();
  const isAuthenticated = !!token; // приводим к boolean значению
  const routes = useRoutes(isAuthenticated);

  if (!ready) { // если еще не прогрузилась авторизация то возвращаем лоадер
    return <Loader />
  }
  return (
    <AuthContext.Provider value={{
      token, login, logout, userId, isAuthenticated
    }}>
      <Router>
        {isAuthenticated && <Navbar />}
        <div className="container">
          {routes}
        </div>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
