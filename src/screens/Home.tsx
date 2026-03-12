import React from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { styles } from './Home.styles';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

type Props = {
    navigation: HomeScreenNavigationProp;
};

export default function Home({ navigation }: Props) {
    const [code, setCode] = React.useState('');

    const handleCreateRoom = () => {
        // Logic for RF01 - Criação de Sala
        const roomId = 'sala-' + Math.floor(100000 + Math.random() * 900000).toString();
        navigation.navigate('SalaAtiva', { roomId });
    };

    const handleJoinRoom = () => {
        if (code.length === 6) {
            // Logic for RF03 - Entrada via Código
            navigation.navigate('SalaAtiva', { roomId: `sala-${code}` });
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Racha Conta</Text>

            <TouchableOpacity style={styles.button} onPress={handleCreateRoom}>
                <Text style={styles.buttonText}>Criar Nova Sala</Text>
            </TouchableOpacity>

            <View style={styles.separator} />

            <Text style={styles.subtitle}>Ou entre com um código</Text>
            <TextInput
                style={styles.input}
                placeholder="Código de 6 dígitos"
                keyboardType="numeric"
                maxLength={6}
                value={code}
                onChangeText={setCode}
            />
            <TouchableOpacity
                style={[styles.button, code.length !== 6 && styles.buttonDisabled]}
                onPress={handleJoinRoom}
                disabled={code.length !== 6}
            >
                <Text style={styles.buttonText}>Entrar na Sala</Text>
            </TouchableOpacity>
        </View>
    );
}
