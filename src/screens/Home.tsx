import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ActivityIndicator, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { styles } from './Home.styles';
import { supabase } from '../services/supabase';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

type Props = {
    navigation: HomeScreenNavigationProp;
};

export default function Home({ navigation }: Props) {
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);

    const handleCreateRoom = async () => {
        setLoading(true);
        const roomId = Math.floor(100000 + Math.random() * 900000).toString();
        const deviceId = Math.random().toString(36).substring(7); // In a real app, use DeviceInfo

        const { error } = await supabase.from('rooms').insert([
            {
                id: Math.random().toString(), // Mudar no banco real para geração auto UUID
                code: roomId,
                host_id: deviceId,
                status: 'active',
                tip_split_mode: 'equal',
                bill_split_mode: 'equal',
                last_activity_at: new Date().toISOString()
            }
        ]);

        if (error) {
            console.warn("Could not create room in Supabase (Expected if credentials are not set)", error);
        }

        setLoading(false);
        navigation.navigate('SalaAtiva', { roomId: `sala-${roomId}` });
    };

    const handleJoinRoom = async () => {
        if (code.length === 6) {
            setLoading(true);
            const { data, error } = await supabase
                .from('rooms')
                .select('*')
                .eq('code', code)
                .single();

            if (error || !data) {
                console.warn("Room not found in Supabase (Expected if credentials are not set)", error);
                Alert.alert("Erro", "Sala não encontrada. Como o banco de dados não está configurado, simulando entrada offline.");
            }

            setLoading(false);
            navigation.navigate('SalaAtiva', { roomId: `sala-${code}` });
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Racha Conta</Text>

            <TouchableOpacity style={styles.button} onPress={handleCreateRoom} disabled={loading}>
                {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Criar Nova Sala</Text>}
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
                disabled={code.length !== 6 || loading}
            >
                {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Entrar na Sala</Text>}
            </TouchableOpacity>
        </View>
    );
}
