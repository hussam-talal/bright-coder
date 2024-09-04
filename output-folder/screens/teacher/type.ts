export interface Assignment {
  id: number;
  title: string;
  description: string;
  due_date: string;
  class_id: number;
  teacher_id?: string; // يجب أن يكون اختياريًا
  created_at?: string;
  updated_at?: string;
  status?: 'completed' | 'ongoing'; // Ensure status is defined
}
