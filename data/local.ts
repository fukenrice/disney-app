import AsyncStorage from "@react-native-async-storage/async-storage";
import CommentModel from "../models/CommentModel";
import ListModel from "../models/ListModel";
import CharacterModel from "../models/CharacterModel";


const getLocalData = async () => {
    try {
        const jsonValue = await AsyncStorage.getItem("data")
        return jsonValue != null ? JSON.parse(jsonValue) as {comments: CommentModel[], lists: ListModel[]} : {comments: [], lists: []}
    } catch (e) {
        console.log(e)
    }
}

const storeData = async (value: {comments: CommentModel[], lists: ListModel[]}) => {
    try {
        const jsonValue = JSON.stringify(value)
        await AsyncStorage.setItem("data", jsonValue)
    } catch (e) {
        console.log(e)
    }
}

const getLocalChars = async () => {
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

export {storeData, storeChars, getLocalData, getLocalChars}