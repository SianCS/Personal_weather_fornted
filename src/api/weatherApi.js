import axios from "axios";

const weatherApi = axios.create({
    baseURL : "http://localhost:8555/api/weather"
})

export const searchByCityName = () => weatherApi.get("/")
