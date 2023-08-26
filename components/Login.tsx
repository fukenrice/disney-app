import {Button, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import {auth} from "../firebase/config";
import {useEffect, useState} from "react";
import {useNavigation} from "@react-navigation/core";


export default function Login(): JSX.Element {

    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const navigation = useNavigation<any>()

    const handeLogin= () => {
        auth.signInWithEmailAndPassword(email, password)
            .then(userCrenetials => {
                const user = userCrenetials.user
                console.log('Logged in with: ' + user?.email)
            })
            .catch(error => alert(error.message))
    }

    const handleSingUp = () => {
        auth.createUserWithEmailAndPassword(email, password)
            .then(userCredentials => {
                const user = userCredentials.user
                console.log('Registered with: ', user?.email)
            })
            .catch(error => alert(error.message))
    }


    useEffect(() => {
        return auth.onAuthStateChanged(user => {
            if (user) {
                navigation.replace("Main")
            }
        })
    }, []);


    return <View style={styles.container}>
        <View style={{marginBottom: 15, width: '100%', alignItems: 'center'}}>
            <View style={styles.inputContainer}>
                <TextInput placeholderTextColor={'grey'} placeholder={'Email'} onChangeText={(text => {
                    setEmail(text)
                })}/>
            </View>
            <View style={styles.inputContainer}>
                <TextInput placeholderTextColor={'grey'} placeholder={'Password'} secureTextEntry={true} onChangeText={text => {
                    setPassword(text)
                }}/>
            </View>
        </View>
        <TouchableOpacity style={styles.buttonLoginContainer} onPress={() => handeLogin()}>
            <Text style={{fontWeight: "bold", color: 'white', fontSize: 18}}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonRegContainer} onPress={() => handleSingUp()}>
            <Text style={{fontWeight: "bold", color: '#ff6600', fontSize: 18}}>Register</Text>
        </TouchableOpacity>

    </View>

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#303030',
        alignItems: 'center',
        justifyContent: 'center'
    },
    inputContainer: {
        padding: 5,
        backgroundColor: 'white',
        borderRadius: 5,
        width: "80%",
        margin: 4,
    },
    buttonLoginContainer: {
        backgroundColor: '#ff6600',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
        width: '60%',
        alignItems: 'center',
    },
    buttonRegContainer: {
        backgroundColor: 'white',
        borderRadius: 5,
        padding: 10,
        width: '60%',
        alignItems: 'center',
    }
})
