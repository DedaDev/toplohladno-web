import {createContext, FC, ReactNode, useContext, useEffect, useMemo, useState} from "react";
import {toplohladnoInstance} from "../api/toplohladno.ts";

const TOKEN_KEY = 'token'

interface IContextProps {
 token: string | null
 setToken: (t: string | null) => void
}

const AuthContext = createContext<IContextProps>({ token: null, setToken: () => {} });

const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken_] = useState<null | string>(localStorage.getItem(TOKEN_KEY));

  const setToken = (newToken: string | null) => {
    setToken_(newToken);
  };

  useEffect(() => {
    if (token) {
      toplohladnoInstance.defaults.headers.common["Authorization"] = "Bearer " + token;
      localStorage.setItem(TOKEN_KEY,token);
    } else {
      delete toplohladnoInstance.defaults.headers.common["Authorization"];
      localStorage.removeItem(TOKEN_KEY)
    }
  }, [token]);

  const contextValue = useMemo(
    () => ({
      token,
      setToken,
    }),
    [token]
  );


  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthProvider;