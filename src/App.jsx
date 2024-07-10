import './App.css'
import { useState, useEffect } from 'react'
//import { v4 as uuid } from 'uuid'
import { FaTemperatureHigh as ThermometerIcon, FaWind as WindIcon } from 'react-icons/fa'

function App() {
  const [searchedCity, setSearchedCity] = useState('Campinas')
  const [city, setCity] = useState('')
  const [weather, setWeather] = useState(null)
  
  const translatedCurrentWeatherTable = {
    "Partly cloudy"         :"Parcialmente nublado",
    "Clear"                 :"Tempo limpo",
    "Light snow"            :"Neve leve",
    "Sunny"                 :"Ensolarado",
    "Rain with thunderstorm":"Chuva com tempestade",
    "Patchy rain possible"  :"Chuviscos"
  }
  
  function handleSubmit(event) {
    event.preventDefault()
    setCity()
    console.log("searched city", searchedCity)
  }

  useEffect(() => {
    async function getCityWeather(){
        const response = await fetch(`https://goweather.herokuapp.com/weather/${searchedCity}`)
        const data = await response.json()
        setWeather(data)
        setCity(searchedCity)
        const hour = new Date().getHours()
        var timeOfDay = ''

        if (hour >= 6 && hour < 12) {
          timeOfDay = 'morning'
        } else if (hour >= 12 && hour < 18) {
          timeOfDay = 'afternoon'
        } else {
          timeOfDay = 'evening'
        }
        document.body.className = timeOfDay;
        console.log(data)
    }
    getCityWeather()
  }, [city])
  
  return (
    <>
     <div>
      <form action="" onSubmit={handleSubmit}>
        <input className="roundedInput" type="text" 
               placeholder='Ex.: Curitiba'
               value={searchedCity}
               onChange={event => setSearchedCity(event.target.value)} />
       
        &nbsp;&nbsp; <button className="searchButton" type="submit">Pesquisar Cidade</button>
      </form>

      { city && weather && (
        <>
          <h1>{city}</h1>
          <h2>Tempo atual</h2>
          <p><ThermometerIcon /> { weather.temperature }</p>
          <p>{ 
              translatedCurrentWeatherTable[weather.description] ?
              translatedCurrentWeatherTable[weather.description] :
              weather.description
              }
          </p>
          <h2>Previsão</h2>
          <ul>
            {weather.forecast.map((dayForecast, index) => {
              return(
              <>
                <div className="climaticData"> 
                  <h3>
                      {index === 0 ? 'Amanhã' : Intl.DateTimeFormat('pt-BR', {weekday:'long'}).format(new Date().setDate(new Date().getDate()+index+1))}
                      {index === 1 ? '' : ''}
                      {index === 2 ? '' : ''}
                  </h3>
                  <div>
                  <div ><ThermometerIcon /> Temperatura : {dayForecast.temperature}</div><div><WindIcon/> Vento : {dayForecast.wind}</div>
                  </div>
                </div>
                <br></br>
              </>
              )
            })}
          </ul>
        </>
      )}
     </div>
    </>
  )
}

export default App
