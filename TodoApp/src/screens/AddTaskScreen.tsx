import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';
import { collection, addDoc } from 'firebase/firestore';
import { auth } from '../config/firebase';
import { API_URL } from '../config/api';
import Input from '../components/Input';
import Button from '../components/Button';
import { colors } from '../theme/colors';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainTabParamList } from '../types';
import DatePicker from 'react-native-date-picker';
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { format } from 'date-fns';

type Props = NativeStackScreenProps<MainTabParamList, 'AddTask'>;

export default function AddTaskScreen({ navigation }: Props) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  
  const [dateTime, setDateTime] = useState(new Date());
  const [showDateTimePicker, setShowDateTimePicker] = useState(false);
  
  const [deadline, setDeadline] = useState(new Date(Date.now() + 86400000)); // Default +1 day
  const [showDeadlinePicker, setShowDeadlinePicker] = useState(false);

  const [priority, setPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');
  const [category, setCategory] = useState<'Work' | 'Personal' | 'Health' | 'Other'>('Personal');
  const [loading, setLoading] = useState(false);

  const handleSaveTask = async () => {
    if (!title.trim()) {
      Alert.alert('Validation Error', 'Task title is required.');
      return;
    }

    setLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('User not authenticated');

      const response = await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          dateTime: dateTime.getTime(),
          deadline: deadline.getTime(),
          priority,
          category,
          status: 'Incomplete',
          userId: user.uid,
          createdAt: Date.now(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create task on the server');
      }
      
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to add task');
    } finally {
      setLoading(false);
    }
  };

  const renderPrioritySelector = () => (
    <View style={styles.priorityContainer}>
      <Text style={styles.label}>Priority</Text>
      <View style={styles.priorityRow}>
        {(['High', 'Medium', 'Low'] as const).map(p => (
          <TouchableOpacity
            key={p}
            style={[
              styles.priorityButton,
              priority === p && { backgroundColor: colors.priority[p], borderColor: colors.priority[p] }
            ]}
            onPress={() => setPriority(p)}
          >
            <Text style={[styles.priorityText, priority === p && { color: '#FFF' }]}>{p}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderCategorySelector = () => (
    <View style={styles.priorityContainer}>
      <Text style={styles.label}>Category</Text>
      <View style={styles.priorityRow}>
        {(['Work', 'Personal', 'Health', 'Other'] as const).map(c => (
          <TouchableOpacity
            key={c}
            style={[
              styles.categoryButton,
              category === c && { backgroundColor: colors.primary, borderColor: colors.primary }
            ]}
            onPress={() => setCategory(c)}
          >
            <Text style={[styles.priorityText, category === c && { color: '#FFF' }]}>{c}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{flex: 1}}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>New Task</Text>
          <View style={{width: 24}} /> 
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Input
            label="Task Title"
            placeholder="What do you need to do?"
            value={title}
            onChangeText={setTitle}
          />
          
          <Input
            label="Description (Optional)"
            placeholder="Add some details..."
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
            style={{ height: 80, textAlignVertical: 'top' }}
          />

          <View style={styles.datePickerContainer}>
            <Text style={styles.label}>Schedule (Date & Time)</Text>
            <TouchableOpacity style={styles.datePickerButton} onPress={() => setShowDateTimePicker(true)}>
              <Icon name="calendar-outline" size={20} color={colors.primary} />
              <Text style={styles.dateText}>{format(dateTime, 'MMM dd, yyyy HH:mm')}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.datePickerContainer}>
            <Text style={styles.label}>Deadline</Text>
            <TouchableOpacity style={styles.datePickerButton} onPress={() => setShowDeadlinePicker(true)}>
              <Icon name="time-outline" size={20} color={colors.danger} />
              <Text style={styles.dateText}>{format(deadline, 'MMM dd, yyyy HH:mm')}</Text>
            </TouchableOpacity>
          </View>

          {renderPrioritySelector()}
          {renderCategorySelector()}

          <Button 
            title="Create Task" 
            onPress={handleSaveTask} 
            loading={loading}
            style={styles.submitButton}
          />

          <DatePicker
            modal
            open={showDateTimePicker}
            date={dateTime}
            onConfirm={(date) => {
              setShowDateTimePicker(false);
              setDateTime(date);
            }}
            onCancel={() => {
              setShowDateTimePicker(false);
            }}
          />

          <DatePicker
            modal
            open={showDeadlinePicker}
            date={deadline}
            onConfirm={(date) => {
              setShowDeadlinePicker(false);
              setDeadline(date);
            }}
            onCancel={() => {
              setShowDeadlinePicker(false);
            }}
          />

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  scrollContent: {
    padding: 24,
  },
  datePickerContainer: {
    marginBottom: 20,
  },
  label: {
    color: colors.text,
    marginBottom: 8,
    fontSize: 14,
    fontWeight: '600',
  },
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dateText: {
    color: colors.text,
    marginLeft: 12,
    fontSize: 16,
  },
  priorityContainer: {
    marginBottom: 32,
  },
  priorityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  priorityButton: {
    flex: 1,
    paddingVertical: 12,
    marginHorizontal: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    backgroundColor: colors.surface,
  },
  priorityText: {
    color: colors.textMuted,
    fontWeight: '600',
    fontSize: 12,
  },
  categoryButton: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    backgroundColor: colors.surface,
  },
  submitButton: {
    marginTop: 10,
    marginBottom: 40,
  }
});
