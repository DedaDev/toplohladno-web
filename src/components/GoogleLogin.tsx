import {useGoogleLogin} from "@react-oauth/google";
import {toplohladnoInstance} from "../api/toplohladno.ts";

export const GoogleLoginCustomComponent = () => {

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async tokenResponse => {
      console.log('jeee token', tokenResponse)
      const response = await toplohladnoInstance.post('/auth/google-login', { token: tokenResponse.access_token })
      console.log(response)
    }
  });

  return <button className="text-xl text-white bg-black" onClick={() => handleGoogleLogin()}>udri mujo</button>
}