// src/screens/EditActivityScreen.js
import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import {
  TextInput,
  Button,
  Surface,
  Title,
  HelperText,
  useTheme,
  Text,
  Chip
} from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import Toast from 'react-native-toast-message';
import moment from 'moment';
import { useActivities } from '../contexts/ActivityContext';
import { CATEGORIES } from '../constants/categories';
import { PRIORITIES } from '../constants/priorities';

export default function EditActivityScreen({ navigation, route }) {
  const { activity } = route.params;
  const theme = useTheme();
  const { updateActivity } = useActivities();
  const [form, setForm] = useState({
    ...activity,
    date: moment(activity.date, 'DD/MM/YYYY').toDate(),
    category: activity.category || 'outros',
    priority: activity.priority || 'media'
  });
  const [errors, setErrors] = useState({});
  const [showDatePicker, setShowDatePicker] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!form.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }
    if (!form.responsible.trim()) {
      newErrors.responsible = 'Responsável é obrigatório';
    }
    if (!form.description.trim()) {
      newErrors.description = 'Descrição é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      const updatedActivity = {
        ...form,
        date: moment(form.date).format('DD/MM/YYYY')
      };

      await updateActivity(updatedActivity);
      
      Toast.show({
        type: 'success',
        text1: 'Sucesso',
        text2: 'Atividade atualizada com sucesso!',
        position: 'bottom'
      });
      
      navigation.goBack();
    } else {
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: 'Por favor, preencha todos os campos corretamente.',
        position: 'bottom'
      });
    }
  };

  const updateField = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || form.date;
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    updateField('date', currentDate);
  };

  return (
    <ScrollView style={styles.container}>
      <Surface style={styles.surface}>
        <Title style={styles.title}>Editar Atividade</Title>

        <TextInput
          label="Nome da Atividade"
          value={form.name}
          onChangeText={(value) => updateField('name', value)}
          mode="outlined"
          error={!!errors.name}
          left={<TextInput.Icon icon={() => <MaterialIcons name="assignment" size={24} color={theme.colors.primary} />} />}
          style={styles.input}
        />
        <HelperText type="error" visible={!!errors.name}>
          {errors.name}
        </HelperText>

        <TextInput
          label="Responsável"
          value={form.responsible}
          onChangeText={(value) => updateField('responsible', value)}
          mode="outlined"
          error={!!errors.responsible}
          left={<TextInput.Icon icon={() => <MaterialIcons name="person" size={24} color={theme.colors.primary} />} />}
          style={styles.input}
        />
        <HelperText type="error" visible={!!errors.responsible}>
          {errors.responsible}
        </HelperText>

        <View style={styles.categoriesContainer}>
          <Text style={styles.categoryLabel}>Categoria</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
            {CATEGORIES.map((category) => (
              <Chip
                key={category.id}
                selected={form.category === category.id}
                onPress={() => updateField('category', category.id)}
                style={[
                  styles.categoryChip,
                  form.category === category.id && { backgroundColor: category.color }
                ]}
                textStyle={form.category === category.id ? styles.selectedCategoryText : null}
                icon={() => (
                  <MaterialIcons
                    name={category.icon}
                    size={20}
                    color={form.category === category.id ? '#fff' : category.color}
                  />
                )}
              >
                {category.name}
              </Chip>
            ))}
          </ScrollView>
        </View>

        <View style={styles.categoriesContainer}>
          <Text style={styles.categoryLabel}>Prioridade</Text>
          <View style={styles.prioritiesContainer}>
            {PRIORITIES.map((priority) => (
              <Chip
                key={priority.id}
                selected={form.priority === priority.id}
                onPress={() => updateField('priority', priority.id)}
                style={[
                  styles.priorityChip,
                  form.priority === priority.id && { backgroundColor: priority.color }
                ]}
                textStyle={form.priority === priority.id ? styles.selectedCategoryText : null}
                icon={() => (
                  <MaterialIcons
                    name={priority.icon}
                    size={20}
                    color={form.priority === priority.id ? '#fff' : priority.color}
                  />
                )}
              >
                {priority.name}
              </Chip>
            ))}
          </View>
        </View>

        <TouchableOpacity 
          onPress={() => setShowDatePicker(true)}
          style={[
            styles.dateContainer,
            Platform.OS === 'ios' && showDatePicker && { borderColor: theme.colors.primary }
          ]}
        >
          <MaterialIcons name="event" size={24} color={theme.colors.primary} style={styles.dateIcon} />
          <Text style={styles.dateText}>
            {moment(form.date).format('DD [de] MMMM [de] YYYY')}
          </Text>
        </TouchableOpacity>

        {(showDatePicker || Platform.OS === 'ios') && (
          <DateTimePicker
            testID="dateTimePicker"
            value={form.date}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={onDateChange}
            style={styles.datePicker}
          />
        )}

        <TextInput
          label="Descrição"
          value={form.description}
          onChangeText={(value) => updateField('description', value)}
          mode="outlined"
          error={!!errors.description}
          multiline
          numberOfLines={4}
          left={<TextInput.Icon icon={() => <MaterialIcons name="description" size={24} color={theme.colors.primary} />} />}
          style={[styles.input, styles.textArea]}
        />
        <HelperText type="error" visible={!!errors.description}>
          {errors.description}
        </HelperText>

        <Button
          mode="contained"
          onPress={handleSubmit}
          style={styles.button}
          icon={() => <MaterialIcons name="save" size={24} color="white" />}
        >
          Atualizar Atividade
        </Button>
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
    marginBottom: 20,
    fontSize: 24,
    fontWeight: 'bold',
  },
  input: {
    marginBottom: 4,
    backgroundColor: '#fff',
  },
  textArea: {
    minHeight: 100,
  },
  button: {
    marginTop: 20,
    paddingVertical: 8,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 12,
    marginVertical: 8,
    backgroundColor: '#fff',
  },
  dateIcon: {
    marginRight: 10,
  },
  dateText: {
    fontSize: 16,
  },
  datePicker: {
    marginTop: 8,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  categoriesContainer: {
    marginVertical: 16,
  },
  categoryLabel: {
    fontSize: 16,
    marginBottom: 8,
    color: '#666',
  },
  categoriesScroll: {
    flexDirection: 'row',
  },
  categoryChip: {
    marginRight: 8,
    marginBottom: 8,
  },
  selectedCategoryText: {
    color: '#fff',
  },
  prioritiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  priorityChip: {
    marginRight: 8,
    marginBottom: 8,
    minWidth: 100,
  }
});
