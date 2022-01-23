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
        setProfile(profile);
      } catch (err) {
        switch(err) {
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
    <div>{JSON.stringify(profile)}</div>
  );
}

export { Profile };