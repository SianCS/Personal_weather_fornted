import axios from "axios";

export const weatherApi = axios.create({
    baseURL : "http://localhost:8555/api/weather"
})

export const searchByCityName = (cityName) => {
    return weatherApi.get("/", { 
        params: { 
            city: cityName 
        } 
    });
};

export const searchByLagLon = (lat, lon) => {
    return weatherApi.get("/by-coords", { 
        params: { 
            lat: lat, 
            lon: lon 
        } 
    });
};