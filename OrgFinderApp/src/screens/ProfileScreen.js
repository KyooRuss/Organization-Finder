import React, { useContext } from 'react';
import {
    View, Text, TouchableOpacity, StyleSheet,
    ScrollView, Image, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from '../context/AuthContext';

export default function ProfileScreen({ navigation }) {
    const { user, logout } = useContext(AuthContext);

    const handleLogout = () => {
        Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Sign Out', style: 'destructive', onPress: logout },
        ]);
    };

    const yearLabel = user?.year_level ? `${user.year_level}${['st','nd','rd'][user.year_level - 1] || 'th'} Year` : '—';

    const infoTag = (items) => items?.length ? items.join(', ') : '—';

    return (
        <ScrollView style={styles.root} contentContainerStyle={styles.scroll}>
            {/* Back button */}
            <SafeAreaView>
                <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                    <Text style={styles.backIcon}>‹</Text>
                    <Text style={styles.backLabel}>Profile</Text>
                </TouchableOpacity>
            </SafeAreaView>

            {/* Profile card */}
            <View style={styles.card}>
                <TouchableOpacity style={styles.editBtn} onPress={() => navigation.navigate('EditProfile')}>
                    <Text style={styles.editIcon}>✏</Text>
                </TouchableOpacity>

                {/* Avatar */}
                <View style={styles.avatarWrap}>
                    {user?.profile_photo
                        ? <Image source={{ uri: user.profile_photo }} style={styles.avatar} />
                        : <View style={[styles.avatar, styles.avatarFallback]}>
                            <Text style={styles.avatarText}>{user?.name?.[0] ?? 'U'}</Text>
                          </View>
                    }
                </View>

                <Text style={styles.userName}>{user?.name}</Text>
                <Text style={styles.userEmail}>{user?.email}</Text>

                <View style={styles.statsRow}>
                    <View style={styles.stat}>
                        <Text style={styles.statValue}>{yearLabel}</Text>
                        <Text style={styles.statLabel}>Year level</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.stat}>
                        <Text style={styles.statValue}>{user?.program || '—'}</Text>
                        <Text style={styles.statLabel}>Program</Text>
                    </View>
                </View>
            </View>

            {/* Info sections */}
            <View style={styles.infoSection}>
                <Text style={styles.infoLabel}>Interest & Hobby</Text>
                <View style={styles.infoBox}>
                    <Text style={styles.infoText}>{infoTag(user?.interests)}</Text>
                </View>
            </View>

            <View style={styles.infoSection}>
                <Text style={styles.infoLabel}>Skills to improve</Text>
                <View style={styles.infoBox}>
                    <Text style={styles.infoText}>{infoTag(user?.skills)}</Text>
                </View>
            </View>

            <View style={styles.infoSection}>
                <Text style={styles.infoLabel}>Preferred Activities</Text>
                <View style={styles.infoBox}>
                    <Text style={styles.infoText}>{infoTag(user?.activities)}</Text>
                </View>
            </View>

            <TouchableOpacity style={styles.signOutBtn} onPress={handleLogout}>
                <Text style={styles.signOutText}>Sign out</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: '#f5f6fa' },
    scroll: { paddingBottom: 40 },
    backBtn: {
        flexDirection: 'row', alignItems: 'center',
        paddingHorizontal: 16, paddingVertical: 12,
        backgroundColor: '#4A6CF7',
    },
    backIcon: { color: '#fff', fontSize: 28, lineHeight: 28, marginRight: 4 },
    backLabel: { color: '#fff', fontSize: 18, fontWeight: '600' },
    card: {
        backgroundColor: '#4A6CF7',
        padding: 24,
        alignItems: 'center',
        paddingBottom: 32,
        position: 'relative',
    },
    editBtn: {
        position: 'absolute', top: 16, right: 16,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 20, padding: 8,
    },
    editIcon: { color: '#fff', fontSize: 16 },
    avatarWrap: { marginBottom: 14 },
    avatar: { width: 88, height: 88, borderRadius: 44, borderWidth: 3, borderColor: 'rgba(255,255,255,0.5)' },
    avatarFallback: { backgroundColor: 'rgba(255,255,255,0.25)', alignItems: 'center', justifyContent: 'center' },
    avatarText: { color: '#fff', fontSize: 36, fontWeight: '700' },
    userName: { fontSize: 20, fontWeight: '700', color: '#fff', marginBottom: 4 },
    userEmail: { fontSize: 13, color: 'rgba(255,255,255,0.75)', marginBottom: 20 },
    statsRow: { flexDirection: 'row', gap: 24 },
    stat: { alignItems: 'center' },
    statValue: { fontSize: 16, fontWeight: '700', color: '#fff' },
    statLabel: { fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
    statDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.3)' },
    infoSection: { paddingHorizontal: 20, marginTop: 16 },
    infoLabel: { fontSize: 14, fontWeight: '700', color: '#1e2f6e', marginBottom: 8 },
    infoBox: {
        backgroundColor: '#fff', borderRadius: 12,
        padding: 14, borderWidth: 1, borderColor: '#eee',
    },
    infoText: { fontSize: 14, color: '#555', lineHeight: 20 },
    signOutBtn: {
        marginHorizontal: 20, marginTop: 32,
        backgroundColor: '#1e3a8a', borderRadius: 28,
        height: 52, alignItems: 'center', justifyContent: 'center',
    },
    signOutText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
