import {FC, ReactNode, useEffect, useMemo, useState} from "react";
import {toplohladnoInstance} from "../api/toplohladno.ts";
import { AuthContext } from './authContext.ts'

const TOKEN_KEY = 'token'


const AuthProviderWrapper: FC<{ children: ReactNode }> = ({ children }) => {
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


export default AuthProviderWrapper;