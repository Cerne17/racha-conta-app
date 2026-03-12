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
                code: roomId,
                host_id: deviceId,
                status: 'active',
                tip_split_mode: 'equal',
                bill_split_mode: 'equal',
                last_activity_at: new Date().toISOString()
            }
        ]);

        setLoading(false);

        if (error) {
            console.error("Erro ao criar sala no Supabase:", error.message, error.details);
            Alert.alert("Erro ao criar sala", error.message);
            return;
        }

        navigation.navigate('SalaAtiva', { roomId: `sala-${roomId}`, isHost: true });
    };

    const handleJoinRoom = async () => {
        if (code.length === 6) {
            setLoading(true);
            const { data, error } = await supabase
                .from('rooms')
                .select('*')
                .eq('code', code)
                .single();

            setLoading(false);

            if (error || !data) {
                console.error("Erro ao buscar sala:", error?.message, error?.details);
                Alert.alert("Erro", error ? error.message : "Sala não encontrada.");
                return;
            }

            navigation.navigate('SalaAtiva', { roomId: `sala-${code}`, isHost: false });
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
