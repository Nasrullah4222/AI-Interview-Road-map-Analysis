import { useContext, useState } from "react";
import { AuthContext } from "../auth.context";
import { login, logout, register } from "../services/auth.api";

export const useAuth = () =>{
    const constext = useContext(AuthContext);
    const {user, setUser, loading, setLoading} = constext;
    const [error, setError] = useState(null);

    const handleLogin = async ({email, password})=>{
        setLoading(true);
        if(!email || !password){
            setError("Please provide email and password.");
            setLoading(false);
            return null;
        }
        try{
            const data = await login({email, password});
            setUser(data.user);
            return data;
        }catch(err){
            setError(err.response?.data?.message || "Unable to log in.");
            return null;
        }finally{
            setLoading(false);
        }
        
        
    }

    const handleRegister = async ({username, email, password})=>{
        setLoading(true);
        setError(null);
        try{
            const data = await register({username, email, password});
            setUser(data.user);
            return data;
        }catch(err){
            setError(err.response?.data?.message || "Unable to register.");
            return null;
        }finally{
           setLoading(false); 
        }
        
        
    }
    const handleLogout = async ()=>{
        setLoading(true);
        try{
            await logout();
            setUser(null);
        }catch(err){
            console.log(err);
        }finally{
           setLoading(false); 
        }
        
      
    }
    return {user, loading, error, handleRegister, handleLogin, handleLogout}
}