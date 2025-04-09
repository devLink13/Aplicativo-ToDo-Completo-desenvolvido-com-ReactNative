import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView, Text, StyleSheet, View, TextInput, TouchableOpacity, FlatList, Keyboard, ActivityIndicator, Alert, Vibration } from 'react-native';

// importando o render da flatlist
import Tasks from './Tasks';

// importando firebase
import { database } from '../../firebaseConnection';
import { onValue, ref, set, push, remove, update } from 'firebase/database';

//importando os icones
import Ionicons from '@expo/vector-icons/Ionicons';

export default function Home({ route }) {

    const { userId, userName } = route.params;

    const [input, setInput] = useState('');
    const [tasks, setNewTasks] = useState([]);
    const [inLoading, setInLoading] = useState(true); // indicará o estado de conexão ao firebase
    const [key, setKey] = useState('');

    const refInput = useRef(null);

    useEffect(() => {

        const refTarefas = ref(database, `users/${userId}/tarefas`); // criar uma referencia para o nó tarefas
        const refConnection = ref(database, '.info/connected'); // nó que monitora a conexão com o firebase

        onValue(refConnection, (snapshot) => {

            if (snapshot.val() === true) { // se a conexão for bem sucedida
                console.log('conexão com o firebase foi estabelecida com sucesso.');

                onValue(refTarefas, (snapshot) => {

                    // array para guardar as tasks temporariamente
                    let arrayTasks = []; // é criado toda vez que o onValue dispara

                    // usar for each para iterar no nó tarefas e pegar todas as tarefas
                    snapshot.forEach((childSnapshot) => {
                        const Task = {
                            key: childSnapshot.key,
                            nome: childSnapshot.val().name
                        };

                        arrayTasks.push(Task); // adiciona a tarefa ao array temporário
                    });

                    // adicionar os tasks ao state
                    setNewTasks(arrayTasks);
                });

                setInterval(() => { // espera 2s antes de carregar o conteúdo
                    setInLoading(false); // seta o estado de carregamento para falso, indicando conexão com o firebase
                }, 1000);

            }

            else {
                console.log('Sem conexão com o Firebase.');
            }

        });




    }, []);

    async function handleTaks() {

        if (input !== '') {

            if (key === '') {
                try { // inserir nova task no nó tarefas

                    const refTarefas = ref(database,  `users/${userId}/tarefas`);

                    // criando um novo nó dentro de tarefas com uma chave única
                    const newTask = push(refTarefas);

                    // salvando nova tarefa no id unico
                    await set(newTask, {
                        name: input
                    })

                    Keyboard.dismiss();
                    setInput('');
                    console.log('sucesso ao gerar nova tarefa, id da tarefa: ', newTask.key);
                }

                catch (error) {
                    console.log('erro ao gerar nova tarefa: ', error);
                }
            }

            else { // se a key não estiver vazia, então estamos editando uma nova tarefa...
                console.log('editando uma tarefa');

                try {
                    const refTask = ref(database, `tarefas/${key}`);

                    await update(refTask, {
                        name: input
                    });

                    Keyboard.dismiss();
                    setInput('');
                    console.log('sucesso ao editar a tarefa, id da tarefa: ', refTask.key);
                    setKey(''); // zerar a key para que não sobreescrevamos a tarefa editada por último ao inserir nova tarefa.

                }
                catch (error) {
                    console.log('erro ao atualizar a tarefa no banco de dados.');
                }
            }
        }



        else {
            Alert.alert('Inválido', 'Digite a tarefa antes de enviar.', [
                {
                    text: 'Ok',
                    onPress: () => { return },
                    style: 'destructive'
                }
            ]);
        }

    }

    function handleDelete(key) {

        Alert.alert('Excluir', 'Você realmente deseja excluir esta tarefa?', [
            {
                text: 'Cancelar',
                onPress: () => { return }, // retorna imeadiatamente ao pressionar
                style: 'cancel'
            },

            {
                text: 'Sim, Excluir.',
                onPress: async () => {
                    try { // tentar excluir a tarefa

                        const refKey = ref(database, `tarefas/${key}`); // remove a tarefa referenciada pela key
                        await remove(refKey); // remove o usuário com a key expecificada.
                        console.log('tarefa removida com sucesso.');
                    }
                    catch (error) {
                        console.log('Ocorreu um erro ao excluir a tarfera: ', error);
                    }
                },
                style: 'default'
            }
        ]);
    }

    function handleEdit(taskName, key) { // funçao de edição chamada quando clicamos e seguramos sobre o taskbox
        setKey(key);
        Vibration.vibrate();
        refInput.current.focus();
        setInput(taskName);
    }

    return (
        <>
            {inLoading ? (
                <SafeAreaView style={styles.container}>
                    <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                        <Text style={{ color: '#fca311', fontSize: 15, marginBottom: 10 }}>Carregando...</Text>
                        <ActivityIndicator size="large" color="#fca311" />
                    </View>
                </SafeAreaView>
            ) : (
                <SafeAreaView style={styles.container}>
                    <View style={styles.boxHeader}>
                        <Text style={styles.textHeader}>
                            Olá <Text style={{ color: '#fca311', fontWeight: 'bold' }}>{userName}</Text>, vamos planejar seu dia?
                        </Text>
                    </View>

                    {key // se a key existir então renderiza a edição
                        ?
                        <View style={styles.boxEdicao}>
                            <Ionicons name='pencil' size={24} color={"#fca311"} />
                            <Text style={styles.textEdit}>Você está editando uma terefa!</Text>
                        </View>

                        : null
                    }


                    <View style={styles.boxInput}>
                        <TextInput
                            placeholder="O que vai fazer hoje?"
                            placeholderTextColor="#fff"
                            style={styles.input}
                            value={input}
                            onChangeText={(value) => setInput(value)}
                            ref={refInput}
                        />
                        <TouchableOpacity style={styles.button} onPress={handleTaks}>
                            <Text style={styles.buttonText}>+</Text>
                        </TouchableOpacity>
                    </View>

                    <FlatList
                        data={tasks}
                        keyExtractor={(item) => item.key}
                        renderItem={({ item }) => <Tasks data={item} delete={handleDelete} edit={handleEdit} />}
                    />
                </SafeAreaView>
            )}
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#14213d',
        // alignItems: 'center',
        // justifyContent: 'center'
    },
    boxInput: {
        marginTop: 1,
        marginLeft: 10,
        marginRight: 10,
        flexDirection: 'row'
    },
    input: {
        flex: 1,
        borderColor: '#fff',
        borderWidth: 1,
        padding: 10,
        height: 40,
        color: '#fff',
    },
    button: {
        height: 40,
        width: '10%',
        backgroundColor: '#e5e5e5',
        // padding: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 5,
        borderRadius: 5
    },
    buttonText: {
        color: '#fca311',
        fontSize: 25,
        fontWeight: 'bold'
    },
    boxHeader: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 35,
        marginBottom: 25
    },
    textHeader: {
        fontSize: 18,
        color: '#e5e5e5'
    },
    boxEdicao: {
        flexDirection: 'row',
        marginLeft: 10,
        // marginTop: 15,
        alignItems: 'center',
        marginBottom: 5
    },
    textEdit: {
        color: '#fca311',
        padding: 5,
    }
});