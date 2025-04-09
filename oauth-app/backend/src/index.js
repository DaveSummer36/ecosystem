const express = require('express');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const cookieSession = require('cookie-session');
require('dotenv').config();

const app = express();
const PORT = 3000;

// Environment variables
const clientID = process.env.GITHUB_CLIENT_ID;
const clientSecret = process.env.GITHUB_CLIENT_SECRET;
const callbackURL = process.env.GITHUB_CALLBACK_URL;
const sessionSecret = process.env.SESSION_SECRET;

// Validate environment variables
if(!clientID || !clientSecret || !callbackURL || !sessionSecret) throw new Error('Missing required environment variables. Please check your .env file');

// Log environment variable
if(process.env.NODE_ENV !== 'production') {
	console.log('GITHUB_CLIENT_ID: ', clientID);
	console.log('GITHUB_CALLBACK_URL: ', callbackURL);
}

// Middleware for session handling
app.use(express.json());
app.use(
	cookieSession({
		name: 'session',
		keys: [sessionSecret],
		maxAge: 24 * 60 * 60 * 1000
	})
);

// -------------------
// GitHub OAuth Routes
// -------------------

app.get('/auth/github', (req, res) => {
	const githubAuthURL = `https://github.com/login/oauth/authorize?client_id=${clientID}&redirect_uri=${callbackURL}`;
	res.redirect(githubAuthURL);
});

app.get('/auth/github/callback', async (req, res) => {
	const code = req.query.code;
	try {
		const tokenResponse = await axios.post('https://github.com/login/oauth/access_token', {
			client_id: clientID,
			client_secret: clientSecret,
			code: code
		}, {
			headers: {
				Accept: 'application/json'
			}
		});

		const accessToken = tokenResponse.data.access_token;
		const userResponse = await axios.get('https://api.github.com/user', {
			headers: {
				Authorization: `token ${accessToken}`
			}
		});

		const user = userResponse.data;
		req.session.user = user;
		res.redirect('/profile-info');
	} catch(err) {
		console.error('Error during OAuth callback: ', err);
		res.status(500).send('Authentication failed!');
	}
});

// ----------------
// Protected routes
// ----------------

const requireAuth = (req, res, next) => {
	if(!req.session.user) return res.status(401).json({ error: 'Unathorized!' });
	next();
};

app.get('/profile-info', (req, res) => {
	res.json({ user: req.session.user });
});

app.get('/logout', (req, res) => {
	req.session = null;
	res.redirect('/');
});

// Define the path to the JSON file
const profilesFilePath = path.join(__dirname, 'profiles.json');

// Endpoint to save user profile
app.post('/save-profile', (req, res) => {
	const user = req.session.user;	// Get the logged-in user
	const { status, description, links } = req.body;

	// Create the data to save
	const profileData = {
		name: user.name,
		login: user.login,
		avatar_url: user.avatar_url,
		status,
		description,
		links
	};

	// Read existing profiles (or initialize an empty object if the file doesn't exist)
	let profiles = {};
	if(fs.existsSync(profilesFilePath)) {
		const fileContent = fs.readFileSync(profilesFilePath, 'utf-8');
		profiles = JSON.parse(fileContent);
	}

	// Save or update the profile for the user
	profiles[user.login] = profileData;

	// Write the updated profiles back to the file
	fs.writeFileSync(profilesFilePath, JSON.stringify(profiles, null, 2), 'utf-8');
	res.status(200).json({ message: 'Profile saved successfully!' });
});

// ----------------------
// Frontend and Catch-All
// ----------------------

// Serve static files from React build
app.use(express.static(path.join(__dirname, '../../frontend/dist')));

// Catch-all handler for React frontend routes
app.get(/^\/(?!auth|profile-info|logout).*/, (req, res) => {
	if(req.originalUrl.startsWith('http://') || req.originalUrl.startsWith('https://')) {
		console.warn('Rejected external-style route: ', req.originalUrl);
			return res.status(400).send('Malformed request URL.');
	}

	console.log('Catch-all route accessed: ', req.originalUrl);
	res.sendFile(path.join(__dirname, '../../frontend/dist', 'index.html'));
});

// ----------------
// Start the server
// ----------------

app.listen(PORT, () => {
	console.log(`✅ Server is running at http://localhost:${PORT}`);
});