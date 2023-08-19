import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import Login from "./components/Login";
import CharacterList from "./components/CharacterList";
import Character from "./components/Character";
import Main from "./components/Main";

const commonOptions = {
    headerShown: false,
}

const loginOptions = {
    ...commonOptions,

}

const mainOptions = {
    ...commonOptions,

}

const characterOptions = {
    ...commonOptions,

}

const characterListOptions = {
    ...commonOptions,

}

const MainStack = createStackNavigator()

export default function Navigate() {
    return <NavigationContainer>
        <MainStack.Navigator>
            <MainStack.Screen name="Main" component={Main} options={mainOptions}/>
            <MainStack.Screen name="Login" component={Login} options={loginOptions}/>
            <MainStack.Screen name="Character" component={Character} options={characterOptions}/>
            <MainStack.Screen name="CharecterList" component={CharacterList} options={characterListOptions}/>
        </MainStack.Navigator>
    </NavigationContainer>
}
