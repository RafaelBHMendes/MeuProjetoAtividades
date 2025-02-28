import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ActivityContext = createContext({});

const STORAGE_KEY = '@activities';

export function ActivityProvider({ children }) {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setActivities(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Erro ao carregar atividades:', error);
    }
  };

  const saveActivities = async (newActivities) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newActivities));
      setActivities(newActivities);
    } catch (error) {
      console.error('Erro ao salvar atividades:', error);
    }
  };

  const addActivity = async (activity) => {
    const newActivities = [...activities, { 
      ...activity, 
      id: Date.now(),
      category: activity.category || 'outros',
      priority: activity.priority || 'media' // Prioridade padrão
    }];
    await saveActivities(newActivities);
  };

  const updateActivity = async (updatedActivity) => {
    const newActivities = activities.map(act => 
      act.id === updatedActivity.id ? updatedActivity : act
    );
    await saveActivities(newActivities);
  };

  const deleteActivity = async (id) => {
    const newActivities = activities.filter(act => act.id !== id);
    await saveActivities(newActivities);
  };

  const getActivitiesByCategory = (categoryId) => {
    return activities.filter(act => act.category === categoryId);
  };

  const getActivitiesByPriority = (priorityId) => {
    return activities.filter(act => act.priority === priorityId);
  };

  return (
    <ActivityContext.Provider 
      value={{
        activities,
        addActivity,
        updateActivity,
        deleteActivity,
        getActivitiesByCategory,
        getActivitiesByPriority
      }}
    >
      {children}
    </ActivityContext.Provider>
  );
}

export function useActivities() {
  const context = useContext(ActivityContext);
  if (!context) {
    throw new Error('useActivities deve ser usado dentro de um ActivityProvider');
  }
  return context;
} 