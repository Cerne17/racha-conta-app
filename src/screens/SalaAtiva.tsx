import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal, TextInput, ActivityIndicator } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { styles } from './SalaAtiva.styles';
import { useRoom, Item } from '../hooks/useRoom';

type SalaAtivaScreenRouteProp = RouteProp<RootStackParamList, 'SalaAtiva'>;

type Props = {
    route: SalaAtivaScreenRouteProp;
};

export default function SalaAtiva({ route }: Props) {
    const { roomId } = route.params;
    const { items, room, loading, addItem } = useRoom(roomId);

    const [modalVisible, setModalVisible] = useState(false);
    const [newItemName, setNewItemName] = useState('');
    const [newItemPrice, setNewItemPrice] = useState('');

    const total = items.reduce((sum, item) => sum + item.price, 0);

    const handleAddItem = async () => {
        if (!newItemName || !newItemPrice) return;

        const priceValue = parseInt(newItemPrice, 10) / 100;
        if (isNaN(priceValue) || priceValue <= 0) return;

        await addItem(newItemName, priceValue);

        setNewItemName('');
        setNewItemPrice('');
        setModalVisible(false);
    };

    const handlePriceChange = (text: string) => {
        const digits = text.replace(/\D/g, '');
        setNewItemPrice(digits);
    };

    const getFormattedPriceInput = () => {
        if (!newItemPrice) return '';
        const numericValue = parseInt(newItemPrice, 10) / 100;
        return numericValue.toFixed(2).replace('.', ',');
    };

    const formatCurrency = (value: number) => {
        return `R$ ${value.toFixed(2).replace('.', ',')}`;
    };

    const renderItem = ({ item }: { item: Item }) => (
        <View style={styles.itemRow}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemPrice}>{formatCurrency(item.price)}</Text>
        </View>
    );

    if (loading) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Mesa Ativa</Text>
                <Text style={styles.code}>ID: {roomId}</Text>
            </View>

            <View style={styles.dashboard}>
                <View style={styles.card}>
                    <Text style={styles.cardLabel}>Meu Consumo</Text>
                    <Text style={styles.cardValue}>{formatCurrency(total)}</Text>
                </View>
                <View style={styles.card}>
                    <Text style={styles.cardLabel}>Total da Mesa</Text>
                    <Text style={styles.cardValue}>{formatCurrency(total)}</Text>
                </View>
            </View>

            <Text style={styles.subtitle}>Itens Consumidos</Text>

            {items.length === 0 ? (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyText}>Nenhum item adicionado ainda.</Text>
                </View>
            ) : (
                <FlatList
                    data={items}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContainer}
                />
            )}

            <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
                <Text style={styles.fabIcon}>+</Text>
            </TouchableOpacity>

            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Adicionar Item</Text>

                        <Text style={styles.inputLabel}>Nome do Produto</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ex: Cerveja"
                            placeholderTextColor="#999"
                            value={newItemName}
                            onChangeText={setNewItemName}
                        />

                        <Text style={styles.inputLabel}>Valor (R$)</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ex: 15,50"
                            placeholderTextColor="#999"
                            keyboardType="numeric"
                            value={getFormattedPriceInput()}
                            onChangeText={handlePriceChange}
                        />

                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.button, styles.cancelButton]}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.cancelButtonText}>Cancelar</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.button, styles.addButton]}
                                onPress={handleAddItem}
                            >
                                <Text style={styles.addButtonText}>Adicionar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}
