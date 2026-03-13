import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal, TextInput, ActivityIndicator, Alert, TouchableWithoutFeedback, Keyboard } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { supabase } from '../services/supabase';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { styles } from './SalaAtiva.styles';
import { useRoom, Item } from '../hooks/useRoom';

type SalaAtivaScreenRouteProp = RouteProp<RootStackParamList, 'SalaAtiva'>;

type Props = {
    route: SalaAtivaScreenRouteProp;
};

export default function SalaAtiva({ route }: Props) {
    const { roomId, isHost, deviceId } = route.params;
    const { items, room, loading, addItem, toggleItemClaim, refreshData } = useRoom(roomId);

    const [modalVisible, setModalVisible] = useState(false);
    const [checkoutModalVisible, setCheckoutModalVisible] = useState(false);
    const [summaryModalVisible, setSummaryModalVisible] = useState(false);
    const [newItemName, setNewItemName] = useState('');
    const [newItemPrice, setNewItemPrice] = useState('');
    const [newItemQuantity, setNewItemQuantity] = useState('1');
    const [billSplitMode, setBillSplitMode] = useState<'equal' | 'individual'>('equal');
    const [tipSplitMode, setTipSplitMode] = useState<'equal' | 'proportional'>('equal');
    const [checkoutTipPercentage, setCheckoutTipPercentage] = useState('10');

    useEffect(() => {
        if (room?.status === 'closed') {
            setSummaryModalVisible(true);
        }
    }, [room?.status]);

    const unassignedItems = items.filter(item => !item.consumer_id);
    const myItems = items.filter(item => item.consumer_id === deviceId);

    const myTotal = myItems.reduce((sum, item) => sum + item.price, 0);
    const total = items.reduce((sum, item) => sum + item.price, 0);

    const handleAddItem = async () => {
        if (!newItemName || !newItemPrice) return;

        const priceValue = parseInt(newItemPrice, 10) / 100;
        if (isNaN(priceValue) || priceValue <= 0) return;

        const quantityValue = parseInt(newItemQuantity, 10);
        if (isNaN(quantityValue) || quantityValue <= 0) return;

        await addItem(newItemName, priceValue, quantityValue);

        setNewItemName('');
        setNewItemPrice('');
        setNewItemQuantity('1');
        setModalVisible(false);
    };

    const handleCloseBill = async () => {
        if (!room) return;
        setCheckoutModalVisible(false);
        const tipPercentage = parseFloat(checkoutTipPercentage);

        const { error } = await supabase.from('rooms').update({
            status: 'closed',
            bill_split_mode: billSplitMode,
            tip_split_mode: tipSplitMode,
            tip_percentage: isNaN(tipPercentage) ? 10 : tipPercentage
        }).eq('id', room.id);

        if (error) {
            console.error("Erro ao encerrar conta:", error);
            Alert.alert("Erro", "Não foi possível encerrar a conta.");
        }
    };

    const handleReopenBill = async () => {
        if (!room) return;
        setSummaryModalVisible(false);
        const { error } = await supabase.from('rooms').update({
            status: 'active'
        }).eq('id', room.id);

        if (error) {
            console.error("Erro ao reabrir conta:", error);
            Alert.alert("Erro", "Não foi possível reabrir a conta.");
        }
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

    const renderItem = ({ item }: { item: Item }) => {
        const isMine = item.consumer_id === deviceId;
        const isOthers = !!(item.consumer_id && !isMine);

        return (
            <TouchableOpacity
                style={[
                    styles.itemRow,
                    isMine && { backgroundColor: '#e6ffe6', borderColor: '#4CAF50', borderWidth: 1 },
                    isOthers && { backgroundColor: '#f9f9f9', opacity: 0.6 }
                ]}
                onPress={() => toggleItemClaim(item, deviceId)}
                disabled={isOthers}
            >
                <View style={{ flex: 1 }}>
                    <Text style={[styles.itemName, isOthers && { textDecorationLine: 'line-through', color: '#999' }]}>
                        {item.name}
                    </Text>
                    {isMine && <Text style={{ fontSize: 12, color: '#4CAF50', fontWeight: 'bold' }}>(Seu Item)</Text>}
                    {isOthers && <Text style={{ fontSize: 12, color: '#999' }}>(Item de Outro)</Text>}
                </View>
                <Text style={[styles.itemPrice, isOthers && { color: '#999' }]}>{formatCurrency(item.price)}</Text>
            </TouchableOpacity>
        );
    };

    if (loading) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    // The summary modal UI calculation
    const tipPercentageValue = room?.tip_percentage ?? 10;
    const tipValue = total * (tipPercentageValue / 100);
    const totalWithTip = total + tipValue;

    let myFinalAmount = 0;
    let myTipAmount = 0;

    const allConsumers = Array.from(new Set(items.map(i => i.consumer_id).filter(Boolean)));
    const participantCount = Math.max(1, allConsumers.length);

    if (room?.bill_split_mode === 'equal') {
        myFinalAmount = total / participantCount;
    } else {
        myFinalAmount = myTotal;
    }

    if (room?.tip_split_mode === 'equal') {
        myTipAmount = tipValue / participantCount;
    } else {
        myTipAmount = total > 0 ? (myFinalAmount / total) * tipValue : 0;
    }

    const myTotalOwed = myFinalAmount + myTipAmount;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.title}>Mesa Ativa</Text>
                    <Text style={styles.code}>ID: {roomId}</Text>
                </View>
                <TouchableOpacity onPress={refreshData} style={{ padding: 10, backgroundColor: '#e6f2ff', borderRadius: 8 }}>
                    <Text style={{ color: '#007AFF', fontWeight: 'bold' }}>Atualizar</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.dashboard}>
                <View style={styles.card}>
                    <Text style={styles.cardLabel}>Meu Consumo</Text>
                    <Text style={styles.cardValue}>{formatCurrency(myTotal)}</Text>
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

            {isHost && (
                <View style={styles.hostButtonContainer}>
                    <TouchableOpacity style={styles.hostButton} onPress={() => setCheckoutModalVisible(true)}>
                        <Text style={styles.hostButtonText}>Fechar Conta</Text>
                    </TouchableOpacity>
                </View>
            )}

            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={Keyboard.dismiss}
                >
                    <TouchableOpacity activeOpacity={1} style={styles.modalContent}>
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
                            returnKeyType="done"
                            value={getFormattedPriceInput()}
                            onChangeText={handlePriceChange}
                        />

                        <Text style={styles.inputLabel}>Quantidade</Text>
                        <RNPickerSelect
                            onValueChange={(value: string | null) => {
                                if (value !== null) setNewItemQuantity(value);
                            }}
                            value={newItemQuantity}
                            items={Array.from({ length: 30 }, (_, i) => ({ label: (i + 1).toString(), value: (i + 1).toString() }))}
                            placeholder={{}}
                            style={{
                                inputIOS: [styles.input, { marginBottom: 20, color: '#000', height: 50, justifyContent: 'center' }],
                                inputAndroid: [styles.input, { marginBottom: 20, color: '#000', height: 50, justifyContent: 'center' }],
                                viewContainer: { width: '100%', height: 50, justifyContent: 'center' }
                            }}
                            touchableWrapperProps={{ activeOpacity: 0.5, style: { width: '100%', height: 50, justifyContent: 'center' } }}
                            useNativeAndroidPickerStyle={false}
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
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>

            <Modal
                visible={checkoutModalVisible}
                animationType="fade"
                transparent={true}
                onRequestClose={() => setCheckoutModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Resumo da Verificação</Text>

                        <Text style={styles.inputLabel}>Modo da Conta</Text>
                        <View style={styles.radioGroup}>
                            <TouchableOpacity onPress={() => setBillSplitMode('equal')} style={[styles.radio, billSplitMode === 'equal' && styles.radioActive]}>
                                <Text style={[styles.radioText, billSplitMode === 'equal' && styles.radioTextActive]}>Igualitária</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setBillSplitMode('individual')} style={[styles.radio, billSplitMode === 'individual' && styles.radioActive]}>
                                <Text style={[styles.radioText, billSplitMode === 'individual' && styles.radioTextActive]}>Individual</Text>
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.inputLabel}>Gorjeta (%)</Text>
                        <RNPickerSelect
                            onValueChange={(value: string) => {
                                if (value !== null) setCheckoutTipPercentage(value);
                            }}
                            value={checkoutTipPercentage}
                            items={Array.from({ length: 31 }, (_, i) => ({ label: `${i}%`, value: i.toString() }))}
                            placeholder={{}}
                            style={{
                                inputIOS: [styles.input, { marginBottom: 10, color: '#000', height: 50, justifyContent: 'center' }],
                                inputAndroid: [styles.input, { marginBottom: 10, color: '#000', height: 50, justifyContent: 'center' }],
                                viewContainer: { width: '100%', height: 50, justifyContent: 'center' }
                            }}
                            touchableWrapperProps={{ activeOpacity: 0.5, style: { width: '100%', height: 50, justifyContent: 'center' } }}
                            useNativeAndroidPickerStyle={false}
                        />
                        <View style={styles.radioGroup}>
                            <TouchableOpacity onPress={() => setTipSplitMode('equal')} style={[styles.radio, tipSplitMode === 'equal' && styles.radioActive]}>
                                <Text style={[styles.radioText, tipSplitMode === 'equal' && styles.radioTextActive]}>Igualitária</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setTipSplitMode('proportional')} style={[styles.radio, tipSplitMode === 'proportional' && styles.radioActive]}>
                                <Text style={[styles.radioText, tipSplitMode === 'proportional' && styles.radioTextActive]}>Proporcional</Text>
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.inputLabel}>Total Produtos: {formatCurrency(total)}</Text>
                        <Text style={styles.inputLabel}>Gorjeta / Taxa ({checkoutTipPercentage}%): {formatCurrency(total * ((parseFloat(checkoutTipPercentage) || 0) / 100))}</Text>
                        <Text style={[styles.inputLabel, { fontSize: 18, color: '#007AFF' }]}>Total da Mesa: {formatCurrency(total * (1 + ((parseFloat(checkoutTipPercentage) || 0) / 100)))}</Text>

                        {billSplitMode === 'individual' && unassignedItems.length > 0 && (
                            <Text style={styles.errorText}>Atenção: Existem itens sem dono na mesa. Assinale-os para fechar conta individual.</Text>
                        )}

                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.button, styles.cancelButton]}
                                onPress={() => setCheckoutModalVisible(false)}
                            >
                                <Text style={styles.cancelButtonText}>Voltar</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.button, styles.addButton, billSplitMode === 'individual' && unassignedItems.length > 0 && { opacity: 0.5 }]}
                                disabled={billSplitMode === 'individual' && unassignedItems.length > 0}
                                onPress={handleCloseBill}
                            >
                                <Text style={styles.addButtonText}>Encerrar Mesa</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <Modal
                visible={summaryModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setSummaryModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { padding: 30 }]}>
                        <Text style={[styles.title, { fontSize: 28, marginBottom: 20, color: '#333', textAlign: 'center' }]}>Resumo Final</Text>

                        <View style={[styles.card, { width: '100%', marginBottom: 20, backgroundColor: '#e6ffe6' }]}>
                            <Text style={styles.cardLabel}>Sua Parte da Conta</Text>
                            <Text style={styles.cardValue}>{formatCurrency(myFinalAmount)}</Text>
                        </View>

                        <View style={[styles.card, { width: '100%', marginBottom: 20 }]}>
                            <Text style={styles.cardLabel}>Sua Gorjeta ({tipPercentageValue}%)</Text>
                            <Text style={[styles.cardValue, { color: '#666' }]}>{formatCurrency(myTipAmount)}</Text>
                        </View>

                        <View style={[styles.card, { width: '100%', borderTopWidth: 2, borderTopColor: '#007AFF' }]}>
                            <Text style={styles.cardLabel}>Total a Pagar</Text>
                            <Text style={[styles.cardValue, { fontSize: 32 }]}>{formatCurrency(myTotalOwed)}</Text>
                        </View>

                        <Text style={[styles.subtitle, { marginTop: 20, textAlign: 'center' }]}>Total Geral da Mesa: {formatCurrency(totalWithTip)}</Text>

                        <TouchableOpacity
                            style={[styles.button, styles.cancelButton, { marginTop: 25 }]}
                            onPress={() => setSummaryModalVisible(false)}
                        >
                            <Text style={styles.cancelButtonText}>Voltar para a Mesa</Text>
                        </TouchableOpacity>

                        {isHost && (
                            <TouchableOpacity
                                style={[styles.button, styles.addButton, { marginTop: 10, backgroundColor: '#FF3B30', borderColor: '#FF3B30' }]}
                                onPress={handleReopenBill}
                            >
                                <Text style={styles.addButtonText}>Reabrir Mesa (Corrigir Erro)</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </Modal>
        </View>
    );
}
