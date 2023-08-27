
import CharacterModel from "./CharacterModel";


export default interface AllCharsResponse {
    info: {
        count: number
    },
    data: CharacterModel[]
}