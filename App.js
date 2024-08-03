import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './screens/HomeScreen';
import BookDetailScreen from './screens/BookDetailScreen';
import BorrowedScreen from './screens/BorrowedScreen';
import { Ionicons } from '@expo/vector-icons';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const HomeStack = () => (
  <Stack.Navigator screenOptions={screenOptions}>
    <Stack.Screen name="Books List" component={HomeScreen} />
    <Stack.Screen name="Book Detail" component={BookDetailScreen} />
  </Stack.Navigator>
);

const App = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Borrowed') {
              iconName = focused ? 'book' : 'book-outline';
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#42a5f5',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name="Home" component={HomeStack} />
        <Tab.Screen name="Borrowed" component={BorrowedScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

const screenOptions = {
  headerStyle: { backgroundColor: '#42a5f5' },
  headerTintColor: '#fff',
  headerTitleStyle: { fontWeight: 'bold' },
};

export default App;
