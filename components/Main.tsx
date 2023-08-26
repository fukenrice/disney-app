import {
    ActivityIndicator,
    FlatList, Image, StyleProp,
    StyleSheet,
    Text,
    TextInput, TouchableOpacity,
    View, ViewStyle
} from "react-native";
import {StatusBar} from "expo-status-bar";
import React, { useEffect, useMemo, useRef, useState} from "react";
import {AntDesign, Ionicons} from '@expo/vector-icons';
import axios from "axios";
import CharacterModel from "../models/CharacterModel";
import AllCharsResponse from "../models/AllCharsResponse";
import NamedCharacterResponse from "../models/NamedCharacterResponse";
import {useNavigation} from '@react-navigation/core'
import BottomSheet from "@gorhom/bottom-sheet";
import ListModel from "../models/ListModel";
import {MaterialIcons} from '@expo/vector-icons';
import {auth} from "../firebase/config";
import CommentModel from "../models/CommentModel";
import {getCloudData, storeCloudData} from "../data/remote";
import ListsSearch from "./ListsSearch";
import { useIsFocused } from "@react-navigation/native";
import {getLocalChars, getLocalData, storeChars, storeData} from "../data/local";
import {useNetInfo} from "@react-native-community/netinfo";
const SEARCH_URL = "https://api.disneyapi.dev/character?name="
const ALL_CHARACTERS_URL = "https://api.disneyapi.dev/character?page=1"


interface State {
    loading: boolean,
    loadedCharacters: CharacterModel[] | null
}

const INITIAL_STATE: State = {
    loading: true,
    loadedCharacters: []
}

export default function Main(): JSX.Element {
    const [state, setState] = useState(INITIAL_STATE)
    const navigation = useNavigation<any>()
    const isFocused = useIsFocused();
    const netInfo = useNetInfo();

    const [listsState, setListsState] = useState<ListModel[]>([])
    const [commentsState, setCommentsState] = useState<CommentModel[]>([])
    const [displayedLists, setDisplayedLists] = useState<ListModel[]>([])
    const [search, setSearch] = useState("")
    const listsRef = useRef<ListModel[]>()
    listsRef.current = listsState
    const commentsRef = useRef<CommentModel[]>()
    commentsRef.current = commentsState

    useEffect(() => {
        searchCharacters(ALL_CHARACTERS_URL)
        return () => {
            storeData({comments: commentsRef.current!, lists: listsRef.current!})
        }
    }, []);

    useEffect(() => {
        searchCharacters(ALL_CHARACTERS_URL)
        getData()
    }, [netInfo]);

    useEffect(() => {
        getData()
    }, [isFocused]);

    useEffect(() => {
        filterLists(search)
    }, [listsState]);


    const getData = async () => {
        var doc: { comments: CommentModel[], lists: ListModel[] } | undefined
        if (netInfo.isConnected) {
            doc = await getCloudData() as { comments: CommentModel[], lists: ListModel[] }
        } else {
            doc = await getLocalData()
        }

        setListsState(doc!.lists)
        setDisplayedLists(doc!.lists)
        setCommentsState(doc!.comments)
    }

    const filterLists = (query: string) => {
        setDisplayedLists(listsState.filter((e) => e.key.includes(query)))
    }

    const deleteList = (listName: string) => {
        setListsState(prevState => {
            const newLists = prevState.filter((e) => e.key !== listName)
            setDisplayedLists(newLists.filter((e) => e.key.includes(search)))
            storeCloudData({comments: commentsState, lists: newLists})
            return newLists
        })
    }

    const addNewList = (listName: string) => {
        if (!listsState.find((e) => e.key === listName)) {
            setListsState(prevState => {
                const newList = [...prevState, {key: listName, characters: []}]
                storeCloudData({comments: commentsState, lists: newList})
                return newList
            })
        } else {
            alert(`List with name "${listName}" already exists.`)
        }
    }

    const renderRef = React.useRef<BottomSheet>(null)
    const snapPoints = useMemo(() => ['50%'], [])


    const handleSignOut = () => {
        auth.signOut()
            .then(() => {
                navigation.replace("Login")
            })
            .catch(error => alert(error.message))
    }

    const searchCharacters = async (url: string) => {
        setState(prevState => {
            return {...prevState, loading: true}
        })
        if (url === SEARCH_URL) {
            url = ALL_CHARACTERS_URL
        }
        if (url === ALL_CHARACTERS_URL) {
            if (!netInfo.isConnected) {
                const chars = await getLocalChars()
                setState({loading: false, loadedCharacters: chars!})
                return
            }
            const {data: {data: chars}} = await axios.get<AllCharsResponse>(ALL_CHARACTERS_URL)
            storeChars(chars)
            setState({loading: false, loadedCharacters: chars})
        } else {
            if (!netInfo.isConnected) {
                alert("No internet connection. Now you only can see cached characters.")
            }
            axios.get<NamedCharacterResponse>(url).then((response) => {
                setState({loading: false, loadedCharacters: response.data.data})
            })
        }
    }
    const progressBar = <ActivityIndicator animating={true} size={"large"}/>

    const bottomSheetLists = <View style={styles.bottomSheet}>
        {<ListsSearch filterLists={filterLists} setSearch={setSearch} addNewList={addNewList} search={search}/>}
        <FlatList style={{width: "100%"}} data={displayedLists} renderItem={({item}) => {
            return <View style={styles.listElementContainer}>
                <TouchableOpacity style={styles.listTitleContainer} onPress={() => {
                    // console.log(item.characters)
                    navigation.navigate("CharacterList", {chars: item.characters, title: item.key})
                }}>
                    <Text style={{color: "white", fontSize: 30}}>{item.key}</Text>
                </TouchableOpacity>

                <AntDesign name="minuscircleo" size={34} color="#ca3701" style={{marginTop: 5}} onPress={() => {
                    deleteList(item.key)
                }}/>
            </View>
        }}
        />
    </View>

    const list = <FlatList
        data={state.loadedCharacters}
        renderItem={({item}) => {
            return <TouchableOpacity
                style={styles.listItem}
                onPress={() => {
                    navigation.navigate("Character", {char: item})
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
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={styles.title}>Disney</Text>
                <TouchableOpacity onPress={() => handleSignOut()}>
                    <MaterialIcons style={{marginTop: 4}} name="logout" size={30} color="white"/>
                </TouchableOpacity>

            </View>

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
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
                renderRef.current?.expand()
            }}/>
        </View>
        <BottomSheet
            ref={renderRef}
            index={-1}
            snapPoints={snapPoints}
            enablePanDownToClose={true}
            handleIndicatorStyle={styles.handleIndicator as StyleProp<ViewStyle>}
            handleStyle={styles.handle}
        >
            {bottomSheetLists}
        </BottomSheet>
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
        input: {
            color: "white"
        },
        listItem: {
            width: "33.3%",
            height: "50%"
        },
        image: {
            width: '100%',
            height: undefined,
            aspectRatio: 2 / 3,
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
        },
        bottomSheet: {
            backgroundColor: "#444444",
            flex: 1,
            alignItems: "center",
            padding: 10
        },
        handleIndicator: {
            color: '#323232'
        },
        handle: {
            backgroundColor: "#444444",
        },
        listTitleContainer: {
            borderWidth: 1,
            borderColor: 'black',
            borderRadius: 5,
            width: "80%",
        },
        listElementContainer: {
            width: "100%",
            flexDirection: "row",
            justifyContent: 'space-between',
        },
    }
)
