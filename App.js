import React, { useState } from 'react';
import { Text, View, TextInput, Button, StyleSheet } from 'react-native';
import axios from 'axios';

const App = () => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState('');

  const handleCityChange = (text) => {
    setCity(text);
  };

  const fetchWeatherByCity = async () => {
    try {
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?appid=a3d3101be16f4fff3f8ec52489b5929f&q=${city}&lang=pt_br&units=metric`);
      setWeatherData(response.data);
      setError('');
    } catch (error) {
      console.error('Error fetching weather by city:', error);
      setWeatherData(null);
      setError('Erro ao buscar informações de clima. Por favor, verifique o nome da cidade e tente novamente.');
    }
  };

  const fetchWeatherByCEP = async () => {
    try {
      const cepResponse = await axios.get(`https://viacep.com.br/ws/${city}/json/`);
      const { localidade: cidade } = cepResponse.data;
      const weatherResponse = await axios.get(`https://api.openweathermap.org/data/2.5/weather?appid=a3d3101be16f4fff3f8ec52489b5929f&q=${cidade}&lang=pt_br&units=metric`);
      setWeatherData(weatherResponse.data);
      setError('');
    } catch (error) {
      console.error('Error fetching weather by CEP:', error);
      setWeatherData(null);
      setError('Erro ao buscar informações de clima. Verifique se o CEP está correto e tente novamente.');
    }
  };

  const handleReset = () => {
    setCity('');
    setWeatherData(null);
    setError('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Consulta de Clima</Text>
      <TextInput style={styles.input} placeholder="Digite o nome da cidade ou CEP" value={city} onChangeText={handleCityChange} />

      <View style={styles.buttonContainer}>
        <Button title="Buscar Clima por Cidade" onPress={fetchWeatherByCity} style={styles.smallButton} />
        <View style={styles.buttonSpacer} />
        <Button title="Buscar Clima por CEP" onPress={fetchWeatherByCEP} style={styles.smallButton} />
        <View style={styles.buttonSpacer} />
        <Button title="Limpar Campos" onPress={handleReset} style={styles.smallButton} />
      </View>

      {weatherData && (
        <View style={styles.weatherInfo}>
          <Text style={styles.infoText}>Clima em {weatherData.name}</Text>
          <Text style={styles.infoText}>País: {weatherData.sys.country}</Text>
          <Text style={styles.infoText}>Descrição: {weatherData.weather[0].description}</Text>
          <Text style={styles.infoText}>Temperatura: {weatherData.main.temp}°C</Text>
          <Text style={styles.infoText}>Sensação Térmica: {weatherData.main.feels_like}°C</Text>
          <Text style={styles.infoText}>Temperatura Mínima: {weatherData.main.temp_min}°C</Text>
          <Text style={styles.infoText}>Temperatura Máxima: {weatherData.main.temp_max}°C</Text>
          <Text style={styles.infoText}>Umidade: {weatherData.main.humidity}%</Text>
        </View>
      )}

      {error !== '' && <Text>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonSpacer: {
    width: 10,
    height: 10
  },
  smallButton: {
    width: 120,
    height: 40,
  },
  weatherInfo: {
    marginTop: 20,
  },
  infoText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default App;
