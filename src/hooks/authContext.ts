import {createContext, useContext} from "react";

interface IContextProps {
    token: string | null
    setToken: (t: string | null) => void
}


export const AuthContext = createContext<IContextProps>({ token: null, setToken: () => {} });

export const useAuth = () => {
  return useContext(AuthContext);
};
