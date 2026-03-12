import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 40,
        color: '#333',
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 10,
    },
    button: {
        backgroundColor: '#007AFF',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 8,
        width: '100%',
        alignItems: 'center',
        marginBottom: 10,
    },
    buttonDisabled: {
        backgroundColor: '#ccc',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    separator: {
        height: 1,
        backgroundColor: '#eee',
        width: '100%',
        marginVertical: 30,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 15,
        width: '100%',
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 15,
    },
});
