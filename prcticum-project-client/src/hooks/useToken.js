import { useEffect, useState } from "react";
import { safeFetch } from "../utils/api";

const useToken = (email) => {
  const [token, setToken] = useState("");

  useEffect(() => {
    if (email) {
      const loadToken = async () => {
        try {
          console.log('useToken: requesting token for', email);
          const data = await safeFetch(`http://localhost:5000/jwt?email=${email}`);
          console.log('useToken: safeFetch returned', data);
          if (data && data.accessToken) {
            localStorage.setItem("accessToken", data.accessToken);
            setToken(data.accessToken);
          }
        } catch (err) {
          console.error('useToken: safeFetch error', err);
          // fallback: try a plain fetch and log response body for debugging
          try {
            const res = await fetch(`http://localhost:5000/jwt?email=${email}`);
            const text = await res.text();
            console.error('useToken: fallback fetch status', res.status, 'body:', text);
            try {
              const json = JSON.parse(text);
              if (json && json.accessToken) {
                localStorage.setItem("accessToken", json.accessToken);
                setToken(json.accessToken);
              }
            } catch (parseErr) {
              console.error('useToken: fallback parse error', parseErr);
            }
          } catch (fallbackErr) {
            console.error('useToken: fallback fetch failed', fallbackErr);
          }
        }
      };
      loadToken();
    }
  }, [email]);
  return [token];
};
export default useToken;