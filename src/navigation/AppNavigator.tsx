import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../screens/Home';
import SalaAtiva from '../screens/SalaAtiva';

export type RootStackParamList = {
    Home: undefined;
    SalaAtiva: { roomId: string; isHost?: boolean; deviceId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Home">
                <Stack.Screen
                    name="Home"
                    component={Home}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="SalaAtiva"
                    component={SalaAtiva}
                    options={{ title: 'Racha-Conta' }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
