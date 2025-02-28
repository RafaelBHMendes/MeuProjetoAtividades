// src/navigation/Navigation.js
import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { MaterialIcons } from '@expo/vector-icons'
import { useTheme } from 'react-native-paper'

// Import das telas
import HomeScreen from '../screens/HomeScreen'
import RegisterActivityScreen from '../screens/RegisterActivityScreen'
import DetailsScreen from '../screens/DetailsScreen'
import EditActivityScreen from '../screens/EditActivityScreen'

const Stack = createStackNavigator()

export default function Navigation() {
  const theme = useTheme()

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName='Home'
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.colors.primary,
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name='Home' 
          component={HomeScreen} 
          options={({ navigation }) => ({
            title: 'Atividades',
            headerRight: () => (
              <MaterialIcons 
                name="add" 
                size={24} 
                color="#fff" 
                style={{ marginRight: 15 }}
                onPress={() => navigation.navigate('Cadastro')}
              />
            ),
          })}
        />
        <Stack.Screen
          name='Cadastro'
          component={RegisterActivityScreen}
          options={{ 
            title: 'Nova Atividade',
            headerBackTitle: 'Voltar'
          }}
        />
        <Stack.Screen 
          name='Detalhes' 
          component={DetailsScreen} 
          options={{ 
            title: 'Detalhes',
            headerBackTitle: 'Voltar'
          }} 
        />
        <Stack.Screen
          name='Editar'
          component={EditActivityScreen}
          options={{ 
            title: 'Editar Atividade',
            headerBackTitle: 'Voltar'
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
