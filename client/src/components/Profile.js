import { Box, Flex, Grid, GridItem, Image, SimpleGrid, VStack } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchApi } from '../utils';


function Profile({ jwt }) {
  const [profile, setProfile] = useState({});
  const { userId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProfile() {
      try {
        const profile = await fetchApi(userId ? `/api/profiles/${userId}` : '/api/profile', 'GET', { headers: { Authorization: `Bearer ${jwt}` } });
        profile.birthday = new Date(profile.birthday);
        profile.created = new Date(profile.created);

        setProfile(profile);
      } catch (err) {
        switch (err) {
          case 'Profile not found':
            navigate('/404');
            break;
          default:
            console.error(err);
            break;
        }
      }
    }

    fetchProfile();
  }, []);

  return (
    <VStack>
      <Image src={profile.avatar ?? '/images/default.png'} alt={`${profile.username}'s avatar`} w='200px' />
      <Grid as='dl' display='inline-grid' templateRows='repeat(3, 1fr)' templateColumns='repeat(2, min-content)' whiteSpace='nowrap' gridColumnGap={3}>
        <GridItem as='dt' fontWeight='bold' fontSize='lg'>Name</GridItem>
        <GridItem as='dd' fontSize='lg'>{profile.username}</GridItem>
        <GridItem as='dt' fontWeight='bold' fontSize='lg'>Birthday</GridItem>
        <GridItem as='dd' fontSize='lg'>{profile.birthday?.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}</GridItem>
        <GridItem as='dt' fontWeight='bold' fontSize='lg' wordBreak='keep-all'>Date Joined</GridItem>
        <GridItem as='dd' fontSize='lg'>{profile.created?.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}</GridItem>
      </Grid>
    </VStack>
  );
}

export { Profile };