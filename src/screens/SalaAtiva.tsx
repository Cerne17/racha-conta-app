import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal, TextInput } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { styles } from './SalaAtiva.styles';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';

type SalaAtivaScreenRouteProp = RouteProp<RootStackParamList, 'SalaAtiva'>;

type Props = {
    route: SalaAtivaScreenRouteProp;
};

interface Item {
    id: string;
    nome: string;
    preco: number;
}

export default function SalaAtiva({ route }: Props) {
    const { roomId } = route.params;
    const [items, setItems] = useState<Item[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [newItemName, setNewItemName] = useState('');
    const [newItemPrice, setNewItemPrice] = useState('');

    const total = items.reduce((sum, item) => sum + item.preco, 0);

    const handleAddItem = () => {
        if (!newItemName || !newItemPrice) return;

        // Replace comma with dot if user typed it
        const priceValue = parseFloat(newItemPrice.replace(',', '.'));
        if (isNaN(priceValue)) return;

        const newItem: Item = {
            id: Math.random().toString(36).substring(7),
            nome: newItemName,
            preco: priceValue,
        };

        setItems((prev) => [...prev, newItem]);
        setNewItemName('');
        setNewItemPrice('');
        setModalVisible(false);
    };

    const formatCurrency = (value: number) => {
        return `R$ ${value.toFixed(2).replace('.', ',')}`;
    };

    const renderItem = ({ item }: { item: Item }) => (
        <View style={styles.itemRow}>
            <Text style={styles.itemName}>{item.nome}</Text>
            <Text style={styles.itemPrice}>{formatCurrency(item.preco)}</Text>
        </View>
    );

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

            <Text style={styles.subtitle}>Itens Consumidos (RF04)</Text>

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
                            value={newItemName}
                            onChangeText={setNewItemName}
                        />

                        <Text style={styles.inputLabel}>Valor (R$)</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ex: 15,50"
                            keyboardType="numeric"
                            value={newItemPrice}
                            onChangeText={setNewItemPrice}
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
