// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import styles from "./Form.module.css";
import Button from "./Button";
import { useNavigate } from "react-router-dom";
import BackButton from "./BackButton";
import { useURLPosition } from "../hooks/useURLPosition";
import Message from './Message';
import Spinner from "./Spinner";
import DatePicker from "react-datepicker";
import { PosAnimation } from "leaflet";
import { useCities } from "../contexts/CitiesContext";

export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

const BASE_URL = 'https://api.bigdatacloud.net/data/reverse-geocode-client'

function Form() {
  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [lat, lng] = useURLPosition();
  const [isLoadingGeocoding, setIsLoadingGeocoding] = useState(false)
  const [geocodingError, setGeocodingError] = useState('');

  const [emoji, setEmoji] = useState('')

  const {createCity, isLoading} = useCities();

  const navigate = useNavigate();

  useEffect(function () {
    if (!lat && !lng) return;
      async function fetchCityData () {
        try {
            setIsLoadingGeocoding(true)
            const res = await fetch(`${BASE_URL}?latitude=${lat}&longitude=${lng}`)
            const data = await res.json()
            if (!data.countryCode) 
              throw new Error ('That does not seem to be a city. Click somewhere else. ')
          //  console.log(data);
            setCityName(data.city || data.locality || '');
            setCountry(data.countryName || '');
            setEmoji(convertToEmoji(data.countryCode))
        }
        catch (err) {
        //  setIsLoadingGeocoding(false)
        //  console.log(err)
          setGeocodingError(err.message);
        }
        finally {
          setIsLoadingGeocoding(false);
        }
      };
      fetchCityData();
  }, [lat, lng]);

   async function handleSubmit (e) {
    e.preventDefault ();

    if (!cityName || !date) return;

    const newCity = {
      cityName,
      country,                
      emoji,
      date,
      notes,
      position : {lat, lng},
    };
   // console.log(newCity);
  await createCity(newCity);
   navigate('/app/cities')

  }

  if (isLoadingGeocoding) return <Spinner />
  if (!lat && !lng) return <Message message={'Start by clicking somewhere on the map.'} />

  if (geocodingError) return <Message message={geocodingError} />

  return (
    <form className={`${styles.form} ${isLoading ? styles.loading : ''}`} onSubmit={handleSubmit}>
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />

        <span className={styles.flag}>{emoji}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        {/* <input
          id="date"
          onChange={(e) => setDate(e.target.value)}
          value={date}
        /> */}
         <DatePicker selected={date} onChange={(selectedDate) => setDate(selectedDate)}
         dateFormat={'dd/MM/yyyy'}
         id="date"
         />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
      <Button type={'primary'}>
          Add
      </Button>
        
       <BackButton />
      </div>
    </form>
  );
}

export default Form;