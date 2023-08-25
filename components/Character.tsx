import {
    Animated,
    FlatList,
    Image,
    ImageBackground,
    ScrollView, StyleProp,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View, ViewStyle
} from "react-native";
import {LinearGradient} from "expo-linear-gradient";
import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {CharacterProps} from "../Navigate";
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {AntDesign} from '@expo/vector-icons';
import BottomSheet from '@gorhom/bottom-sheet';
import {
    longPressGestureHandlerProps
} from "react-native-gesture-handler/lib/typescript/handlers/LongPressGestureHandler";
import ListModel from "../models/ListModel";
import add = Animated.add;
import {getCloudData, storeCloudData} from "../data/remote";
import CommentModel from "../models/CommentModel";
import ListsSearch from "./ListsSearch";

export default function Character({route: {params: {char}}}: CharacterProps): JSX.Element {

    const initComment = (comments: CommentModel[]) => {
        for (var commentElem of comments) {
            if (commentElem.charId === char._id) {
                setComment(commentElem.comment)
                break
            }
        }
    }

    const getData = async () => {
        const doc = await getCloudData() as { comments: CommentModel[], lists: ListModel[] }
        setListsState(doc.lists)
        setDisplayedLists(doc.lists)
        setCommentsState(doc.comments)
        initComment(doc.comments)
    }

    useEffect(() => {
        getData()
    }, []);

    const [listsState, setListsState] = useState<ListModel[]>([])
    const [commentsState, setCommentsState] = useState<CommentModel[]>([])
    const [displayedLists, setDisplayedLists] = useState<ListModel[]>([])
    const [comment, setComment] = useState("")
    const [search, setSearch] = useState("")

    useEffect(() => {
        filterLists(search)
    }, [listsState]);

    const filterLists = (query: string) => {
        setDisplayedLists(listsState.filter((e) => e.key.includes(query)))
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

    const addToList = (listKey: string) => {
        setListsState((prevState) => {
            // Do I need to create a copy or I can just work with state itself?
            var prevLists = [...prevState]
            for (var listElement of prevLists) {
                if (listElement.key === listKey) {
                    listElement.characters = [...listElement.characters, char]
                    break;
                }
            }
            storeCloudData({comments: commentsState, lists: prevLists})
            return prevLists
        })
    }

    const removeFromList = (listKey: string) => {
        setListsState((prevState) => {
            // Do I need to create a copy or I can just work with state itself?
            var prevLists = [...prevState]
            for (var listElement of prevLists) {
                if (listElement.key === listKey) {
                    console.log(char._id === listElement.characters[0]._id)
                    listElement.characters = listElement.characters.filter((e) => {
                        return e._id !== char._id
                    })
                    console.log(listElement.characters)
                    break;
                }
            }
            storeCloudData({comments: commentsState, lists: prevLists})
            return prevLists
        })
    }

    const addComment = (com: string) => {
        setCommentsState((prevState) => {
            let added = false
            var prevComments = [...prevState]
            for (var comElement of prevComments) {
                if (comElement.charId === char._id) {
                    comElement.comment = com
                    added = true
                    break
                }
            }
            if (!added) {
                prevComments = [...prevComments, {charId: char._id, comment: com}]
            }
            storeCloudData({comments: prevComments, lists: listsState})
            return prevComments
        })

    }

    const renderRef = React.useRef<BottomSheet>(null)
    const commentsRef = React.useRef<BottomSheet>(null)
    const snapPoints = useMemo(() => ['50%'], []);
    const handleSheetChanges = useCallback((index: number) => {
        console.log('handleSheetChanges', index);
    }, []);


    const characterInList = (listName: string, charId: number): boolean => {
        for (var listElement of listsState) {
            if (listElement.key === listName) {
                for (var charElem of listElement.characters) {
                    if (charElem._id === charId) {
                        return true
                    }
                }
            }
        }
        return false
    }

    const bottomSheetComments = <View style={styles.bottomSheet}>
        <View style={styles.commentContainer}>
            <TextInput style={styles.input} multiline={true} placeholder={"Comment..."} placeholderTextColor={"#808080"}
                       onChangeText={(text) => {
                           addComment(text)
                       }}>
                {comment}
            </TextInput>
        </View>


    </View>

    const bottomSheetLists = <View style={styles.bottomSheet}>
        {<ListsSearch filterLists={filterLists} setSearch={setSearch} addNewList={addNewList} search={search}/>}

        <FlatList style={{width: "100%"}} data={displayedLists} renderItem={({item}) => {
            return <View style={styles.listElementContainer}>
                <Text style={{color: "white", fontSize: 30}}>{item.key}</Text>
                {characterInList(item.key, char._id) ?
                    <AntDesign name="minuscircleo" size={34} color="#ca3701" style={{marginTop: 5}} onPress={() => {
                        removeFromList(item.key)
                    }}/>
                    :
                    <AntDesign name="pluscircleo" size={34} color="#ca3701" style={{marginTop: 5}} onPress={() => {
                        addToList(item.key)
                    }}
                    />
                }
            </View>
        }}
        />
    </View>

    return <ImageBackground style={styles.container}
                            source={{uri: "https://files.tugatech.com.pt/imagens/topicos/tugatech-2016-10-06-fc871516-44ca-4f26-9f29-9297ba27ff8a.jpg"}}
                            blurRadius={0.1}>

        <LinearGradient
            colors={["#00000000", "#333333"]}
            style={styles.gradient}
            end={{x: 0.5, y: 0.6}}>
            <View style={styles.fabContainer}>
                <MaterialCommunityIcons name="star-circle" size={64} style={styles.fab}
                                        onPress={() => {
                                            commentsRef.current?.close()
                                            renderRef.current?.expand()

                                        }}
                />

                <MaterialCommunityIcons name="pencil-circle" size={64} style={styles.fab}
                                        onPress={() => {
                                            renderRef.current?.close()
                                            commentsRef.current?.expand()
                                        }}/>
            </View>
            <Image source={{uri: char.imageUrl}} style={styles.image}/>
            <Text style={styles.name}>{char.name}</Text>
            <ScrollView style={styles.description}>
                <Text style={styles.text}>List of films: {char.films.map((item) => {
                    return item + "; "
                })}</Text>
                <Text style={styles.text}>List of TV Shows: {char.tvShows.map((item) => {
                    return item + "; "
                })}</Text>
                <Text style={styles.text}>List of short films: {char.shortFilms.map((item) => {
                    return item + "; "
                })}</Text>
                <Text style={styles.text}>List of video games: {char.videoGames.map((item) => {
                    return item + "; "
                })}</Text>
            </ScrollView>

        </LinearGradient>

        <BottomSheet
            ref={renderRef}
            index={-1}
            snapPoints={snapPoints}
            onChange={handleSheetChanges}
            enablePanDownToClose={true}
            handleIndicatorStyle={styles.handleIndicator as StyleProp<ViewStyle>}
            handleStyle={styles.handle}
        >
            {bottomSheetLists}
        </BottomSheet>

        <BottomSheet
            ref={commentsRef}
            index={-1}
            snapPoints={snapPoints}
            onChange={handleSheetChanges}
            enablePanDownToClose={true}
            handleIndicatorStyle={styles.handleIndicator as StyleProp<ViewStyle>}
            handleStyle={styles.handle}
        >
            {bottomSheetComments}
        </BottomSheet>

    </ImageBackground>

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    gradient: {
        flex: 1,
        alignItems: "center"
    },
    image: {
        marginTop: 130,
        width: '50%',
        height: '50%',
        aspectRatio: 2 / 3,
        flex: 1,
        borderWidth: 1,
        borderColor: 'white'
    },
    name: {
        fontWeight: "bold",
        color: "white",
        fontSize: 20

    },
    text: {
        color: "white"
    },
    description: {
        padding: 10,
        flex: 1,
        marginTop: 20
    },
    fabContainer: {
        position: "absolute",
        right: 10,
        top: 10
    },
    fab: {
        color: "#ca3701",
        right: 10,
        top: 10
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
    input: {
        color: "white"
    },
    inputContainer: {
        alignItems: "flex-start",
        borderWidth: 1.5,
        borderRadius: 10,
        marginTop: 6,
        width: "80%",
        height: "80%",
        paddingLeft: 4,
    },
    listElementContainer: {
        width: "100%",
        flexDirection: "row",
        justifyContent: 'space-between',
    },
    commentContainer: {
        width: "100%",
        height: "100%",
        backgroundColor: "#555555",
        padding: 5,
        borderRadius: 10,
    }
})
