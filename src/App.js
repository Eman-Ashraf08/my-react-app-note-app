import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './navbar';
import AddNotes from './addNotes';
import { ChecklistProvider } from './ChecklistContext';

function App() {
  return (
    <ChecklistProvider>
   <Router>
    <Routes>
        <Route path="/" element={< Navbar/>}/>
        <Route path="/addNotes" element={< AddNotes/>}/>
    </Routes>
  </Router>
  </ChecklistProvider>
  );
}

export default App;
