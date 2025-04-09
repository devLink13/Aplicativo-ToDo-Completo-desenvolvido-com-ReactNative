import React from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons'

export default function Input(props) {


    return (
        <View
            // animation='shake'
            style={styles.boxUserInput}
        >
            <Ionicons name={props.nameIcon} size={props.sizeIcon} color={props.colorIcon} />
            <TextInput
                style={styles.input}
                placeholder={props.placeholder}
                placeholderTextColor={'#e5e5e5'}
                keyboardType={props.keyboardType}
                secureTextEntry={props.isPassword}
                onChangeText={props.onChangeText}
                value={props.value}
                selectionColor='#e5e5e5'
                
            />
        </View>
    );
}

const styles = StyleSheet.create({
    boxUserInput: {
        flexDirection: 'row',
        // backgroundColor:'#fff',
        marginLeft: 40,
        marginRight: 40,
        marginBottom: 25
    },
    input: {
        flex: 1,
        borderBottomWidth: 1,
        borderColor: '#e5e5e5',
        marginLeft: 20,
        color: '#e5e5e5',
        fontSize: 20,
        paddingLeft: 5
    }
});