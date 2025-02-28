// src/screens/DetailsScreen.js
import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import {
  Surface,
  Title,
  Text,
  Button,
  Divider,
  useTheme
} from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { useActivities } from '../contexts/ActivityContext';
import Toast from 'react-native-toast-message';

export default function DetailsScreen({ navigation, route }) {
  const { activity } = route.params;
  const theme = useTheme();
  const { deleteActivity } = useActivities();

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

  const InfoItem = ({ icon, label, value }) => (
    <View style={styles.infoContainer}>
      <MaterialIcons name={icon} size={24} color={theme.colors.primary} />
      <View style={styles.infoTextContainer}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Surface style={styles.surface}>
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
});
