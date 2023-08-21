import './App.css';
import NavBar from './components/Navbar';
import { Routes,  Route } from 'react-router-dom';
import { PinataContextProvider } from './constants/pinataContext';
import { AccountContextProvider } from './context/account'

import List from './components/List';
import Listed from './components/Listed';
import Details from './components/Details';
import Main from './components/Main';
import Footer from './components/Footer';

function App() {
  return (
<div>
  
  <PinataContextProvider>
    <AccountContextProvider>
      <NavBar />

      <Routes>
        <Route exact path = "/" Component={Main} />
        <Route exact path = "/list" Component={List}/>
        <Route exact path = "/opportunities" Component={Listed} />
        <Route exact path = "/nft/:id" Component={Details} />
      </Routes>

      <Footer />
    </AccountContextProvider>
  </PinataContextProvider>    

</div>
  );
}

export default App;
