import React, {useEffect} from "react";
import MainStack from "./Navigate"
import {useNetInfo} from "@react-native-community/netinfo";
import {getLocalData, storeData} from "./data/local";

export default function App() {

  const netInfo = useNetInfo()

  const syncData = async () => {
    const data = await getLocalData()
    storeData(data!)
  }

  useEffect(() => {
    syncData()
  }, [netInfo.isConnected]);

  return (
        <MainStack />
  );
}
