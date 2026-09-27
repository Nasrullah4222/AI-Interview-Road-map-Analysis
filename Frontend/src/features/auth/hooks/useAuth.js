import { useContext } from "react";
import { AuthContext } from "../auth.context";
import { login, logout, register } from "../services/auth.api";

export const useAuth = () =>{
    const constext = useContext(AuthContext);
    const {user, setUser, loading, setLoading} = constext;

    const handleLogin = async ({email, password})=>{
        setLoading(true);
        try{
            const data = await login({email, password});
            setUser(data.user);
            return data;
        }catch(err){
            console.log(err);
            return null;
        }finally{
            setLoading(false);
        }
        
        
    }

    const handleRegister = async ({username, email, password})=>{
        setLoading(true);
        try{
            const data = await register({username, email, password});
            setUser(data.user);
        }catch(err){
            console.log(err);
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
    return {user, loading, handleRegister, handleLogin, handleLogout}
}