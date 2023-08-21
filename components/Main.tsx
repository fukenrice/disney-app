import {
    ActivityIndicator,
    FlatList, Image,
    StyleSheet,
    Text,
    TextInput, TouchableOpacity,
    View
} from "react-native";
import {StatusBar} from "expo-status-bar";
import React, {useEffect, useState} from "react";
import { Ionicons } from '@expo/vector-icons';
import axios from "axios";
import Character from "../models/CharacterModel";
import AllCharsResponse from "../models/AllCharsResponse";
import NamedCharacterResponse from "../models/NamedCharacterResponse";
import {useNavigation} from '@react-navigation/core'

const SEARCH_URL = "https://api.disneyapi.dev/character?name="
const ALL_CHARACTERS_URL = "https://api.disneyapi.dev/character?page=1"


interface State {
    loading: boolean,
    loadedCharacters: Character[] | null
}

const INITIAL_STATE: State = {
    loading: true,
    loadedCharacters: []
}

export default function Main(): JSX.Element {
    const [state, setState] = useState(INITIAL_STATE)
    const navigation = useNavigation<any>()
    useEffect(() => {
        searchCharacters(ALL_CHARACTERS_URL)
    }, []);

    const test = async () => {
        const {data: {data}} = await axios.get<AllCharsResponse>(ALL_CHARACTERS_URL)
        setState({loading: false, loadedCharacters: data})
    }

    const searchCharacters = async (url: string) => {
        setState(prevState => {
            return {...prevState, loading: true}
        })
        if (url === SEARCH_URL) {
            url = ALL_CHARACTERS_URL
        }
        if (url === ALL_CHARACTERS_URL) {
            const {data: {data: qwe}} = await axios.get<AllCharsResponse>(ALL_CHARACTERS_URL)
            setState({loading: false, loadedCharacters: qwe})
        } else {
            axios.get<NamedCharacterResponse>(url).then((response) => {
                setState({loading: false, loadedCharacters: response.data.data})
            })
        }
    }
    const progressBar = <ActivityIndicator animating={true} size={"large"}/>

    const list = <FlatList
        data={state.loadedCharacters}
        renderItem={({item}) => {
            return <TouchableOpacity
                style={styles.listItem}
                onPress={() => {
                    navigation.navigate("Character")
                }}>
                <Image
                    source={item.imageUrl ? {uri: item.imageUrl} : require("../assets/no-image.jpg")}
                    style={styles.image}
                />
            </TouchableOpacity>
        }}
        numColumns={3}
    />


    return <View style={styles.container}>
        <StatusBar hidden/>
        <View style={styles.header}>
            <Text style={styles.title}>Disney</Text>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder={"Search..."}
                    placeholderTextColor="grey"
                    onSubmitEditing={(event) => {
                        searchCharacters(SEARCH_URL + event.nativeEvent.text)
                    }}
                />
            </View>
        </View>
        <View style={styles.mainGrid}>
            {state.loading ? progressBar : list}
            <Ionicons style={styles.fab} name="list-circle" size={64} onPress={() => {

            }}/>
        </View>
    </View>

}

const styles = StyleSheet.create(
    {
        container: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
        },
        header: {
            flex: 1,
            flexDirection: "row",
            backgroundColor: "#ca3701",
            width: "100%",
            justifyContent: 'space-between',
        },
        mainGrid: {
            flex: 15,
            backgroundColor: "#323232",
            width: "100%"

        },
        title: {
            color: "white",
            fontWeight: "bold",
            fontSize: 18,
            margin: 10
        },
        inputContainer: {
            alignItems: "flex-start",
            borderWidth: 1.5,
            borderRadius: 10,
            margin: 6,
            width: "50%",
            height: "70%",
            paddingLeft: 4
        },
        searchInput: {
            color: "white"
        },
        listItem: {
            width: "33.3%",
            height: "50%"
        },
        image: {
            width: '100%',
            height: undefined,
            aspectRatio: 2/3,
            flex: 1,
            borderWidth: 1,
            borderColor: 'white'
        },
        fab: {
            position: "absolute",
            alignItems: "center",
            justifyContent: "center",
            color: "#ca3701",
            right: 10,
            bottom: 20
        }
    }
)
