export interface Task {
  id: string;
  title: string;
  description: string;
  dateTime: number; // Timestamp for when the task is scheduled
  deadline: number; // Timestamp for the final deadline
  priority: 'High' | 'Medium' | 'Low';
  category: 'Work' | 'Personal' | 'Health' | 'Other';
  status: 'Incomplete' | 'Completed';
  userId: string;
  createdAt: number;
}

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Main: undefined; // The tab navigator
};

export type MainTabParamList = {
  Dashboard: undefined;
  AddTask: undefined;
  Profile: undefined;
};
