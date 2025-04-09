import React from 'react';
import Login from './components/Login';
import Navbar from './components/Navbar';
import Profile from './components/Profile';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const App: React.FC = () => {
	return (
		<Router>
			<Navbar />
			<Routes>
				<Route path='/' element={<Login />} />
				<Route path='/profile-info' element={<Profile />} />
			</Routes>
		</Router>
	);
};

export default App;