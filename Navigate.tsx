import React from "react";
import { createStackNavigator, StackScreenProps } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import Login from "./components/Login";
import CharacterList from "./components/CharacterList";
import Character from "./components/Character";
import Main from "./components/Main";
import CharacterModel from "./models/CharacterModel";

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

type RootStackParamList = {
    Character: { char: CharacterModel };
    Main: undefined;
    Login: undefined;
    CharacterList: undefined;
}

const MainStack = createStackNavigator<RootStackParamList>()

export type CharacterProps = StackScreenProps<RootStackParamList, 'Character'>;


export default function Navigate() {
    return <NavigationContainer>
        <MainStack.Navigator>
            <MainStack.Screen name="Login" component={Login} options={loginOptions}/>
            <MainStack.Screen name="Main" component={Main} options={mainOptions}/>
            <MainStack.Screen name="Character" component={Character} options={characterOptions}/>
            <MainStack.Screen name="CharacterList" component={CharacterList} options={characterListOptions}/>
        </MainStack.Navigator>
    </NavigationContainer>
}
