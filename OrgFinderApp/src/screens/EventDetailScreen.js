import React, { useState, useEffect } from 'react';
import {
    View, Text, ScrollView, Image, StyleSheet,
    TouchableOpacity, ActivityIndicator, Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../api/client';

const { width } = Dimensions.get('window');

export default function EventDetailScreen({ route, navigation }) {
    const { id } = route.params;
    const [event, setEvent]     = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get(`/events/${id}`)
            .then(res => setEvent(res.data.event))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return (
        <View style={styles.center}><ActivityIndicator color="#4A6CF7" size="large" /></View>
    );
    if (!event) return (
        <View style={styles.center}><Text>Event not found.</Text></View>
    );

    return (
        <View style={styles.root}>
            {/* Poster / dark overlay */}
            <View style={styles.posterWrap}>
                {event.poster
                    ? <Image source={{ uri: event.poster }} style={styles.poster} />
                    : <View style={[styles.poster, styles.posterFallback]}>
                        <Text style={styles.posterIcon}>📅</Text>
                      </View>
                }
                <View style={styles.overlay} />
                <SafeAreaView style={styles.headerSafe}>
                    <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                        <Text style={styles.backIcon}>‹</Text>
                        <Text style={styles.backLabel}>Upcoming Events</Text>
                    </TouchableOpacity>
                </SafeAreaView>
            </View>

            {/* Content card */}
            <ScrollView style={styles.scrollWrap} contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
                <View style={styles.card}>
                    <Text style={styles.eventTitle}>{event.title}</Text>

                    <View style={styles.metaRow}>
                        <Text style={styles.metaText}>📅 {event.date}</Text>
                    </View>
                    <View style={styles.metaRow}>
                        <Text style={styles.metaText}>🕐 {event.start_time} – {event.end_time}</Text>
                    </View>
                    <View style={styles.metaRow}>
                        <Text style={styles.metaText}>📍 {event.location}</Text>
                    </View>

                    {event.organization && (
                        <TouchableOpacity
                            style={styles.orgRow}
                            onPress={() => navigation.navigate('OrgDetail', { id: event.organization.id })}
                        >
                            {event.organization.logo
                                ? <Image source={{ uri: event.organization.logo }} style={styles.orgLogo} />
                                : <View style={[styles.orgLogo, styles.orgLogoFallback]}>
                                    <Text style={styles.orgLogoText}>{event.organization.name?.[0] ?? 'O'}</Text>
                                  </View>
                            }
                            <Text style={styles.orgName}>{event.organization.name}</Text>
                        </TouchableOpacity>
                    )}

                    {event.description ? (
                        <>
                            <Text style={styles.sectionLabel}>About This Event</Text>
                            <Text style={styles.bodyText}>{event.description}</Text>
                        </>
                    ) : null}

                    {event.gains?.length > 0 ? (
                        <>
                            <Text style={styles.sectionLabel}>What you will gain</Text>
                            {event.gains.map((g, i) => (
                                <View key={i} style={styles.gainRow}>
                                    <Text style={styles.gainBullet}>•</Text>
                                    <Text style={styles.gainText}>{g}</Text>
                                </View>
                            ))}
                        </>
                    ) : null}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: '#1a1f3c' },
    center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f6fa' },
    posterWrap: { height: 260, position: 'relative' },
    poster: { width: '100%', height: '100%' },
    posterFallback: { backgroundColor: '#2346D4', alignItems: 'center', justifyContent: 'center' },
    posterIcon: { fontSize: 64 },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(20,20,60,0.55)',
    },
    headerSafe: { position: 'absolute', top: 0, left: 0, right: 0 },
    backBtn: {
        flexDirection: 'row', alignItems: 'center',
        paddingHorizontal: 16, paddingVertical: 12,
    },
    backIcon: { color: '#fff', fontSize: 28, lineHeight: 28, marginRight: 4 },
    backLabel: { color: '#fff', fontSize: 16, fontWeight: '600' },
    scrollWrap: { flex: 1 },
    scroll: { paddingBottom: 40 },
    card: {
        backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24,
        padding: 24, minHeight: 400,
    },
    eventTitle: { fontSize: 20, fontWeight: '800', color: '#1e2f6e', marginBottom: 16, lineHeight: 26 },
    metaRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
    metaText: { fontSize: 14, color: '#555' },
    orgRow: {
        flexDirection: 'row', alignItems: 'center', gap: 10,
        marginTop: 14, marginBottom: 4,
        paddingVertical: 10, paddingHorizontal: 14,
        backgroundColor: '#f0f4ff', borderRadius: 12,
    },
    orgLogo: { width: 36, height: 36, borderRadius: 18 },
    orgLogoFallback: { backgroundColor: '#4A6CF7', alignItems: 'center', justifyContent: 'center' },
    orgLogoText: { color: '#fff', fontSize: 14, fontWeight: '700' },
    orgName: { fontSize: 14, fontWeight: '600', color: '#1e2f6e', flex: 1 },
    sectionLabel: { fontSize: 15, fontWeight: '700', color: '#1e2f6e', marginTop: 20, marginBottom: 8 },
    bodyText: { fontSize: 14, color: '#555', lineHeight: 22 },
    gainRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 6, gap: 8 },
    gainBullet: { fontSize: 16, color: '#4A6CF7', lineHeight: 22 },
    gainText: { flex: 1, fontSize: 14, color: '#444', lineHeight: 22 },
});
