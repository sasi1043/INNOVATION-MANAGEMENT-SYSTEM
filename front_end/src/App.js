import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './components/Login';
import { Route, Routes } from 'react-router-dom';
import Profile from './components/Profile';
import RoleProvider from './context/RoleContext';
import Home from './components/pages/Home';
import DashBoard from './components/user/DashBoard';
import IdeaProvider from './context/IdeaContext';

function App() {
  return (
    <div className="App">
      <RoleProvider>
        <IdeaProvider>
          <Routes>
            <Route path='/' element={<Login/>}></Route>
            <Route path='/profile' element={<Profile/>}></Route>
            <Route path='/home' element={<Home/>}></Route>
            <Route path='/dashboard' element={<DashBoard/>}></Route>
          </Routes>
        </IdeaProvider>
       </RoleProvider>
    </div>
  );
}

export default App;
