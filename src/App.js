import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
// import Users from './user/pages/Users';
// import NewPlace from './places/pages/NewPlace';
// import MainNavigation from './shared/components/Navigation/MainNavigation';
// import UserPlaces from './places/pages/UserPlaces';
// import UpdatePlace from './places/pages/UpdatePlace';
// import Auth from './user/pages/Auth';
import { AuthContext } from './shared/context/auth-context';
import { useAuth } from './shared/hooks/auth-hook';
import { lazy, Suspense } from 'react';
import LoadingSpinner from './shared/components/UIElements/LoadingSpinner';

const Users = lazy(() => import('./user/pages/Users'));
const NewPlace = lazy(() => import('./places/pages/NewPlace'));
const MainNavigation = lazy(() => import('./shared/components/Navigation/MainNavigation'));
const UserPlaces = lazy(() => import('./places/pages/UserPlaces'));
const UpdatePlace = lazy(() => import('./places/pages/UpdatePlace'));
const Auth = lazy(() => import('./user/pages/Auth'));

function App() {
  const { token, userId, login, logout } = useAuth()

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        userId: userId,
        login: login,
        logout: logout,
      }}
    >
      <Router>
        <MainNavigation />
        <main>
          <Suspense fallback={<div className='center'><LoadingSpinner /></div>}>
            <Routes>
              <Route path="/" element={<Users />} />
              <Route path="/:userId/places" element={<UserPlaces />} />
              {token && <Route path="/places/new" element={<NewPlace />} />}
              {token && (
                <Route path="/places/:placeId" element={<UpdatePlace />} />
              )}
              {!token && <Route path="/auth" element={<Auth />} />}
              {token ? (
                <Route path="*" element={<Navigate to="/" />} />
              ) : (
                <Route path="*" element={<Navigate to="/auth" />} />
              )}
            </Routes>
          </Suspense>
        </main>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
