// src/screens/HomeScreen.js
import React, { useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import {
  Searchbar,
  Card,
  Title,
  Paragraph,
  Text,
  FAB,
  useTheme,
  Surface
} from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { useActivities } from '../contexts/ActivityContext';

export default function HomeScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const theme = useTheme();
  const { activities } = useActivities();

  // Filtra as atividades conforme o texto da pesquisa
  const filteredActivities = activities.filter((act) =>
    act.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('Detalhes', { activity: item })}
    >
      <Card style={styles.card}>
        <Card.Content>
          <Title>{item.name}</Title>
          <Paragraph>Responsável: {item.responsible}</Paragraph>
          <View style={styles.dateContainer}>
            <MaterialIcons name="event" size={16} color={theme.colors.primary} />
            <Text style={styles.dateText}>{item.date}</Text>
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Pesquisar atividades..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
      />
      
      <FlatList
        data={filteredActivities}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={
          <Surface style={styles.emptyContainer}>
            <MaterialIcons name="assignment" size={48} color={theme.colors.primary} />
            <Text style={styles.emptyText}>Nenhuma atividade cadastrada</Text>
          </Surface>
        }
        contentContainerStyle={styles.list}
      />

      <FAB
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        icon="plus"
        onPress={() => navigation.navigate('Cadastro')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchbar: {
    margin: 16,
    elevation: 4,
  },
  card: {
    marginHorizontal: 16,
    marginBottom: 8,
    elevation: 4,
  },
  list: {
    paddingBottom: 80,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  dateText: {
    marginLeft: 4,
    color: '#666',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  emptyContainer: {
    margin: 16,
    padding: 20,
    alignItems: 'center',
    borderRadius: 8,
  },
  emptyText: {
    marginTop: 8,
    fontSize: 16,
    color: '#666',
  },
});
