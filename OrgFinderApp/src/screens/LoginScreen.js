import React, { useState, useContext } from 'react';
import {
    View, Text, TextInput, TouchableOpacity,
    StyleSheet, Image, KeyboardAvoidingView,
    Platform, ScrollView, ActivityIndicator, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from '../context/AuthContext';

export default function LoginScreen() {
    const { login } = useContext(AuthContext);
    const [email, setEmail]       = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading]   = useState(false);

    const handleLogin = async () => {
        if (!email.trim() || !password.trim()) {
            Alert.alert('Error', 'Please enter your email and password.');
            return;
        }
        setLoading(true);
        try {
            await login(email.trim(), password);
        } catch (err) {
            Alert.alert('Login Failed', err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.root}>
            {/* Blue top section */}
            <View style={styles.topSection}>
                <SafeAreaView>
                    <Text style={styles.hello}>Hello!</Text>
                    <Text style={styles.welcome}>Welcome to OrgFinder</Text>
                </SafeAreaView>
            </View>

            {/* White card */}
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={styles.cardWrap}
            >
                <ScrollView contentContainerStyle={styles.card} keyboardShouldPersistTaps="handled">
                    <Text style={styles.loginTitle}>Login</Text>

                    <View style={styles.inputWrap}>
                        <Text style={styles.inputIcon}>👤</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Institutional Email"
                            placeholderTextColor="#aaa"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            value={email}
                            onChangeText={setEmail}
                        />
                    </View>

                    <View style={styles.inputWrap}>
                        <Text style={styles.inputIcon}>🔒</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Password"
                            placeholderTextColor="#aaa"
                            secureTextEntry
                            value={password}
                            onChangeText={setPassword}
                        />
                    </View>

                    <TouchableOpacity style={styles.forgotWrap}>
                        <Text style={styles.forgotText}>Forgot password?</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.loginBtn, loading && { opacity: 0.7 }]}
                        onPress={handleLogin}
                        disabled={loading}
                    >
                        {loading
                            ? <ActivityIndicator color="#fff" />
                            : <Text style={styles.loginBtnText}>Login</Text>
                        }
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: '#4A6CF7' },
    topSection: {
        flex: 1,
        paddingHorizontal: 30,
        paddingTop: 20,
        justifyContent: 'flex-end',
        paddingBottom: 40,
    },
    hello: {
        fontSize: 48,
        fontWeight: '800',
        color: '#fff',
        marginBottom: 6,
    },
    welcome: {
        fontSize: 18,
        color: 'rgba(255,255,255,0.85)',
    },
    cardWrap: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
    },
    card: {
        padding: 30,
        paddingTop: 36,
        paddingBottom: 50,
    },
    loginTitle: {
        fontSize: 28,
        fontWeight: '700',
        color: '#1e2f6e',
        marginBottom: 24,
    },
    inputWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        borderRadius: 12,
        paddingHorizontal: 14,
        marginBottom: 14,
        height: 52,
    },
    inputIcon: { fontSize: 16, marginRight: 10 },
    input: { flex: 1, fontSize: 15, color: '#333' },
    forgotWrap: { alignItems: 'flex-end', marginBottom: 24 },
    forgotText: { fontSize: 13, color: '#4A6CF7' },
    loginBtn: {
        backgroundColor: '#1e3a8a',
        borderRadius: 28,
        height: 52,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loginBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
