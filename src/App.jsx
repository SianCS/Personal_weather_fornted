import { ToastContainer } from "react-toastify";
import AppRouter from "./routers/AppRouter";
import 'leaflet/dist/leaflet.css';

function App() {
  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={1500}
        hideProgressBar={false}
      />
      <AppRouter />
    </>
  );
}

export default App;
