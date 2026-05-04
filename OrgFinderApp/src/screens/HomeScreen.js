import React, { useState, useEffect, useContext, useCallback } from 'react';
import {
    View, Text, TouchableOpacity, StyleSheet,
    FlatList, Image, ActivityIndicator, RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from '../context/AuthContext';
import api from '../api/client';

export default function HomeScreen({ navigation }) {
    const { user } = useContext(AuthContext);
    const [recs, setRecs]         = useState([]);
    const [loading, setLoading]   = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const firstName = user?.name?.split(' ')[0] ?? 'Student';

    const loadRecs = useCallback(async () => {
        try {
            const res = await api.get('/recommendations');
            setRecs(res.data.recommendations);
        } catch {}
        finally { setLoading(false); setRefreshing(false); }
    }, []);

    useEffect(() => { loadRecs(); }, []);

    const renderOrg = ({ item }) => (
        <TouchableOpacity
            style={styles.orgCard}
            onPress={() => navigation.navigate('OrgDetail', { id: item.id })}
            activeOpacity={0.85}
        >
            <View style={styles.orgLogoWrap}>
                {item.logo
                    ? <Image source={{ uri: item.logo }} style={styles.orgLogo} />
                    : <View style={[styles.orgLogo, styles.orgLogoFallback]}>
                        <Text style={styles.orgLogoText}>{item.name?.[0] ?? 'O'}</Text>
                      </View>
                }
            </View>
            <View style={styles.orgInfo}>
                <Text style={styles.orgName} numberOfLines={2}>{item.name}</Text>
                {item.match_reason ? (
                    <Text style={styles.matchReason} numberOfLines={2}>{item.match_reason}</Text>
                ) : null}
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.root}>
            <View style={styles.header}>
                <SafeAreaView>
                    <View style={styles.headerRow}>
                        <View>
                            <Text style={styles.greeting}>Hello, {firstName}!</Text>
                        </View>
                        <View style={styles.headerIcons}>
                            <TouchableOpacity style={styles.iconBtn}>
                                <Text style={styles.iconEmoji}>🔔</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.iconBtn}
                                onPress={() => navigation.navigate('Profile')}
                            >
                                <Text style={styles.iconEmoji}>👤</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Quick actions */}
                    <View style={styles.quickActions}>
                        <TouchableOpacity
                            style={styles.quickBtn}
                            onPress={() => navigation.navigate('Events')}
                        >
                            <Text style={styles.quickIcon}>📅</Text>
                            <Text style={styles.quickLabel}>Upcoming{'\n'}Events</Text>
                        </TouchableOpacity>
                        <View style={styles.divider} />
                        <TouchableOpacity
                            style={styles.quickBtn}
                            onPress={() => navigation.navigate('Orgs')}
                        >
                            <Text style={styles.quickIcon}>🏛</Text>
                            <Text style={styles.quickLabel}>Explore{'\n'}CICS Orgs</Text>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </View>

            {/* Recommended orgs section */}
            <View style={styles.body}>
                <View style={styles.recHeader}>
                    <Text style={styles.recTitle}>Recommended Orgs</Text>
                </View>

                {loading ? (
                    <ActivityIndicator style={{ marginTop: 40 }} color="#4A6CF7" size="large" />
                ) : (
                    <FlatList
                        data={recs}
                        keyExtractor={item => String(item.id)}
                        renderItem={renderOrg}
                        contentContainerStyle={styles.list}
                        showsVerticalScrollIndicator={false}
                        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadRecs(); }} />}
                        ListEmptyComponent={
                            <View style={styles.empty}>
                                <Text style={styles.emptyText}>No recommendations yet.</Text>
                                <Text style={styles.emptyHint}>Explore all organizations below.</Text>
                                <TouchableOpacity onPress={() => navigation.navigate('Orgs')} style={styles.exploreBtn}>
                                    <Text style={styles.exploreBtnText}>Explore Organizations</Text>
                                </TouchableOpacity>
                            </View>
                        }
                    />
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: '#f5f6fa' },
    header: { backgroundColor: '#4A6CF7', paddingHorizontal: 20, paddingBottom: 20 },
    headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10 },
    greeting: { fontSize: 22, fontWeight: '700', color: '#fff' },
    headerIcons: { flexDirection: 'row', gap: 8 },
    iconBtn: {
        width: 38, height: 38, borderRadius: 19,
        backgroundColor: 'rgba(255,255,255,0.15)',
        alignItems: 'center', justifyContent: 'center',
    },
    iconEmoji: { fontSize: 18 },
    quickActions: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderRadius: 16,
        marginTop: 16,
        paddingVertical: 14,
        paddingHorizontal: 20,
    },
    quickBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 },
    quickIcon: { fontSize: 24 },
    quickLabel: { color: '#fff', fontSize: 13, fontWeight: '600', lineHeight: 18 },
    divider: { width: 1, backgroundColor: 'rgba(255,255,255,0.3)', marginHorizontal: 16 },
    body: { flex: 1 },
    recHeader: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 10 },
    recTitle: { fontSize: 18, fontWeight: '700', color: '#1e2f6e' },
    list: { paddingHorizontal: 16, paddingBottom: 30, gap: 12 },
    orgCard: {
        backgroundColor: '#fff',
        borderRadius: 14,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.07,
        shadowRadius: 8,
        elevation: 3,
    },
    orgLogoWrap: { marginRight: 14 },
    orgLogo: { width: 56, height: 56, borderRadius: 28 },
    orgLogoFallback: {
        backgroundColor: '#4A6CF7',
        alignItems: 'center', justifyContent: 'center',
    },
    orgLogoText: { color: '#fff', fontSize: 22, fontWeight: '700' },
    orgInfo: { flex: 1 },
    orgName: { fontSize: 15, fontWeight: '700', color: '#1e2f6e', marginBottom: 4 },
    matchReason: { fontSize: 12, color: '#666', lineHeight: 16 },
    empty: { alignItems: 'center', marginTop: 60 },
    emptyText: { fontSize: 16, fontWeight: '600', color: '#555' },
    emptyHint: { fontSize: 13, color: '#888', marginTop: 4, marginBottom: 16 },
    exploreBtn: {
        backgroundColor: '#4A6CF7', borderRadius: 24,
        paddingHorizontal: 24, paddingVertical: 12,
    },
    exploreBtnText: { color: '#fff', fontWeight: '600' },
});
