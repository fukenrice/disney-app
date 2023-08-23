import {
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
import React, {useCallback, useEffect, useMemo, useRef} from "react";
import {CharacterProps} from "../Navigate";
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {AntDesign} from '@expo/vector-icons';
import BottomSheet from '@gorhom/bottom-sheet';
import {
    longPressGestureHandlerProps
} from "react-native-gesture-handler/lib/typescript/handlers/LongPressGestureHandler";
import ListModel from "../models/ListModel";

export default function Character({route: {params: {char}}}: CharacterProps): JSX.Element {

    useEffect(() => {
        console.log(char)
        // TODO: load lists
        // TODO: load comments
    }, []);

    const renderRef = React.useRef<BottomSheet>(null)
    const commentsRef = React.useRef<BottomSheet>(null)
    const snapPoints = useMemo(() => ['50%'], []);
    const handleSheetChanges = useCallback((index: number) => {
        console.log('handleSheetChanges', index);
    }, []);

    const sample: ListModel[] = [{
        key: "test1",
        characters: []
    }]
    const comment = ""

    const characterInList = (listName: string, charName: string): boolean => {

        return false
    }

    const bottomSheetComments = <View style={styles.bottomSheet}>
        <View style={styles.commentContainer}>
            <TextInput style={styles.input} multiline={true} placeholder={"Comment..."} placeholderTextColor={"#808080"}>
                {comment}
            </TextInput>
        </View>


    </View>

    const bottomSheetLists = <View style={styles.bottomSheet}>
        <View style={styles.listElementContainer}>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder={"Search..."}
                    placeholderTextColor="grey"
                    onSubmitEditing={(event) => {
                        // TODO: filter list
                    }}
                />
            </View>
            <AntDesign name="pluscircleo" size={34} color="#ca3701" style={{marginTop: 5}} onPress={() => {
                // TODO: Add list
            }}/>
        </View>

        <FlatList style={{width: "100%"}} data={sample} renderItem={({item}) => {
            return <View style={styles.listElementContainer}>
                <Text style={{color: "white", fontSize: 30}}>{item.key}</Text>
                {/*<Text style={{color: "white", fontSize: 30}}>{item.key}</Text>*/}
                {characterInList(item.key, char.name) ?
                    <AntDesign name="minuscircleo" size={34} color="#ca3701" style={{marginTop: 5}} onPress={() => {
                        // TODO: Remove from list list
                    }}/>
                    :
                    <AntDesign name="pluscircleo" size={34} color="#ca3701" style={{marginTop: 5}} onPress={() => {
                        // TODO: Add to list
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

                                            console.log("123")
                                            commentsRef.current?.close()
                                            renderRef.current?.expand()

                                        }}
                />
                {/*// TODO: Повесиить онклик на фабы и выводить ботомщит*/}

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
        // position: "absolute",
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
        // flex: 1,
        // alignItems: "flex-start",
        width: "100%",
        flexDirection: "row",
        justifyContent: 'space-between',
    },
    commentContainer: {
        width: "100%",
        height: "100%",
        // backgroundColor: "#808080",
        backgroundColor: "#555555",
        padding: 5,
        borderRadius: 10,
    }
})
