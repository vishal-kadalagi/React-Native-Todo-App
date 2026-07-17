import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Task } from '../types';
import { colors, shadows } from '../theme/colors';
import { format, isPast } from 'date-fns';

interface TaskItemProps {
  task: Task;
  onToggleStatus: (taskId: string, currentStatus: Task['status']) => void;
  onDelete: (taskId: string) => void;
}

export default function TaskItem({ task, onToggleStatus, onDelete }: TaskItemProps) {
  const isCompleted = task.status === 'Completed';
  const isOverdue = !isCompleted && isPast(new Date(task.deadline));

  return (
    <View style={[styles.container, isCompleted && styles.completedContainer]}>
      <TouchableOpacity 
        style={styles.checkboxContainer} 
        onPress={() => onToggleStatus(task.id, task.status)}
      >
        <Icon 
          name={isCompleted ? 'checkmark-circle' : 'ellipse-outline'} 
          size={28} 
          color={isCompleted ? colors.secondary : colors.border} 
        />
      </TouchableOpacity>
      
      <View style={styles.contentContainer}>
        <Text style={[styles.title, isCompleted && styles.completedText]}>
          {task.title}
        </Text>
        
        {!!task.description && (
          <Text style={styles.description} numberOfLines={2}>
            {task.description}
          </Text>
        )}
        
        <View style={styles.metaContainer}>
          <View style={[styles.badge, { backgroundColor: colors.priority[task.priority] + '20' }]}>
            <Text style={[styles.badgeText, { color: colors.priority[task.priority] }]}>
              {task.priority}
            </Text>
          </View>
          
          {task.category && (
            <View style={[styles.badge, { backgroundColor: colors.primary + '20' }]}>
              <Text style={[styles.badgeText, { color: colors.primary }]}>
                {task.category}
              </Text>
            </View>
          )}
          
          <View style={styles.dateContainer}>
            <Icon name="time-outline" size={14} color={isOverdue ? colors.danger : colors.textMuted} />
            <Text style={[styles.dateText, isOverdue && styles.overdueText]}>
              {format(new Date(task.deadline), 'MMM dd, HH:mm')}
            </Text>
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.deleteButton} onPress={() => onDelete(task.id)}>
        <Icon name="trash-outline" size={22} color={colors.danger} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    ...shadows.card,
  },
  completedContainer: {
    opacity: 0.7,
  },
  checkboxContainer: {
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: colors.textMuted,
  },
  description: {
    fontSize: 14,
    color: colors.textMuted,
    marginBottom: 8,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dateText: {
    fontSize: 12,
    color: colors.textMuted,
  },
  overdueText: {
    color: colors.danger,
    fontWeight: 'bold',
  },
  deleteButton: {
    padding: 8,
    marginLeft: 8,
  }
});
