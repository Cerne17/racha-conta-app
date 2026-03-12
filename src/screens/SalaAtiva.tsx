import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';

type SalaAtivaScreenRouteProp = RouteProp<RootStackParamList, 'SalaAtiva'>;

type Props = {
    route: SalaAtivaScreenRouteProp;
};

export default function SalaAtiva({ route }: Props) {
    const { roomId } = route.params;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Mesa Ativa</Text>
                <Text style={styles.code}>ID: {roomId}</Text>
            </View>

            <View style={styles.dashboard}>
                <View style={styles.card}>
                    <Text style={styles.cardLabel}>Meu Consumo</Text>
                    <Text style={styles.cardValue}>R$ 0,00</Text>
                </View>
                <View style={styles.card}>
                    <Text style={styles.cardLabel}>Total da Mesa</Text>
                    <Text style={styles.cardValue}>R$ 0,00</Text>
                </View>
            </View>

            <Text style={styles.subtitle}>Itens Consumidos (RF04)</Text>

            <View style={styles.emptyState}>
                <Text style={styles.emptyText}>Nenhum item adicionado ainda.</Text>
            </View>

            <TouchableOpacity style={styles.fab}>
                <Text style={styles.fabIcon}>+</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        padding: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    code: {
        fontSize: 16,
        color: '#666',
    },
    dashboard: {
        flexDirection: 'row',
        padding: 15,
        justifyContent: 'space-between',
    },
    card: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 8,
        width: '48%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    cardLabel: {
        fontSize: 12,
        color: '#666',
        marginBottom: 5,
    },
    cardValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#007AFF',
    },
    subtitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginHorizontal: 15,
        marginTop: 10,
        marginBottom: 10,
    },
    emptyState: {
        padding: 20,
        alignItems: 'center',
    },
    emptyText: {
        color: '#999',
    },
    fab: {
        position: 'absolute',
        bottom: 30,
        right: 30,
        backgroundColor: '#007AFF',
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    fabIcon: {
        color: '#fff',
        fontSize: 30,
        lineHeight: 34,
    },
});
