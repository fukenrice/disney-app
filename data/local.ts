import AsyncStorage from "@react-native-async-storage/async-storage";
import CommentModel from "../models/CommentModel";
import ListModel from "../models/ListModel";
import CharacterModel from "../models/CharacterModel";


const getLocalData = async () => {
    try {
        const jsonValue = await AsyncStorage.getItem("data")
        return jsonValue != null ? JSON.parse(jsonValue) as {
            comments: CommentModel[],
            lists: ListModel[],
            uid: string
        } : {comments: [], lists: [], uid: ""}
    } catch (e) {
        console.log(e)
    }
}

const wipeLocalData = async () => {
    try {
        await AsyncStorage.removeItem("data")
        await AsyncStorage.removeItem("chars")
    } catch (e) {
        console.log(e)
    }
}

const storeData = async (value: { comments: CommentModel[], lists: ListModel[], uid: string, }) => {
    try {
        const jsonValue = JSON.stringify(value)
        await AsyncStorage.setItem("data", jsonValue)
    } catch (e) {
        console.log(e)
    }
}

export const getLocalChars = async () => {
    try {
        const jsonValue = await AsyncStorage.getItem("chars")
        return jsonValue != null ? JSON.parse(jsonValue) as CharacterModel[] : []
    } catch (e) {
        console.log(e)
    }
}

const storeChars = async (value: CharacterModel[]) => {
    try {
        const jsonValue = JSON.stringify(value)
        await AsyncStorage.setItem("chars", jsonValue)
    } catch (e) {
        console.log(e)
    }
}

export {storeData, storeChars, getLocalData, wipeLocalData}