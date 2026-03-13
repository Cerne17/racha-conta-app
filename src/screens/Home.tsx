import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, ActivityIndicator, Alert, TouchableWithoutFeedback, Keyboard } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
    const [deviceId, setDeviceId] = useState('');

    useEffect(() => {
        async function fetchDeviceId() {
            try {
                let id = await AsyncStorage.getItem('device_id');
                if (!id) {
                    id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
                    await AsyncStorage.setItem('device_id', id);
                }
                setDeviceId(id);
            } catch (e) {
                console.error("Failed to load or generate device_id", e);
                setDeviceId(Math.random().toString());
            }
        }
        fetchDeviceId();
    }, []);

    const handleCreateRoom = async () => {
        setLoading(true);
        const roomId = Math.floor(100000 + Math.random() * 900000).toString();

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

        navigation.navigate('SalaAtiva', { roomId: `sala-${roomId}`, isHost: true, deviceId });
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

            const isUserHost = data.host_id === deviceId;
            navigation.navigate('SalaAtiva', { roomId: `sala-${code}`, isHost: isUserHost, deviceId });
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
                    returnKeyType="done"
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
        </TouchableWithoutFeedback>
    );
}
