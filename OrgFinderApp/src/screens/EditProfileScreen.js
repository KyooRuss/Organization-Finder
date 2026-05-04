import React, { useState, useContext } from 'react';
import {
    View, Text, TextInput, TouchableOpacity,
    StyleSheet, ScrollView, ActivityIndicator, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from '../context/AuthContext';
import SelectionModal from '../components/SelectionModal';
import api from '../api/client';

const PROGRAMS = ['BSIT', 'BSCS', 'BSIS', 'BSCpE', 'BSCE', 'BSEE', 'BSME', 'BSN', 'BSBA', 'BSA'];
const YEAR_LEVELS = ['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year'];
const INTERESTS = [
    'Technology', 'Programming', 'Networking', 'Arts',
    'Gaming', 'Design', 'Animation', 'Cyber Security',
    'Artificial Intelligence', 'Analytics', 'Machine Learning', 'Innovation',
];
const SKILLS = [
    'Public Speaking', 'Leadership', 'Project Management', 'Arts',
    'Programming', 'Cybersecurity', 'UI/UX Design', 'Graphic Design',
];
const ACTIVITIES = ['Training', 'Forum', 'Seminar', 'Competition', 'E-sports', 'Workshop'];

export default function EditProfileScreen({ navigation }) {
    const { user, refreshUser } = useContext(AuthContext);

    const yearLabel = user?.year_level ? YEAR_LEVELS[(user.year_level - 1)] : '';
    const [name, setName]           = useState(user?.name ?? '');
    const [yearLevel, setYearLevel] = useState(yearLabel);
    const [program, setProgram]     = useState(user?.program ?? '');
    const [interests, setInterests] = useState(user?.interests ?? []);
    const [skills, setSkills]       = useState(user?.skills ?? []);
    const [activities, setActivities] = useState(user?.activities ?? []);
    const [loading, setLoading]     = useState(false);
    const [modal, setModal]         = useState(null);

    const handleUpdate = async () => {
        setLoading(true);
        try {
            const yearNum = YEAR_LEVELS.indexOf(yearLevel) + 1;
            await api.put('/profile', {
                name,
                year_level: yearNum || user.year_level,
                program: program || user.program,
                interests,
                skills,
                activities,
            });
            await refreshUser();
            navigation.goBack();
        } catch (err) {
            Alert.alert('Error', err.message);
        } finally {
            setLoading(false);
        }
    };

    const renderDropdown = (key, options, value, label) => (
        <TouchableOpacity style={styles.dropdown} onPress={() => setModal(key)}>
            <Text style={[styles.dropdownText, !value?.length && styles.placeholder]}>
                {Array.isArray(value) ? (value.length ? value.join(', ') : label) : (value || label)}
            </Text>
            <Text style={styles.chevron}>▾</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.root}>
            <View style={styles.header}>
                <SafeAreaView>
                    <View style={styles.headerInner}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                            <Text style={styles.backIcon}>‹</Text>
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Edit Profile</Text>
                    </View>
                </SafeAreaView>
            </View>

            <ScrollView style={styles.scroll} contentContainerStyle={styles.form} keyboardShouldPersistTaps="handled">
                <View style={styles.row}>
                    <View style={[styles.fieldWrap, { flex: 1 }]}>
                        <Text style={styles.label}>Full Name</Text>
                        <TextInput style={styles.textInput} value={name} onChangeText={setName} placeholderTextColor="#bbb" placeholder="Enter your full name" />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.label}>Year Level</Text>
                        {renderDropdown('yearLevel', YEAR_LEVELS, yearLevel, 'Select year level')}
                    </View>
                </View>

                <View style={styles.fieldWrap}>
                    <Text style={styles.label}>Program</Text>
                    {renderDropdown('program', PROGRAMS, program, 'Select program')}
                </View>
                <View style={styles.fieldWrap}>
                    <Text style={styles.label}>Interest or Hobby</Text>
                    {renderDropdown('interests', INTERESTS, interests, 'Select interest or hobby')}
                </View>
                <View style={styles.fieldWrap}>
                    <Text style={styles.label}>Skills to improve</Text>
                    {renderDropdown('skills', SKILLS, skills, 'Select skills to improve')}
                </View>
                <View style={styles.fieldWrap}>
                    <Text style={styles.label}>Preferred Activities</Text>
                    {renderDropdown('activities', ACTIVITIES, activities, 'Select preferred activities')}
                </View>

                <TouchableOpacity style={[styles.updateBtn, loading && { opacity: 0.7 }]} onPress={handleUpdate} disabled={loading}>
                    {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.updateBtnText}>Update</Text>}
                </TouchableOpacity>
            </ScrollView>

            {modal === 'yearLevel' && (
                <SelectionModal visible title="Year Level" subtitle="Select your year level" options={YEAR_LEVELS} selected={yearLevel ? [yearLevel] : []} max={1}
                    onConfirm={(v) => { setYearLevel(v[0] || ''); setModal(null); }} onCancel={() => setModal(null)} />
            )}
            {modal === 'program' && (
                <SelectionModal visible title="Program" subtitle="Select your program" options={PROGRAMS} selected={program ? [program] : []} max={1}
                    onConfirm={(v) => { setProgram(v[0] || ''); setModal(null); }} onCancel={() => setModal(null)} />
            )}
            {modal === 'interests' && (
                <SelectionModal visible title="Interest & Hobbies" subtitle="Select up to 3" options={INTERESTS} selected={interests} max={3}
                    onConfirm={(v) => { setInterests(v); setModal(null); }} onCancel={() => setModal(null)} />
            )}
            {modal === 'skills' && (
                <SelectionModal visible title="Skills to improve" subtitle="Select up to 3" options={SKILLS} selected={skills} max={3}
                    onConfirm={(v) => { setSkills(v); setModal(null); }} onCancel={() => setModal(null)} />
            )}
            {modal === 'activities' && (
                <SelectionModal visible title="Preferred Activities" subtitle="Select up to 3" options={ACTIVITIES} selected={activities} max={3}
                    onConfirm={(v) => { setActivities(v); setModal(null); }} onCancel={() => setModal(null)} />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: '#f5f6fa' },
    header: { backgroundColor: '#4A6CF7' },
    headerInner: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12 },
    backBtn: { padding: 4 },
    backIcon: { color: '#fff', fontSize: 28, lineHeight: 28 },
    headerTitle: { fontSize: 20, fontWeight: '700', color: '#fff' },
    scroll: { flex: 1 },
    form: { padding: 20, gap: 16, paddingBottom: 40 },
    row: { flexDirection: 'row', gap: 12 },
    fieldWrap: {},
    label: { fontSize: 13, fontWeight: '600', color: '#333', marginBottom: 6 },
    textInput: {
        backgroundColor: '#fff', borderRadius: 10, paddingHorizontal: 14,
        height: 48, fontSize: 14, color: '#333', borderWidth: 1, borderColor: '#e8e8e8',
    },
    dropdown: {
        backgroundColor: '#fff', borderRadius: 10, paddingHorizontal: 14, height: 48,
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        borderWidth: 1, borderColor: '#e8e8e8',
    },
    dropdownText: { fontSize: 14, color: '#333', flex: 1 },
    placeholder: { color: '#bbb' },
    chevron: { color: '#888', fontSize: 16 },
    updateBtn: {
        backgroundColor: '#1e3a8a', borderRadius: 28,
        height: 52, alignItems: 'center', justifyContent: 'center', marginTop: 8,
    },
    updateBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
