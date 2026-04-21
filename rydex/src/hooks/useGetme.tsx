'use client';

import { setUserData } from "../redux/userSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetme = (enabled: boolean) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!enabled) return;

    const getMe = async () => {
      try {
        const { data } = await axios.get("/api/user/me");
        dispatch(setUserData(data));
      } catch (error) {
        console.error("Failed to load current user", error);
      }
    };

    getMe();
  }, [dispatch, enabled]);
};

export default useGetme;
