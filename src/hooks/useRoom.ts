import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { supabase } from '../services/supabase';

export interface Item {
    id: string;
    room_id: string;
    name: string;
    price: number;
    consumer_id?: string;
}

export interface Room {
    id: string;
    code: string;
    host_id: string;
    status: string;
    tip_split_mode: string;
    bill_split_mode: string;
}

export function useRoom(roomId: string) {
    const [items, setItems] = useState<Item[]>([]);
    const [room, setRoom] = useState<Room | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        async function fetchRoomAndItems() {
            // Fetch Room Details
            const { data: roomData, error: roomError } = await supabase
                .from('rooms')
                .select('*')
                .eq('code', roomId.replace('sala-', ''))
                .single();

            if (roomError) {
                console.error("Room fetch error:", roomError.message, roomError.details);
                if (mounted) {
                    setLoading(false);
                }
                Alert.alert("Erro ao buscar sala", roomError.message);
                return;
            }

            if (mounted) setRoom(roomData);

            // Fetch Items
            const { data: itemsData } = await supabase
                .from('items')
                .select('*')
                .eq('room_id', roomData.id)
                .order('created_at', { ascending: true });

            if (mounted && itemsData) setItems(itemsData);
            if (mounted) setLoading(false);
        }

        fetchRoomAndItems();

        // Subscribe to real-time changes
        const itemsSubscription = supabase
            .channel('public:items')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'items',
                    // Note: filter by room_id in a real scenario
                },
                (payload) => {
                    if (payload.eventType === 'INSERT') {
                        setItems((prev) => [...prev, payload.new as Item]);
                    }
                }
            )
            .subscribe();

        return () => {
            mounted = false;
            supabase.removeChannel(itemsSubscription);
        };
    }, [roomId]);

    const addItem = async (name: string, price: number) => {
        if (!room?.id) return;

        // Async push to Supabase
        const { error } = await supabase.from('items').insert([
            {
                room_id: room.id,
                name,
                price,
                // consumer_id: deviceId
            },
        ]);

        if (error) {
            console.error("Erro ao sincronizar item no Supabase:", error.message, error.details);
            Alert.alert("Erro ao adicionar item", error.message);
        }
    };

    return { items, room, loading, addItem };
}
