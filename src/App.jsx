import { useContext, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

import Loginform from './components/Loginform'
import About from './components/About';
import Contact from './components/Contact';
import Home from './components/Home';
import NoPage from './components/NoPage';
import { AuthContext } from './context/AuthContext';
import { BrowserRouter as Router, Route, Routes, BrowserRouter } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Protect from './components/Protect';
import CreateUser from './components/CreateUser';


function App() {

  

   const state = useContext(AuthContext)
  console.log("Contextyy", state)

  return (
    
<>

<Router>

        <Routes>
          <Route path="/" element={
           <Protect>
              <Loginform />
              </Protect>
              
            } />


<Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/about"
            element={
              <ProtectedRoute>
                <About />
              </ProtectedRoute>
            }
          />
          <Route
            path="/contact"
            element={
              <ProtectedRoute>
                <Contact />
              </ProtectedRoute>
            }
          />
          <Route path="/create-user" element={<CreateUser />} /> {/* Add the new route */}
          <Route path="*" element={<NoPage />} />
        </Routes>
      </Router>

    
    {/* <div>
{state.attempted? (
state.isAuthenticated? (
<Home />
) : (
<Unauthorized />
)
) : (
<Loginform />
)}
</div> */}

</>
  )
}

export default App