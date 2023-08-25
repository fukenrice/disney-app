import {StyleSheet, TextInput, View} from "react-native";
import {AntDesign} from "@expo/vector-icons";
import React from "react";


export default function ListsSearch({filterLists, setSearch, addNewList, search}: {
    filterLists: (val: string) => void,
    setSearch: (val: string) => void,
    addNewList: (val: string) => void,
    search: string
}) {

    return <View style={styles.listElementContainer}>
        <View style={styles.inputContainer}>
            <TextInput
                style={styles.input}
                placeholder={"Search..."}
                placeholderTextColor="grey"
                onChangeText={(value) => {
                    filterLists(value)
                    setSearch(value)
                }}
            />
        </View>
        <AntDesign name="pluscircleo" size={34} color="#ca3701" style={{marginTop: 5}} onPress={() => {
            if (search !== "") {
                addNewList(search)
            } else {
                alert("Empty string provided as list key")
            }
        }}/>
    </View>
}

const styles = StyleSheet.create(
    {
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
    }
)