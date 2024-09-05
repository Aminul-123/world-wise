import { Navigate, Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";

// import Product from "";
// import Pricing from "./assets/Pricing";
// import Homepage from "";
// import PageNotFound from "./assets/PageNotFound";
// import AppLayout from "./assets/AppLayout";
// import Login from "./assets/Login";
import CityList from "./components/CityList";
import CountryList from "./components/CountryList";
import City from './components/City';
import Form from './components/Form';
import { CitiesProvider } from "./contexts/CitiesContext";
import { AuthProvider } from "./contexts/FakeAuthContext";
import ProtectedRoute from "./assets/ProtectedRoute";

const Homepage = lazy(() => import('./assets/Homepage'))
const Product = lazy(() => import('./assets/Product'))
const Pricing = lazy(() => import('./assets/Pricing'))
const Login = lazy(() => import('./assets/Login'))
const AppLayout = lazy(() => import('./assets/AppLayout'))
const PageNotFound = lazy(() => import('./assets/PageNotFound'));
import SpinnerFullPage from './components/SpinnerFullPage'


export default function App () {
 
  return (
    <>
    <AuthProvider>
    <CitiesProvider>
      <Suspense fallback={<SpinnerFullPage />} >
      <Routes >
        <Route path="/" element={<Homepage/>} />
        <Route path="/product" element={<Product/>} />
        <Route path="/pricing" element={<Pricing/>} />
        <Route path="app"
            element={
              <ProtectedRoute>
                <AppLayout/>
              </ProtectedRoute>
            }>
            <Route index element={<Navigate replace to={'cities'} /> } />
            <Route path="cities" element={<CityList   />} />
            <Route path="cities/:id" element={<City />} />
            <Route path="countries" element ={<CountryList />} />
            <Route path="form" element={<Form />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<PageNotFound/>} />
      </Routes>
      </Suspense>
    </CitiesProvider>
    </AuthProvider>
    </>
  )
}