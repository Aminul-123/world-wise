import { createContext, useCallback, useContext, useReducer } from "react";
import { useEffect, useState } from "react";

const CitiesContext = createContext();

const BASE_URL = 'http://localhost:8000';

const initialState = {
  cities : [],
  isLoading : false,
  currentCity : {},
  error : '',
}

function reducer (state, action) {
  switch(action.type) {
    case 'loading' : return {
      ...state,
      isLoading : true
    }
    case 'cities/loaded' : return {
      ...state,
      isLoading : false,
      cities : action.payload
    }
    case 'city/loaded' : return {
      ...state,
      isLoading : false,
      currentCity : action.payload,
    }
    case 'city/created' : return {
      ...state,
      isLoading : false,
      cities : [...state.cities, action.payload],
      currentCity : action.payload,
    }
    case 'city/deleted' : return {
      ...state,
      isLoading : false,
      cities : state.cities.filter((city) => city.id !== action.payload),
      currentCity : {}
    }
    case 'rejected' : return {
      ...state,
      isLoading : false,
      error : action.payload
    }
  default : throw new Error ('Unknown action type');
  }

}

function CitiesProvider ({children}) {
    // const [cities , setCities] = useState([]);
    // const [isLoading, setIsLoading] = useState(false)
    // const [currentCity, setCurrentCity] = useState({})

    const [state, dispatch] = useReducer(reducer, initialState);

    const {cities, isLoading, currentCity, error} = state;

  
    useEffect(function () {
      async function fetchCities () {
        dispatch({type : 'loading'})

        try {
          const res = await fetch(`${BASE_URL}/cities`);
          const data = await res.json();
         // setCities(data);
         dispatch({type : 'cities/loaded', payload : data})
        }
        catch(error) {
          dispatch({
            type : 'rejected',
            payload : `There was an error in loading data - ${error} `,
          })
        }
       
      }
      fetchCities();
    }, []);

  const getCity = useCallback(  async function getCity (id) {
    if (Number(id) === currentCity.id) return;

    dispatch({type : 'loading'})

        try {
           // setIsLoading(true)
            const res = await fetch(`${BASE_URL}/cities/${id}`);
            const data = await res.json();
           // setCurrentCity(data);
           // setIsLoading(false)
           dispatch({type : 'city/loaded', payload : data});
          }
          catch(error) {
            dispatch({
              type : 'rejected',
              payload : `There was an error in loading data - ${error} `,
            })
          }
          // finally {
          //   setIsLoading(false);
          // }
        }, 
      [currentCity.id]
      )

   async function createCity (newCity) {
    dispatch({type : 'loading'})

        try {
           // setIsLoading(true)
            const res = await fetch(`${BASE_URL}/cities`, {
              method: 'POST',
              body : JSON.stringify(newCity),
              headers  : {
                'Content-Type' : 'application/json'
              }
            });
            const data = await res.json();
          // console.log(data);
          //  setCities((cities) => [...cities, data])
          //  setIsLoading(false);
              dispatch({type : 'city/created', payload : data});

          }
          catch(error) {
            dispatch({
              type : 'rejected',
              payload : `There was an error in creating city - ${error} `,
            })
          }
          // finally {
          //   setIsLoading(false);
          // }
        }
    
   async function deleteCity (id) {
    dispatch({type : 'loading'})

        try {
          //  setIsLoading(true)
            await fetch(`${BASE_URL}/cities/${id}`, {
              method: 'DELETE',
              }
            );
        
         //  setCities((cities) => cities.filter((city) => city.id !== id));
         dispatch({type : 'city/deleted', payload : id});
          }
          catch(error) {
            dispatch({
              type : 'rejected',
              payload : `There was an error in deleting city - ${error} `,
            })
          }
          // finally {
          //   setIsLoading(false);
          // }
        }
    

    return <CitiesContext.Provider value={
        {
            cities,
            isLoading,
            currentCity,
            getCity,
            createCity,
            deleteCity,
            error,
        }
    } >
        {children}
    </CitiesContext.Provider>
}

function useCities () {
    const context = useContext(CitiesContext);
    if (context === undefined)
       throw new Error('CitiesContext was used outside the CitiesProvider.')
    return context;
}

export {CitiesProvider, useCities}