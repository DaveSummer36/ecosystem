import React, { useEffect, useState } from 'react';
import { Box, Typography, Avatar } from '@mui/material';

interface UserProfile {
    name: string;
    login: string;
    avatar_url: string;
}

const Profile: React.FC = () => {
    const [user, setUser] = useState<UserProfile | null>(null);

    useEffect(() => {
        fetch('/profile-info', {
            credentials: 'include'
        })
        .then(response => {
            if(!response.ok) throw new Error('Failed to fetch profile!');
            return response.json();
        })
        .then(data => setUser(data.user))
        .catch(error => console.error('Error fetching profile: ', error));
    }, []);

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
        >
            <Avatar
                alt={user.name}
                src={user.avatar_url}
                sx={{ width: 100, height: 100, marginBottom: 2 }}
            />
            <Typography variant='h5'>{user.name}</Typography>
            <Typography variant='subtitle1'>@{user.login}</Typography>
        </Box>
    );
};

export default Profile;