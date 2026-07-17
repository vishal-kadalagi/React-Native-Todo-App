import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { auth } from '../config/firebase';
import { API_URL } from '../config/api';
import { colors } from '../theme/colors';
import { Task, MainTabParamList } from '../types';
import TaskItem from '../components/TaskItem';
import Icon from 'react-native-vector-icons/Ionicons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type Props = NativeStackScreenProps<MainTabParamList, 'Dashboard'>;

export default function DashboardScreen({ navigation }: Props) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filter state
  const [filterStatus, setFilterStatus] = useState<'All' | 'Incomplete' | 'Completed'>('All');

  const fetchTasks = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const response = await fetch(`${API_URL}/tasks/${user.uid}`);
      if (response.ok) {
        const data = await response.json();
        setTasks(data);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchTasks();
    }, [])
  );

  const handleToggleStatus = async (taskId: string, currentStatus: Task['status']) => {
    const newStatus = currentStatus === 'Completed' ? 'Incomplete' : 'Completed';
    // Optimistic update
    setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    
    try {
      await fetch(`${API_URL}/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (error) {
      console.error('Error updating task status:', error);
      // Revert on error
      setTasks(tasks.map(t => t.id === taskId ? { ...t, status: currentStatus } : t));
    }
  };

  const handleDelete = async (taskId: string) => {
    // Optimistic update
    const previousTasks = [...tasks];
    setTasks(tasks.filter(t => t.id !== taskId));
    
    try {
      await fetch(`${API_URL}/tasks/${taskId}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('Error deleting task:', error);
      // Revert on error
      setTasks(previousTasks);
    }
  };

  // Custom Sorting Algorithm: Time + Deadline + Priority Mix
  const scoreTask = (task: Task) => {
    if (task.status === 'Completed') return -10000; // Completed tasks drop to the bottom

    let score = 0;
    
    // Priority Score
    if (task.priority === 'High') score += 1000;
    else if (task.priority === 'Medium') score += 500;

    const now = Date.now();
    
    // Deadline proximity score
    const timeToDeadline = task.deadline - now;
    if (timeToDeadline < 0) {
      score += 5000; // Overdue and incomplete tasks are extremely urgent
    } else {
      // Map 7 days into a 0-500 score (closer = higher score)
      const sevenDays = 7 * 24 * 60 * 60 * 1000;
      if (timeToDeadline < sevenDays) {
        score += ((sevenDays - timeToDeadline) / sevenDays) * 500;
      }
    }

    // Schedule time score
    const timeToStart = task.dateTime - now;
    if (timeToStart < 0) {
      score += 200; // Task was scheduled to start in the past
    }

    return score;
  };

  const filteredAndSortedTasks = useMemo(() => {
    let filtered = [...tasks];
    if (filterStatus !== 'All') {
      filtered = filtered.filter(t => t.status === filterStatus);
    }

    // Sort descending by score (highest urgency at top)
    return filtered.sort((a, b) => scoreTask(b) - scoreTask(a));
  }, [tasks, filterStatus]);


  const renderHeader = () => (
    <View style={styles.header}>
      <View>
        <Text style={styles.greeting}>Hello, {auth.currentUser?.email?.split('@')[0]}</Text>
        <Text style={styles.subtitle}>You have {tasks.filter(t => t.status === 'Incomplete').length} pending tasks</Text>
      </View>
      <TouchableOpacity onPress={() => auth.signOut()} style={styles.logoutButton}>
        <Icon name="log-out-outline" size={24} color={colors.textMuted} />
      </TouchableOpacity>
    </View>
  );

  const renderFilters = () => (
    <View style={styles.filterContainer}>
      {(['All', 'Incomplete', 'Completed'] as const).map(status => (
        <TouchableOpacity 
          key={status}
          style={[styles.filterChip, filterStatus === status && styles.filterChipActive]}
          onPress={() => setFilterStatus(status)}
        >
          <Text style={[styles.filterText, filterStatus === status && styles.filterTextActive]}>
            {status}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      {renderHeader()}
      {renderFilters()}
      
      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={filteredAndSortedTasks}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TaskItem 
              task={item} 
              onToggleStatus={handleToggleStatus} 
              onDelete={handleDelete} 
            />
          )}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Icon name="document-text-outline" size={64} color={colors.border} />
              <Text style={styles.emptyText}>No tasks found.</Text>
            </View>
          }
        />
      )}

      <TouchableOpacity 
        style={styles.fab} 
        onPress={() => navigation.navigate('AddTask')}
      >
        <Icon name="add" size={32} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 24,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textMuted,
    marginTop: 4,
  },
  logoutButton: {
    padding: 8,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 16,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterText: {
    color: colors.textMuted,
    fontWeight: '600',
    fontSize: 12,
  },
  filterTextActive: {
    color: '#FFF',
  },
  listContent: {
    padding: 24,
    paddingTop: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 64,
  },
  emptyText: {
    marginTop: 16,
    color: colors.textMuted,
    fontSize: 16,
  },
  fab: {
    position: 'absolute',
    bottom: 32,
    right: 24,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
