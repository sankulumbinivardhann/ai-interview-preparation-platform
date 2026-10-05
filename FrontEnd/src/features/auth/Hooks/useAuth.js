import { useContext, useEffect } from "react";
import { AuthContext } from "../auth.context.jsx";
import { Login, Register, Logout, GetMe } from "../services/auth.api.js";

export const useAuth = () => {
  const context = useContext(AuthContext);

  const { user, setUser, loading, setLoading } = context;

  const HandleLogin = async ({ email, password }) => {
    setLoading(true);
    try {
      const data = await Login({ email, password });
      setUser(data.user);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const HandleRegister = async ({ username, email, password }) => {
    setLoading(true);

    try {
      const data = await Register({ username, email, password });
      setUser(data.user);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const HandleLogout = async () => {
    setLoading(true);
    try {
      await Logout();
      setUser(null);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const getAndSetUser = async () => {
      try {
        const data = await GetMe();
        setUser(data.user);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    getAndSetUser();
  }, [setLoading, setUser]);

  return {
    user,
    loading,
    HandleLogin,
    HandleRegister,
    HandleLogout,
  };
};