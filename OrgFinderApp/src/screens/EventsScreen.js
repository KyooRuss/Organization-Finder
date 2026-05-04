import React, { useState, useEffect, useCallback } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, StyleSheet,
    FlatList, Image, ActivityIndicator, RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../api/client';

const CATEGORIES = ['All', 'Technology', 'Arts', 'Leadership', 'Design', 'Gaming', 'Cybersecurity', 'E-sports'];

export default function EventsScreen({ navigation }) {
    const [events, setEvents]     = useState([]);
    const [loading, setLoading]   = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [search, setSearch]     = useState('');
    const [category, setCategory] = useState('All');

    const loadEvents = useCallback(async () => {
        try {
            const params = {};
            if (search.trim()) params.search = search.trim();
            if (category !== 'All') params.category = category;
            const res = await api.get('/events/upcoming', { params });
            setEvents(res.data.events);
        } catch {}
        finally { setLoading(false); setRefreshing(false); }
    }, [search, category]);

    useEffect(() => { setLoading(true); loadEvents(); }, [category]);

    const renderEvent = ({ item }) => (
        <TouchableOpacity
            style={styles.eventCard}
            onPress={() => navigation.navigate('EventDetail', { id: item.id })}
            activeOpacity={0.85}
        >
            {item.poster
                ? <Image source={{ uri: item.poster }} style={styles.poster} />
                : <View style={[styles.poster, styles.posterFallback]}>
                    <Text style={styles.posterIcon}>📅</Text>
                  </View>
            }
            <View style={styles.eventInfo}>
                <Text style={styles.eventTitle} numberOfLines={2}>{item.title}</Text>
                <View style={styles.metaRow}>
                    <Text style={styles.metaText}>📅 {item.date}</Text>
                </View>
                <View style={styles.metaRow}>
                    <Text style={styles.metaText}>🕐 {item.start_time} – {item.end_time}</Text>
                </View>
                <View style={styles.metaRow}>
                    <Text style={styles.metaText}>📍 {item.location}</Text>
                </View>
                <TouchableOpacity
                    style={styles.detailBtn}
                    onPress={() => navigation.navigate('EventDetail', { id: item.id })}
                >
                    <Text style={styles.detailBtnText}>View Details</Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.root}>
            <View style={styles.header}>
                <SafeAreaView>
                    <View style={styles.headerRow}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                            <Text style={styles.backIcon}>‹</Text>
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Upcoming Events</Text>
                    </View>
                    <View style={styles.searchWrap}>
                        <Text style={styles.searchIcon}>🔍</Text>
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search Event..."
                            placeholderTextColor="#aaa"
                            value={search}
                            onChangeText={setSearch}
                            onSubmitEditing={() => { setLoading(true); loadEvents(); }}
                            returnKeyType="search"
                        />
                    </View>
                </SafeAreaView>
            </View>

            {/* Category filter */}
            <View style={styles.filterRow}>
                <FlatList
                    horizontal
                    data={CATEGORIES}
                    keyExtractor={i => i}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={[styles.filterChip, item === category && styles.filterChipActive]}
                            onPress={() => setCategory(item)}
                        >
                            <Text style={[styles.filterText, item === category && styles.filterTextActive]}>{item}</Text>
                        </TouchableOpacity>
                    )}
                />
            </View>

            {loading ? (
                <ActivityIndicator style={{ marginTop: 60 }} color="#4A6CF7" size="large" />
            ) : (
                <FlatList
                    data={events}
                    keyExtractor={item => String(item.id)}
                    renderItem={renderEvent}
                    contentContainerStyle={styles.list}
                    showsVerticalScrollIndicator={false}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadEvents(); }} />}
                    ListEmptyComponent={<Text style={styles.empty}>No upcoming events found.</Text>}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: '#f5f6fa' },
    header: { backgroundColor: '#4A6CF7', paddingHorizontal: 16, paddingBottom: 16 },
    headerRow: { flexDirection: 'row', alignItems: 'center', paddingTop: 8, marginBottom: 12 },
    backBtn: { padding: 4, marginRight: 8 },
    backIcon: { color: '#fff', fontSize: 28, lineHeight: 28 },
    headerTitle: { color: '#fff', fontSize: 20, fontWeight: '700' },
    searchWrap: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: '#fff', borderRadius: 12, paddingHorizontal: 14, height: 46,
    },
    searchIcon: { fontSize: 16, marginRight: 8 },
    searchInput: { flex: 1, fontSize: 14, color: '#333' },
    filterRow: { paddingVertical: 12 },
    filterChip: {
        paddingHorizontal: 14, paddingVertical: 6,
        borderRadius: 20, backgroundColor: '#fff',
        borderWidth: 1, borderColor: '#e0e0e0',
    },
    filterChipActive: { backgroundColor: '#4A6CF7', borderColor: '#4A6CF7' },
    filterText: { fontSize: 13, color: '#555' },
    filterTextActive: { color: '#fff', fontWeight: '600' },
    list: { paddingHorizontal: 16, paddingBottom: 30, gap: 14 },
    eventCard: {
        backgroundColor: '#fff', borderRadius: 14,
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.07, shadowRadius: 8, elevation: 3,
        overflow: 'hidden',
    },
    poster: { width: '100%', height: 160 },
    posterFallback: {
        backgroundColor: '#e0e7ff',
        alignItems: 'center', justifyContent: 'center',
    },
    posterIcon: { fontSize: 48 },
    eventInfo: { padding: 14 },
    eventTitle: { fontSize: 16, fontWeight: '700', color: '#1e2f6e', marginBottom: 8 },
    metaRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
    metaText: { fontSize: 13, color: '#555' },
    detailBtn: {
        alignSelf: 'flex-end', marginTop: 10,
        backgroundColor: '#1e3a8a', borderRadius: 20,
        paddingHorizontal: 16, paddingVertical: 8,
    },
    detailBtnText: { color: '#fff', fontSize: 13, fontWeight: '600' },
    empty: { textAlign: 'center', marginTop: 60, color: '#888', fontSize: 15 },
});
