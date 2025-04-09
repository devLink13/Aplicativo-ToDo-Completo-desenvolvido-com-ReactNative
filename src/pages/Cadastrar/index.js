import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, Vibration, TouchableOpacity, TouchableWithoutFeedback, Keyboard, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import * as Animatable from 'react-native-animatable';
import Ionicons from '@expo/vector-icons/Ionicons';

// componente de imput criado
import Input from '../Login/Input';

//importando firebase
import { auth } from '../../firebaseConnection';
import { database } from '../../firebaseConnection';
import { createUserWithEmailAndPassword } from 'firebase/auth';

// importando funcionalidades do database do firebase
import { set, ref } from 'firebase/database';

// criar um bottão animado usando touchableopacity como referencia
const ButtonAnimated = Animatable.createAnimatableComponent(TouchableOpacity);

export default function NovoUsuario() {

    const viewRef = useRef(null);
    const navigation = useNavigation();

    // states para dados cadastrais
    const [nome, setNome] = useState(null);
    const [email, setEmail] = useState(null);
    const [cpf, setCpf] = useState(null);
    const [senha, setSenha] = useState(null);



    // função para cadastro de usuário
    async function cadastrarUser() {

        if (nome !== '' && email !== '' && senha !== '' && cpf !== '') {

            try { // adiciona um usuário ao auth do firebase

                const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
                const userUID = userCredential.user.uid;
                console.log('usuário cadastrado com sucesso: ', userCredential.user);

                const refDadosCadastrais = ref(database, `users/${userUID}/dados cadastrais`);

                await set(refDadosCadastrais, {
                    nome: nome,
                    cpf: cpf,
                    email: email,
                    uid: userUID
                })

                // pegando o nome para passar para a Main antes de zerá-lo
                const userName = nome;

                // limpa os dados cadastrais e volta para a tela inicial
                setNome('');
                setCpf('');
                setEmail('');
                setSenha('');

                // navega para a main passando os dados de identificação
                navigation.navigate('Main', {
                    userId: userUID,
                    userName: userName
                });

            }
            catch (error) {
                console.log('Erro ao cadastrar usuário:', error);
                viewRef.current.shake();
                Vibration.vibrate();
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
                    <Ionicons name='person-add-outline' size={100} color={'#e5e5e5'} />
                </View>
                <View style={styles.boxHeaderTitle}>
                    <Text style={styles.txtHeader}>Novo Usuário</Text>
                </View>

                <Animatable.View style={styles.boxInputs} ref={viewRef}>
                    <Input
                        nameIcon='text-outline'
                        sizeIcon={35}
                        colorIcon={'#e5e5e5'}
                        placeholder={'Digite seu Nome'}
                        keyboardType={'default'}
                        isPassword={false}
                        value={nome}
                        onChangeText={(value) => setNome(value)}
                    />

                    <Input
                        nameIcon='person-circle'
                        sizeIcon={35}
                        colorIcon={'#e5e5e5'}
                        placeholder={'Digite seu CPF'}
                        keyboardType={'numeric'}
                        isPassword={false}
                        value={cpf}
                        onChangeText={(value) => setCpf(value)}
                    />

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

                    <View >
                        <ButtonAnimated
                            style={{ justifyContent: 'flex-end', paddingRight: 40, marginBottom: 25, flexDirection: 'row' }}
                            onPress={() => navigation.navigate('Login')}
                        >
                            <Text style={{ color: '#fff' }}>Já possui conta? </Text>
                            <Text style={{ color: '#fca311', fontWeight: 'bold' }}> Faça Login.</Text>
                        </ButtonAnimated>
                    </View>
                </Animatable.View>

                <View style={styles.boxBtn}>
                    <ButtonAnimated
                        style={styles.btn}
                        animation={'fadeInUpBig'}
                        onPress={cadastrarUser}
                    >
                        <Text style={styles.txtButton}>CADASTRAR</Text>
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
        borderRadius: 25
    },
    txtButton: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#14213d'
    }



});
