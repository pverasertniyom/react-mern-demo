import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useHttpClient } from '../../shared/hooks/http-hook';
import PlaceList from '../components/PlaceList';
// import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';

const UserPlaces = () => {
  const params = useParams();
  const userId = params.userId;
  const [loadedPlaces, setLoadedPlaces] = useState([]);
  const { isLoading, sendRequest } = useHttpClient();

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const url = `${process.env.REACT_APP_BACKEND_URL}/api/places/user/${userId}`;
        const responseData = await sendRequest(url);
        setLoadedPlaces(responseData.places)        
      } catch (error) {}
    };
    fetchPlaces();
  }, [sendRequest, userId]);

  const pleaseDeletedHandler = (deletePlaceId) => {
    setLoadedPlaces(prevPlaces => prevPlaces.filter(place => place.id !== deletePlaceId))
  }

  return (
    <>
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedPlaces && <PlaceList items={loadedPlaces} onDeletePlace={pleaseDeletedHandler} />}
    </>
  );
};

export default UserPlaces;
