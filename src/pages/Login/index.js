import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, Vibration, TouchableOpacity, TouchableWithoutFeedback, Keyboard, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native'

import * as Animatable from 'react-native-animatable';
import Ionicons from '@expo/vector-icons/Ionicons';

// componente de imput criado
import Input from './Input';

//importando firebase
import { auth } from '../../firebaseConnection';
import { database } from '../../firebaseConnection';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { get, ref } from 'firebase/database';


// criar um bottão animado usando touchableopacity como referencia
const ButtonAnimated = Animatable.createAnimatableComponent(TouchableOpacity);

export default function Login() {

    //ref para a view
    const viewRef = useRef(null);

    // criando a navegação
    const navigation = useNavigation();

    // states para dados cadastrais
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');

    // função para cadastro de usuário
    async function loginUser() {

        if (email !== '' && senha !== '') {

            try { // adiciona um usuário ao auth do firebase

                const userLogado = await signInWithEmailAndPassword(auth, email, senha);
                console.log('usuário logado com sucesso: ', userLogado.user);

                // pega o ID do user logado
                const userId = userLogado.user.uid;

                // faz um snapshot dos dados cadastrais
                const userDadosSnapshot = (await get(ref(database, `users/${userId}/dados cadastrais`))).val();
                // pega somente o userName dos dados cadastrais
                const userName = userDadosSnapshot.nome;


                navigation.navigate('Main', {
                    userId: userId,
                    userName: userName
                });

            }
            catch (error) {
                console.log('Erro ao logar o usuário:', error);
                viewRef.current.shake();
                Vibration.vibrate();
                Keyboard.dismiss();
                setSenha('');
            }
        }

        else {
            alert('PREENCHA TODOS OS CAMPOS!')
        }

    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaView style={styles.container}>
                <View style={styles.boxHeaderIcon}>
                    <Ionicons name='person-outline' size={100} color={'#e5e5e5'} />
                </View>
                <View style={styles.boxHeaderTitle}>
                    <Text style={styles.txtHeader}>Login</Text>
                </View>

                <Animatable.View style={styles.boxInputs} ref={viewRef}>

                    <Input
                        nameIcon='mail-open'
                        sizeIcon={35}
                        colorIcon={'#e5e5e5'}
                        placeholder={'Digite seu e-mail'}
                        keyboardType={'default'}
                        isPassword={false}
                        value={email}
                        onChangeText={(value) => setEmail(value)}
                    />

                    <Input
                        nameIcon='key'
                        sizeIcon={35}
                        colorIcon={'#e5e5e5'}
                        placeholder={'Digite sua Senha'}
                        keyboardType={'numeric'}
                        isPassword={true}
                        value={senha}
                        onChangeText={(value) => setSenha(value)}
                    />

                </Animatable.View>

                <View >
                    <ButtonAnimated
                        style={{ justifyContent: 'flex-end', paddingRight: 40, marginBottom: 25, flexDirection: 'row' }}
                        onPress={() => { }}
                    >
                        <Text style={{ color: '#fff' }}>Esqueceu a senha? </Text>
                        <Text style={{ color: '#fca311', fontWeight: 'bold' }}>Clique aqui.</Text>
                    </ButtonAnimated>
                </View>

                <View style={styles.boxBtn}>
                    <ButtonAnimated
                        style={styles.btn}
                        animation={'fadeInUpBig'}
                        onPress={loginUser}
                    >
                        <Text style={styles.txtButton}>Entrar</Text>
                    </ButtonAnimated>


                    <ButtonAnimated
                        animation={'fadeInUpBig'}
                        style={styles.cadastrarse}
                        onPress={() => navigation.navigate('Cadastrar')}
                    >

                        <Text style={{ color: '#14213d', fontSize: 20, fontWeight: 'bold' }}>Criar Conta</Text>
                    </ButtonAnimated>

                </View>

            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#14213d',
    },
    boxHeaderIcon: {
        marginTop: 75,
        alignItems: 'center',
        marginBottom: 40
    },
    txtHeader: {
        fontSize: 30,
        fontFamily: 'Poppins',
        textAlign: 'left',
        fontWeight: 'bold',
        color: '#fca311'
    },
    boxHeaderTitle: {
        alignItems: 'baseline',
        paddingLeft: 40,
        marginBottom: 20
    },
    boxBtn: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 25,
    },
    btn: {
        borderColor: '#fca311',
        borderWidth: 1,
        backgroundColor: '#fca311',
        height: 50,
        width: '70%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 25,
        marginBottom: 5
    },
    cadastrarse: {
        marginTop: 15,
        borderWidth: 1,
        borderColor: '#e5e5e5',
        borderRadius: 25,
        padding: 10,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        width: '70%',
        backgroundColor: '#e5e5e5'

    },
    boxEsqueceuSenha: {
        alignItems: 'flex-end',
        marginBottom: 10,
        marginRight: 40
    },
    txtButton: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#14213d'
    }


});
