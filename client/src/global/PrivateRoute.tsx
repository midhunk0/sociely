import { useEffect, useState, type ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { type AppDispatch } from "../redux/store";
import { useDispatch } from "react-redux";
import { clearProfile, setProfile } from "../redux/profileSlice";

interface PrivateRouteProps{
    children: ReactNode;
}

export const PrivateRoute: React.FC<PrivateRouteProps>=({ children })=>{
    const [isAuth, setIsAuth]=useState<boolean | null>(null);
    const apiUrl=import.meta.env.VITE_APP_API_URL;
    const location=useLocation();
    const dispatch=useDispatch<AppDispatch>();

    useEffect(()=>{
        const fetchProfile=async()=>{
            try{
                const response=await fetch(`${apiUrl}/fetchProfile`, {
                    method: "GET",
                    credentials: "include"
                });
                if(response.ok){
                    const result=await response.json();
                    dispatch(setProfile(result.user));
                    setIsAuth(true);
                }
                else{
                    dispatch(clearProfile());
                    setIsAuth(false);
                }
            }
            catch(error){
                dispatch(clearProfile());
                setIsAuth(false);
                console.log("Error while verifying user: ", error);
            }
        };

        fetchProfile();
    }, [location.pathname, apiUrl, dispatch]);

    if(isAuth===null){
        return null;
    }

    return isAuth ? children : <Navigate to="/login"/>;
}