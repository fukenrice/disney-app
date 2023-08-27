import React, {useEffect} from "react";
import MainStack from "./Navigate"
import {useNetInfo} from "@react-native-community/netinfo";
import {getLocalData, storeData} from "./data/local";
import {auth} from "./firebase/config";
import {storeCloudData} from "./data/remote";

export default function App() {

  const netInfo = useNetInfo()

  const syncData = async () => {
    const data = await getLocalData()
    if (auth.currentUser?.uid === data!.uid) {
      storeCloudData({comments: data!.comments, lists: data!.lists})
    }
  }

  useEffect(() => {
    syncData()
  }, [netInfo.isConnected]);

  return (
        <MainStack />
  );
}
