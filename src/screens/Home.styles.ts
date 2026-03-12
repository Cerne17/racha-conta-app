import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 40,
        color: '#333',
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 10,
    },
    button: {
        backgroundColor: '#007AFF',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 8,
        width: '100%',
        alignItems: 'center',
        marginBottom: 10,
    },
    buttonDisabled: {
        backgroundColor: '#ccc',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    separator: {
        height: 1,
        backgroundColor: '#eee',
        width: '100%',
        marginVertical: 30,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 15,
        width: '100%',
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 15,
    },
});
