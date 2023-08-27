import CharacterModel from "./CharacterModel";


export default interface NamedCharacterResponse {
    info: {
        "totalPages": number,
        "count": number,
        "previousPage": string,
        "nextPage": string
    },
    data: CharacterModel[]
}