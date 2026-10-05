import axios from "axios";


const api = axios.create({
  baseURL: "http://localhost:3000/api/auth",
  withCredentials: true,
});


export async function Register({ username, email, password }) {
  try {
    const response = await api.post(
      "/register",
      {
        username,
        email,
        password,
      },
    );
    return response.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
}


export async function Login({ email, password }) {
  try{
    const response = await api.post(
      "/login",
      {
        email,
        password,
      },
      {
        withCredentials: true,
      },
    );
    return response.data;
  }
  catch(err){
    console.log(err)
    throw err;
  }
}

export async function Logout() {
  try{
    const response = await api.get(
      "/logout",
      {
        withCredentials: true,
      },
    );
    return response.data;
  }
  catch(err){
    console.log(err);
    throw err;
  }
}

export async function GetMe() {
  try{
    const response = await api.get(
      "/get-me",
      {
        withCredentials: true,
      },
    );
    return response.data;
  }catch(err){
    console.log(err);
    throw err;
  }
}