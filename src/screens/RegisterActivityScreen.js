// src/screens/RegisterActivityScreen.js
import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import {
  TextInput,
  Button,
  Surface,
  Title,
  HelperText,
  useTheme,
  Text
} from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import Toast from 'react-native-toast-message';
import moment from 'moment';
import 'moment/locale/pt-br';
import { useActivities } from '../contexts/ActivityContext';

moment.locale('pt-br');

export default function RegisterActivityScreen({ navigation }) {
  const theme = useTheme();
  const { addActivity } = useActivities();
  const [form, setForm] = useState({
    name: '',
    responsible: '',
    date: new Date(),
    description: ''
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
      const newActivity = {
        ...form,
        date: moment(form.date).format('DD/MM/YYYY')
      };
      
      await addActivity(newActivity);
      
      Toast.show({
        type: 'success',
        text1: 'Sucesso',
        text2: 'Atividade cadastrada com sucesso!',
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
        <Title style={styles.title}>Nova Atividade</Title>

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
          Salvar Atividade
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
});
