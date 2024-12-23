import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from '../../shared/util/validators';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from '../../shared/hooks/form-hook';
import { useContext, useEffect, useState } from 'react';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import Button from '../../shared/components/FormElements/Button';
import Input from '../../shared/components/FormElements/Input';
import Card from '../../shared/components/UIElements/Card';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import './PlaceForm.css';

const UpdatePlace = (props) => {
  const [loadedPlace, setLoadedPlace] = useState(null);
  const { userId, token } = useContext(AuthContext);
  const placeId = useParams().placeId;
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const [formState, inputHandler, setFormData] = useForm(
    {
      title: {
        value: '',
        isValid: false,
      },
      description: {
        value: '',
        isValid: false,
      },
      address: {
        value: '',
        isValid: false,
      },
    },
    false
  );

  const navigate = useNavigate()

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const url = `${process.env.REACT_APP_BACKEND_URL}/api/places/${placeId}`;
        const responseData = await sendRequest(url);
        setLoadedPlace(responseData.place);
        setFormData(
          {
            title: {
              value: responseData.place.title,
              isValid: true,
            },
            description: {
              value: responseData.place.description,
              isValid: true,
            }
          },
          true
        );
      } catch (error) {}
    };
    fetchPlaces();
  }, [setFormData, sendRequest, placeId]);

  const placeSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      const url = `${process.env.REACT_APP_BACKEND_URL}/api/places/${placeId}`;
      const method = 'PATCH';
      const body = JSON.stringify({
        title: formState.inputs.title.value,
        description: formState.inputs.description.value,
      });
      const headers = {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      };

      await sendRequest(url, method, body, headers);

      navigate(`/${userId}/places`)

    } catch (err) {}
  };

  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!loadedPlace && !error) {
    return (
      <div className="center">
        <Card>
          <h2>Couldn't find place</h2>
        </Card>
      </div>
    );
  }

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      {!isLoading && loadedPlace && (
        <form className="place-form" onSubmit={placeSubmitHandler}>
          <Input
            id="title"
            element="input"
            type="text"
            label="Title"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid title"
            onInput={inputHandler}
            initialValue={formState.inputs.title.value}
            initialValid={formState.inputs.title.isValid}
          />
          <Input
            id="description"
            element="textarea"
            label="Description"
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText="Please enter a valid description (at least 5 character)"
            onInput={inputHandler}
            initialValue={formState.inputs.description.value}
            initialValid={formState.inputs.description.isValid}
          />
          <Button type="submit" disabled={!formState.isValid}>
            Add Place
          </Button>
        </form>
      )}
    </>
  );
};

export default UpdatePlace;
