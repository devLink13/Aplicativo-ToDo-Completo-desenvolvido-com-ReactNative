import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons'


export default function Tasks(props) {

    return (
        <TouchableWithoutFeedback onLongPress={() => props.edit(props.data.nome, props.data.key)}>
            <View style={styles.container}>
                <View style={styles.boxTasks}>
                    <TouchableOpacity onPress={() => props.delete(props.data.key)} >
                        <Ionicons name='trash-outline' size={20} color={'#fca311'} />
                    </TouchableOpacity>

                    <Text style={styles.textTasks}>{props.data.nome}</Text>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 15,
        marginLeft: 10,
        marginRight: 10,
    },
    boxTasks: {
        backgroundColor: '#000000',
        padding: 15,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 5
    },
    textTasks: {
        color: '#fff',
        paddingLeft: 20,
        paddingRight: 20
    }
});