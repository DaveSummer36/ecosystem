import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { Box, Typography, Avatar, Card, CardContent, TextField, Button } from '@mui/material';

interface UserProfile {
    name: string;
    login: string;
    avatar_url: string;
    status?: string;                            // Optional custom status
    description?: string;                       // Optional custom description
    links?: { label: string; url: string; }[];  // Optional profile links
}

const Profile: React.FC = () => {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [status, setStatus] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [links, setLinks] = useState<{ label: string; url: string; }[]>([]);
    const navigate = useNavigate();

    const fetchProfileInfo = () => {
        fetch('/profile-info', {
            credentials: 'include'
        })
        .then((response) => {
            if(!response.ok) throw new Error('Failed to fetch profile!');
            return response.json();
        })
        .then((data) => {
            setUser(data.user);
            setStatus(data.user.status || '');
            setDescription(data.user.description ||'');
            setLinks(data.user.links || []);
            localStorage.setItem('user', JSON.stringify(data.user)); // Persist session
        })
        .catch((error) => {
            console.error('Error fetching profile:', error);
            localStorage.removeItem('user');    // Clear session on error
            navigate('/');                      // Redirect to login page
        });
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        // Check if session exists in localStorage
        const savedUser = localStorage.getItem('user');
        if(savedUser) setUser(JSON.parse(savedUser));
        else fetchProfileInfo(); // Fetch profile info if session doesn't exist
    });

    const handleAddLink = () => {
        setLinks([...links, { label: '', url: '' }]);
    };

    const handleLinkChange = (index: number, field: 'label' | 'url', value: string) => {
        const updatedLinks = [...links];
        updatedLinks[index][field] = value;
        setLinks(updatedLinks);
    };

    const saveProfile = () => {
        const payload = {
            status,
            description,
            links
        };

        fetch('/save-profile', {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(payload)
        })
        .then(response => {
            if(response.ok) console.log('Profile saved successfully!');
            else console.error('Failed to save profile!');
        })
        .catch(error => console.error('Error saving profile: ', error));
    };

    const handleLogout = () => {
        fetch('logout', {
            method: 'GET',
            credentials: 'include'
        })
        .then(response => {
            if(response.ok) navigate('/');
            else console.error('Logout failed!');
        })
        .catch(error => console.error('Error during logout: ', error));
    };

    if(!user) {
        return (
            <Box textAlign='center' mt={4}>
                <Typography variant='h5' color='error'>
                    Unable to load profile. Please log in again.
                </Typography>
            </Box>
        );
    }

    return (
        <Box
            display='flex'
            flexDirection='column'
            justifyContent='center'
            minHeight='100vh'
            padding={2}
        >
            <Card sx={{ maxWidth: 400, width: '100%', padding: 2 }}>
                <Box display='flex' flexDirection='column' alignItems='center' mb='2'>
                    <Avatar
                        alt={user.name}
                        src={user.avatar_url}
                        sx={{ width: 100, height: 100, marginBottom: 2 }}
                    />
                    <Typography variant='h5'>{user.name}</Typography>
                    <Typography variant='subtitle1'>@{user.login}</Typography>
                </Box>
                <CardContent>
                    <Typography variant='h6' gutterBottom>
                        Custom Status
                    </Typography>
                    <TextField
                        fullWidth
                        variant='outlined'
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        placeholder='Enter your custom status...'
                        sx={{ marginBottom: 2 }}
                    />

                    <Typography variant='h6' gutterBottom>
                        Description
                    </Typography>
                    <TextField
                        fullWidth
                        multiline
                        rows={3}
                        variant='outlined'
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder='Tell us about yourself...'
                        sx={{ marginBottom: 2 }}
                    />

                    <Typography variant='h6' gutterBottom>
                        Profile Links
                    </Typography>
                    {links.map((link, index) => (
                        <Box key={index} display='flex' alignItems='center' mb={1}>
                            <TextField
                                variant='outlined'
                                value={link.label}
                                onChange={(e) => handleLinkChange(index, 'label', e.target.value)}
                                placeholder='Label (e.g., GitHub)'
                                sx={{ marginRight: 1 }}
                            />
                            <TextField
                                variant='outlined'
                                value={link.url}
                                onChange={(e) => handleLinkChange(index, 'url', e.target.value)}
                                placeholder='URL (e.g. https://github.com)'
                                sx={{ flex: 1 }}
                            />
                        </Box>
                    ))}

                    <Button variant='text' onClick={handleAddLink} sx={{ marginBottom: 2 }}>
                        Add Link
                    </Button>

                    <Box textAlign='center'>
                        <Button variant='contained' color='primary' onClick={saveProfile}>
                            Save Profile
                        </Button>
                    </Box>

                    <Box textAlign='center'>
                        <Button
                            variant='outlined'
                            color='secondary'
                            onClick={handleLogout}
                        >
                            Logout
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
};

export default Profile;