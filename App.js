import React from 'react';
import { SafeAreaView, StyleSheet, Text } from 'react-native';

//importando nagevação
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

// importando as telas
import Login from './src/pages/Login';
import Home from './src/pages/Home';
import Cadastrar from './src/pages/Cadastrar';


export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Login'>
        <Stack.Screen name='Login' component={Login}
          options={{
            gestureEnabled: false,
            headerShown: false
          }} />

        <Stack.Screen name='Main' component={Home}
          options={{
            gestureEnabled: false,
            headerShown: false
          }}
        />

        <Stack.Screen name='Cadastrar' component={Cadastrar}
          options={{
            gestureEnabled: false,
            headerShown: false
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});


