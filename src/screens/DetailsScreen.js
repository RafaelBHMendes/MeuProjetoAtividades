// src/screens/DetailsScreen.js
import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import {
  Surface,
  Title,
  Text,
  Button,
  Divider,
  useTheme,
  Chip
} from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { useActivities } from '../contexts/ActivityContext';
import { CATEGORIES } from '../constants/categories';
import { PRIORITIES } from '../constants/priorities';
import Toast from 'react-native-toast-message';

export default function DetailsScreen({ navigation, route }) {
  const { activity } = route.params;
  const theme = useTheme();
  const { deleteActivity } = useActivities();

  const category = CATEGORIES.find(cat => cat.id === activity.category) || CATEGORIES.find(cat => cat.id === 'outros');
  const priority = PRIORITIES.find(p => p.id === activity.priority) || PRIORITIES[1];

  const handleDelete = async () => {
    await deleteActivity(activity.id);
    Toast.show({
      type: 'success',
      text1: 'Sucesso',
      text2: 'Atividade excluída com sucesso!',
      position: 'bottom'
    });
    navigation.goBack();
  };

  const InfoItem = ({ icon, label, value, color }) => (
    <View style={styles.infoContainer}>
      <MaterialIcons name={icon} size={24} color={color || theme.colors.primary} />
      <View style={styles.infoTextContainer}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Surface style={[styles.surface, { borderTopWidth: 4, borderTopColor: category.color }]}>
        <Title style={styles.title}>Detalhes da Atividade</Title>

        <InfoItem
          icon="assignment"
          label="Nome"
          value={activity.name}
        />
        <Divider style={styles.divider} />

        <InfoItem
          icon="person"
          label="Responsável"
          value={activity.responsible}
        />
        <Divider style={styles.divider} />

        <View style={styles.infoContainer}>
          <MaterialIcons name={category.icon} size={24} color={category.color} />
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoLabel}>Categoria</Text>
            <Chip
              style={[styles.categoryChip, { backgroundColor: category.color }]}
              textStyle={styles.categoryChipText}
            >
              {category.name}
            </Chip>
          </View>
        </View>
        <Divider style={styles.divider} />

        <View style={styles.infoContainer}>
          <MaterialIcons name={priority.icon} size={24} color={priority.color} />
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoLabel}>Prioridade</Text>
            <Chip
              style={[styles.categoryChip, { backgroundColor: priority.color }]}
              textStyle={styles.categoryChipText}
            >
              {priority.name}
            </Chip>
          </View>
        </View>
        <Divider style={styles.divider} />

        <InfoItem
          icon="event"
          label="Data"
          value={activity.date}
        />
        <Divider style={styles.divider} />

        <InfoItem
          icon="description"
          label="Descrição"
          value={activity.description}
        />

        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            icon={() => <MaterialIcons name="edit" size={24} color="white" />}
            onPress={() => navigation.navigate('Editar', { activity })}
            style={[styles.button, { marginRight: 8 }]}
          >
            Editar
          </Button>
          <Button
            mode="contained"
            icon={() => <MaterialIcons name="delete" size={24} color="white" />}
            onPress={handleDelete}
            style={[styles.button, { backgroundColor: theme.colors.error }]}
          >
            Excluir
          </Button>
        </View>
      </Surface>
      <Toast />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  surface: {
    margin: 16,
    padding: 16,
    borderRadius: 8,
    elevation: 4,
  },
  title: {
    textAlign: 'center',
    marginBottom: 24,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
  },
  infoTextContainer: {
    marginLeft: 16,
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
  },
  divider: {
    marginVertical: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  button: {
    flex: 1,
  },
  categoryChip: {
    marginTop: 4,
  },
  categoryChipText: {
    color: '#fff',
  }
});
