// src/screens/HomeScreen.js
import React, { useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import {
  Searchbar,
  Card,
  Title,
  Paragraph,
  Text,
  FAB,
  useTheme,
  Surface,
  Chip,
  Divider
} from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { useActivities } from '../contexts/ActivityContext';
import { CATEGORIES } from '../constants/categories';
import { PRIORITIES } from '../constants/priorities';

export default function HomeScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedPriority, setSelectedPriority] = useState(null);
  const theme = useTheme();
  const { activities } = useActivities();

  // Filtra as atividades conforme o texto da pesquisa, categoria e prioridade
  const filteredActivities = activities.filter((act) => {
    const matchesSearch = act.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory ? act.category === selectedCategory : true;
    const matchesPriority = selectedPriority ? act.priority === selectedPriority : true;
    return matchesSearch && matchesCategory && matchesPriority;
  });

  const getCategoryColor = (categoryId) => {
    const category = CATEGORIES.find(cat => cat.id === categoryId);
    return category ? category.color : theme.colors.primary;
  };

  const getCategoryIcon = (categoryId) => {
    const category = CATEGORIES.find(cat => cat.id === categoryId);
    return category ? category.icon : 'more-horiz';
  };

  const getPriorityInfo = (priorityId) => {
    return PRIORITIES.find(p => p.id === priorityId) || PRIORITIES[1]; // Média como padrão
  };

  const renderItem = ({ item }) => {
    const priority = getPriorityInfo(item.priority);
    
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('Detalhes', { activity: item })}
      >
        <Card style={[styles.card, { borderLeftWidth: 4, borderLeftColor: getCategoryColor(item.category) }]}>
          <Card.Content style={styles.cardContent}>
            <View style={styles.cardMainInfo}>
              <View style={styles.cardHeader}>
                <View style={styles.titleContainer}>
                  <MaterialIcons 
                    name={priority.icon} 
                    size={16} 
                    color={priority.color}
                    style={styles.priorityIcon}
                  />
                  <Title style={styles.cardTitle}>{item.name}</Title>
                </View>
                <MaterialIcons 
                  name={getCategoryIcon(item.category)} 
                  size={20} 
                  color={getCategoryColor(item.category)} 
                />
              </View>
              <Paragraph style={styles.responsibleText}>Responsável: {item.responsible}</Paragraph>
            </View>
            <View style={styles.dateContainer}>
              <MaterialIcons name="event" size={14} color={theme.colors.primary} />
              <Text style={styles.dateText}>{item.date}</Text>
            </View>
          </Card.Content>
        </Card>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Pesquisar atividades..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
      />

      <View style={styles.filtersContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}
          contentContainerStyle={styles.categoriesContent}
        >
          <Chip
            selected={!selectedCategory}
            onPress={() => setSelectedCategory(null)}
            style={styles.categoryChip}
            textStyle={styles.chipText}
          >
            Todas Categorias
          </Chip>
          {CATEGORIES.map((category) => (
            <Chip
              key={category.id}
              selected={selectedCategory === category.id}
              onPress={() => setSelectedCategory(category.id)}
              style={[
                styles.categoryChip,
                selectedCategory === category.id && { backgroundColor: category.color }
              ]}
              textStyle={[
                styles.chipText,
                selectedCategory === category.id ? styles.selectedCategoryText : null
              ]}
              icon={() => (
                <MaterialIcons
                  name={category.icon}
                  size={16}
                  color={selectedCategory === category.id ? '#fff' : category.color}
                />
              )}
            >
              {category.name}
            </Chip>
          ))}
        </ScrollView>

        <Divider style={styles.filterDivider} />

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.prioritiesContainer}
          contentContainerStyle={styles.categoriesContent}
        >
          <Chip
            selected={!selectedPriority}
            onPress={() => setSelectedPriority(null)}
            style={styles.categoryChip}
            textStyle={styles.chipText}
          >
            Todas Prioridades
          </Chip>
          {PRIORITIES.map((priority) => (
            <Chip
              key={priority.id}
              selected={selectedPriority === priority.id}
              onPress={() => setSelectedPriority(priority.id)}
              style={[
                styles.categoryChip,
                selectedPriority === priority.id && { backgroundColor: priority.color }
              ]}
              textStyle={[
                styles.chipText,
                selectedPriority === priority.id ? styles.selectedCategoryText : null
              ]}
              icon={() => (
                <MaterialIcons
                  name={priority.icon}
                  size={16}
                  color={selectedPriority === priority.id ? '#fff' : priority.color}
                />
              )}
            >
              {priority.name}
            </Chip>
          ))}
        </ScrollView>
      </View>
      
      <FlatList
        data={filteredActivities}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={
          <Surface style={styles.emptyContainer}>
            <MaterialIcons name="assignment" size={48} color={theme.colors.primary} />
            <Text style={styles.emptyText}>
              {searchQuery || selectedCategory || selectedPriority
                ? 'Nenhuma atividade encontrada'
                : 'Nenhuma atividade cadastrada'}
            </Text>
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
  filtersContainer: {
    marginBottom: 8,
  },
  categoriesContainer: {
    paddingHorizontal: 16,
  },
  prioritiesContainer: {
    paddingHorizontal: 16,
  },
  categoriesContent: {
    paddingVertical: 4,
  },
  filterDivider: {
    marginVertical: 4,
  },
  categoryChip: {
    marginRight: 8,
    height: 32,
  },
  chipText: {
    fontSize: 12,
  },
  selectedCategoryText: {
    color: '#fff',
  },
  card: {
    marginHorizontal: 16,
    marginBottom: 8,
    elevation: 4,
  },
  cardContent: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  cardMainInfo: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  priorityIcon: {
    marginRight: 4,
  },
  cardTitle: {
    fontSize: 16,
    marginBottom: 0,
    flex: 1,
  },
  responsibleText: {
    fontSize: 14,
    marginBottom: 0,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  dateText: {
    marginLeft: 4,
    color: '#666',
    fontSize: 12,
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
  list: {
    paddingBottom: 80,
  },
});
