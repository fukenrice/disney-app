import {
    FlatList, Image,
    StyleSheet,
    Text,
    TextInput, TouchableOpacity,
    View
} from "react-native";
import {StatusBar} from "expo-status-bar";
import React, {useCallback, useEffect, useMemo, useState} from "react";
import CharacterModel from "../models/CharacterModel";

import {useNavigation} from '@react-navigation/core'

import {CharacterListProps} from "../Navigate";
import {useIsFocused} from "@react-navigation/native";
import {getCloudData} from "../data/remote";
import CommentModel from "../models/CommentModel";
import ListModel from "../models/ListModel";
import {getLocalData} from "../data/local";
import {useNetInfo} from "@react-native-community/netinfo";

export default function CharacterList({route: {params: {title, chars}}}: CharacterListProps): JSX.Element {
    const navigation = useNavigation<any>()
    const isFocused = useIsFocused();
    const [displayedChars, setDisplayedChars] = useState<CharacterModel[]>(chars)
    const [searchQuery, setSearchQuery] = useState<string>("")
    const netInfo = useNetInfo()
    const getData = async () => {
        var doc: { comments: CommentModel[], lists: ListModel[] } | undefined
        if (netInfo.isConnected) {
            doc = await getCloudData() as { comments: CommentModel[], lists: ListModel[] }
        } else {
            doc = await getLocalData()
        }
        chars = doc!.lists.find((e) => e.key === title)?.characters!
        filterChars(searchQuery)
    }

    useEffect(() => {
        getData()
    }, [isFocused]);


    const filterChars = (query: string) => {
        setDisplayedChars(chars.filter((e) => e.name.includes(query)))
    }

    const list = <FlatList
        data={displayedChars}
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
                <Text style={styles.title}>{title}</Text>
            </View>

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder={"Search..."}
                    placeholderTextColor="grey"
                    onChangeText={(text) => {
                        setSearchQuery(text)
                        filterChars(text)
                    }}
                />
            </View>
        </View>
        <View style={styles.mainGrid}>
            {list}
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
            width: "100%",
        },
        listElementContainer: {
            width: "100%",
            flexDirection: "row",
            justifyContent: 'space-between',
        },
    }
)
