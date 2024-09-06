import { LiveSessionType } from './routeType';
import { supabase } from './supabase';

interface CourseProgress {
  id: number;
  user_id: string;  // نوع UUID
  course_id: number;
  current_level: number;
  progress_percentage: number;
  completed: boolean;
  created_at: string;  // توقيت زمني
  updated_at: string;  // توقيت زمني
}
interface Challenge {
  id: number;
  title: string;
  description: string;
  difficulty_level: string;
  challenge_type: string;
  created_by: string;  
  created_at?: string;  
  updated_at?: string;  
  due_date?: string;  

}

interface ChallengeInput {
  title: string;
  description: string;
  difficulty_level: string;
  challenge_type: string;
  created_by: string; 
  start_date: string; 
  end_date: string;   
  status: 'active' | 'inactive'; 
  due_date?: string;  
}

interface Assignment {
  id: number;
  title: string;
  description: string;
  class_id: number;
  created_at?: string;
  updated_at?: string;
  due_date?: string;  // أو Date إذا كنت تستخدم النوع timestamp
}

interface AssignmentInput {
  title: string;
  description: string;
  due_date: string;
  class_id: number;
  teacher_id: string;
  created_at?: string;
  updated_at?: string;
  status?: 'completed' | 'ongoing';
}
type ChildData = {
  parent_id: string;
  full_name: string;
  email: string;
  age: number;
  grade: string;
  created_at?: string; 
  updated_at?: string; 
};



// Helper function to handle errors
const handleError = (error: any) => {
  console.error('Supabase Error:', error.message);
  throw new Error(error.message);
};

// Helper function to validate input data
const validateInput = (inputs: Record<string, any>) => {
  for (const key in inputs) {
    if (!inputs[key]) {
      throw new Error(`${key} is required`);
    }
  }
};

export const fetchUserProfile = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('full_name, avatar_url')
      .eq('id', userId)
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

// دالة البحث عن المستخدمين في profiles
export const searchUsers = async (searchText: string) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, username, avatar_url') 
      .ilike('full_name', `%${searchText}%`); 

    if (error) {
      console.error("Error searching users:", error.message);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Failed to search users:", error);
    throw error;
  }
};



export const createChildProfile = async (childData: ChildData): Promise<any> => {
  const { data, error } = await supabase
    .from('children')
    .insert(childData);

  if (error) {
    throw new Error(error.message);
  }

  return data;
};


export const insertChildProfile = async (
  parentId: string,
  fullName: string,
  email: string,
  age: number,
  grade: string,
  learningPref: string,
  educationalLevel: string
) => {
  try {
    const { data, error } = await supabase
      .from('children')
      .insert({
        parent_id: parentId,  
        full_name: fullName,  
        email: email,         
        age: age,            
        grade: grade,        
        learning_pref: learningPref, 
        educational_level: educationalLevel, 
      });

    if (error) {
      throw error;
    }

    return data; 
  } catch (error) {
    console.error('Error inserting child profile:', error);
    throw new Error('Failed to insert child profile.');
  }
};

// وظيفة لقراءة السجلات مع تحديد نوع المعرف
export const getChildProfiles = async (parentId: string): Promise<ChildData[]> => {
  const { data, error } = await supabase
    .from('children')
    .select('*')
    .eq('parent_id', parentId);

  if (error) {
    throw new Error(error.message);
  }

  return data as ChildData[];
};

export const updateChildProfile = async (childId: number, updatedData: Partial<ChildData>): Promise<any> => {
  const { data, error } = await supabase
    .from('children')
    .update(updatedData)
    .eq('id', childId);

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

// وظيفة لحذف سجل مع تحديد نوع المعرف
export const deleteChildProfile = async (childId: number): Promise<any> => {
  const { data, error } = await supabase
    .from('children')
    .delete()
    .eq('id', childId);

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const fetchClassIdAndTeacherId = async () => {
  try {
    // Fetch classId and teacherId from your Supabase database
    const { data, error } = await supabase
      .from('classes')
      .select('id, teacher_id') 
      .single(); // Use .single() if you're fetching a single record

    if (error) {
      throw error;
    }

    return {
      classId: data.id,
      teacherId: data.teacher_id,
    };
  } catch (error) {
    console.error('Error fetching class and teacher data:', error);
    throw error;
  }
};

export const fetchProfiles = async () => {
  const { data, error } = await supabase.from('profiles').select('*');
  if (error) throw error;
  return data;
};

export const addProfile = async (profile: { full_name: string, role: string, school_name?: string, country: string, city: string, phone: string }) => {
  const { data, error } = await supabase.from('profiles').insert([profile]);
  if (error) throw error;
  return data;
};

export const updateProfile = async (id: string, profile: Partial<{ full_name: string, role: string, school_name?: string, country: string, city: string, phone: string, age_range: string, parent_email: string }>) => {
  console.log('Updating profile for user with ID:', id);
  console.log('Profile data being updated:', profile);

  const { data, error } = await supabase.from('profiles').update(profile).eq('id', id);
  
  if (error) {
    console.error('Error updating profile:', error);
    throw error;
  }

  console.log('Update success:', data);
  return data;
};

export const deleteProfile = async (id: string) => {
  const { data, error } = await supabase.from('profiles').delete().eq('id', id);
  if (error) throw error;
  return data;
};

// عمليات CRUD للفصول الدراسية (classes)

// عمليات CRUD للطلاب (students)
export const fetchStudents = async (classId: any) => {
  const { data, error } = await supabase
    .from('class_students')
    .select('*')
    .eq('class_id', classId);

  if (error) {
    console.error('Failed to fetch students:', error);
    return [];
  }

  return data;
};

export const addStudent = async (student: { full_name: string, email: string, class_id: string }) => {
  const { data, error } = await supabase.from('students').insert([student]);
  if (error) throw error;
  return data;
};

export const updateStudent = async (id: string, student: Partial<{ full_name: string, email: string }>) => {
  const { data, error } = await supabase.from('students').update(student).eq('id', id);
  if (error) throw error;
  return data;
};

export const deleteStudent = async (id: string) => {
  const { data, error } = await supabase.from('students').delete().eq('id', id);
  if (error) throw error;
  return data;
};

// عمليات CRUD للجلسات (sessions)
export const fetchSessions = async () => {
  const { data, error } = await supabase.from('sessions').select('*');
  if (error) throw error;
  return data;
};

export const addSession = async (session: { session_name: string, class_id: string, date: string, status: string }) => {
  const { data, error } = await supabase.from('sessions').insert([session]);
  if (error) throw error;
  return data;
};

export const updateSession = async (id: string, session: Partial<{ session_name: string, status: string }>) => {
  const { data, error } = await supabase.from('sessions').update(session).eq('id', id);
  if (error) throw error;
  return data;
};

export const deleteSession = async (id: string) => {
  const { data, error } = await supabase.from('sessions').delete().eq('id', id);
  if (error) throw error;
  return data;
};




// Lessons Table
export const fetchLessons = async () => {
  try {
    const { data, error } = await supabase.from('lessons').select('*');
    if (error) handleError(error);
    return data;
  } catch (error) {
    console.error('Error fetching lessons:', error);
    return [];
  }
};

export const addLesson = async (title: string, description: string, difficulty_level: string, content: string, teacher_id: string) => {
  validateInput({ title, description, difficulty_level, content, teacher_id });
  try {
    const { data, error } = await supabase.from('lessons').insert([{ title, description, difficulty_level, content, teacher_id }]);
    if (error) handleError(error);
    return data;
  } catch (error) {
    console.error('Error adding lesson:', error);
    return null;
  }
};

export const updateLesson = async (id: number, title: string, description: string, difficulty_level: string, content: string) => {
  validateInput({ id, title, description, difficulty_level, content });
  try {
    const { data, error } = await supabase.from('lessons').update({ title, description, difficulty_level, content }).eq('id', id);
    if (error) handleError(error);
    return data;
  } catch (error) {
    console.error('Error updating lesson:', error);
    return null;
  }
};

export const deleteLesson = async (id: number) => {
  validateInput({ id });
  try {
    const { data, error } = await supabase.from('lessons').delete().eq('id', id);
    if (error) handleError(error);
    return data;
  } catch (error) {
    console.error('Error deleting lesson:', error);
    return null;
  }
};

//courses students
export const fetchCoursesByClassCode = async (classCode: string) => {
  try {
    if (!classCode) {
      console.error('Class code is required');
      return [];
    }

    const { data: classData, error: classError } = await supabase
      .from('classes')
      .select('id')
      .eq('code', classCode)
      .maybeSingle(); // Use maybeSingle to handle zero or one result

    if (classError) {
      console.error('Error fetching class ID:', classError);
      return [];
    }

    if (!classData) {
      console.error('No class found with the provided code.');
      return [];
    }

    const classId = classData.id;

    const { data: courses, error: coursesError } = await supabase
      .from('courses')
      .select('*')
      .eq('class_id', classId);

    if (coursesError) {
      console.error('Error fetching courses:', coursesError);
      return [];
    }

    return courses || [];
  } catch (error) {
    console.error('Error fetching courses by class code:', error);
    return [];
  }
};


// Course Lessons Table
export const fetchCourseLessons = async () => {
  try {
    const { data, error } = await supabase.from('course_lessons').select('*');
    if (error) handleError(error);
    return data;
  } catch (error) {
    console.error('Error fetching course lessons:', error);
    return [];
  }
};

export const addCourseLesson = async (course_id: number, lesson_id: number, level: number) => {
  validateInput({ course_id, lesson_id, level });
  try {
    const { data, error } = await supabase.from('course_lessons').insert([{ course_id, lesson_id, level }]);
    if (error) handleError(error);
    return data;
  } catch (error) {
    console.error('Error adding course lesson:', error);
    return null;
  }
};

export const updateCourseLesson = async (id: number, level: number) => {
  validateInput({ id, level });
  try {
    const { data, error } = await supabase.from('course_lessons').update({ level }).eq('id', id);
    if (error) handleError(error);
    return data;
  } catch (error) {
    console.error('Error updating course lesson:', error);
    return null;
  }
};

export const deleteCourseLesson = async (id: number) => {
  validateInput({ id });
  try {
    const { data, error } = await supabase.from('course_lessons').delete().eq('id', id);
    if (error) handleError(error);
    return data;
  } catch (error) {
    console.error('Error deleting course lesson:', error);
    return null;
  }
};

// مثال لجلب بيانات من جدول مع عرض تفاصيل في حال حدوث خطأ
export const fetchDetailedCourseLessons = async () => {
  try {
    const { data, error } = await supabase
      .from('course_lessons')
      .select(`
        id,
        course_id,
        lesson_id,
        level,
        courses (title, description),
        lessons (title, description)
      `);
    if (error) handleError(error);
    return data;
  } catch (error) {
    console.error('Error fetching detailed course lessons:', error);
    return [];
  }
};


// Lessons Progress Table
export const fetchLessonProgress = async () => {
  try {
    const { data, error } = await supabase.from('lesson_progress').select('*');
    if (error) handleError(error);
    return data;
  } catch (error) {
    console.error('Error fetching lesson progress:', error);
    return [];
  }
};

export const addLessonProgress = async (user_id: string, lesson_id: number, progress_percentage: number, completed: boolean) => {
  validateInput({ user_id, lesson_id, progress_percentage, completed });
  try {
    const { data, error } = await supabase.from('lesson_progress').insert([{ user_id, lesson_id, progress_percentage, completed }]);
    if (error) handleError(error);
    return data;
  } catch (error) {
    console.error('Error adding lesson progress:', error);
    return null;
  }
};

export const updateLessonProgress = async (id: number, progress_percentage: number, completed: boolean) => {
  validateInput({ id, progress_percentage, completed });
  try {
    const { data, error } = await supabase.from('lesson_progress').update({ progress_percentage, completed }).eq('id', id);
    if (error) handleError(error);
    return data;
  } catch (error) {
    console.error('Error updating lesson progress:', error);
    return null;
  }
};

export const deleteLessonProgress = async (id: number) => {
  validateInput({ id });
  try {
    const { data, error } = await supabase.from('lesson_progress').delete().eq('id', id);
    if (error) handleError(error);
    return data;
  } catch (error) {
    console.error('Error deleting lesson progress:', error);
    return null;
  }
};

// Courses Progress Table
export const fetchCourseProgress = async (): Promise<CourseProgress[]> => {
  try {
    const { data, error } = await supabase
      .from('course_progress')
      .select('*');
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching course progress:', error);
    return [];
  }
};


export const addCourseProgress = async (user_id: string, course_id: number, current_level: number, progress_percentage: number, completed: boolean) => {
  validateInput({ user_id, course_id, current_level, progress_percentage, completed });
  try {
    const { data, error } = await supabase.from('course_progress').insert([{ user_id, course_id, current_level, progress_percentage, completed }]);
    if (error) handleError(error);
    return data;
  } catch (error) {
    console.error('Error adding course progress:', error);
    return null;
  }
};

export const updateCourseProgress = async (id: number, current_level: number, progress_percentage: number, completed: boolean) => {
  validateInput({ id, current_level, progress_percentage, completed });
  try {
    const { data, error } = await supabase.from('course_progress').update({ current_level, progress_percentage, completed }).eq('id', id);
    if (error) handleError(error);
    return data;
  } catch (error) {
    console.error('Error updating course progress:', error);
    return null;
  }
};

export const deleteCourseProgress = async (id: number) => {
  validateInput({ id });
  try {
    const { data, error } = await supabase.from('course_progress').delete().eq('id', id);
    if (error) handleError(error);
    return data;
  } catch (error) {
    console.error('Error deleting course progress:', error);
    return null;
  }
};

// Games Table
export const fetchGames = async () => {
  try {
    const { data, error } = await supabase.from('games').select('*');
    if (error) handleError(error);
    return data;
  } catch (error) {
    console.error('Error fetching games:', error);
    return [];
  }
};

export const addGame = async (title: string, description: string, game_type: string, difficulty_level: string) => {
  validateInput({ title, description, game_type, difficulty_level });
  try {
    const { data, error } = await supabase.from('games').insert([{ title, description, game_type, difficulty_level }]);
    if (error) handleError(error);
    return data;
  } catch (error) {
    console.error('Error adding game:', error);
    return null;
  }
};

export const updateGame = async (id: number, title: string, description: string, game_type: string, difficulty_level: string) => {
  validateInput({ id, title, description, game_type, difficulty_level });
  try {
    const { data, error } = await supabase.from('games').update({ title, description, game_type, difficulty_level }).eq('id', id);
    if (error) handleError(error);
    return data;
  } catch (error) {
    console.error('Error updating game:', error);
    return null;
  }
};

export const deleteGame = async (id: number) => {
  validateInput({ id });
  try {
    const { data, error } = await supabase.from('games').delete().eq('id', id);
    if (error) handleError(error);
    return data;
  } catch (error) {
    console.error('Error deleting game:', error);
    return null;
  }
};

// Multiplayer Games Table
export const fetchMultiplayerGames = async () => {
  try {
    const { data, error } = await supabase.from('multiplayer_games').select('*');
    if (error) handleError(error);
    return data;
  } catch (error) {
    console.error('Error fetching multiplayer games:', error);
    return [];
  }
};

export const addMultiplayerGame = async (game_id: number, host_user_id: string, status: string) => {
  validateInput({ game_id, host_user_id, status });
  try {
    const { data, error } = await supabase.from('multiplayer_games').insert([{ game_id, host_user_id, status }]);
    if (error) handleError(error);
    return data;
  } catch (error) {
    console.error('Error adding multiplayer game:', error);
    return null;
  }
};

export const updateMultiplayerGame = async (id: number, status: string) => {
  validateInput({ id, status });
  try {
    const { data, error } = await supabase.from('multiplayer_games').update({ status }).eq('id', id);
    if (error) handleError(error);
    return data;
  } catch (error) {
    console.error('Error updating multiplayer game:', error);
    return null;
  }
};

export const deleteMultiplayerGame = async (id: number) => {
  validateInput({ id });
  try {
    const { data, error } = await supabase.from('multiplayer_games').delete().eq('id', id);
    if (error) handleError(error);
    return data;
  } catch (error) {
    console.error('Error deleting multiplayer game:', error);
    return null;
  }
};

// Game Leaderboard Table
export const fetchGameLeaderboard = async () => {
  try {
    const { data, error } = await supabase.from('game_leaderboard').select('*');
    if (error) handleError(error);
    return data;
  } catch (error) {
    console.error('Error fetching game leaderboard:', error);
    return [];
  }
};

export const addGameLeaderboardEntry = async (game_id: number, user_id: string, score: number, rank: number) => {
  validateInput({ game_id, user_id, score, rank });
  try {
    const { data, error } = await supabase.from('game_leaderboard').insert([{ game_id, user_id, score, rank }]);
    if (error) handleError(error);
    return data;
  } catch (error) {
    console.error('Error adding game leaderboard entry:', error);
    return null;
  }
};

export const updateGameLeaderboardEntry = async (id: number, score: number, rank: number) => {
  validateInput({ id, score, rank });
  try {
    const { data, error } = await supabase.from('game_leaderboard').update({ score, rank }).eq('id', id);
    if (error) handleError(error);
    return data;
  } catch (error) {
    console.error('Error updating game leaderboard entry:', error);
    return null;
  }
};

export const deleteGameLeaderboardEntry = async (id: number) => {
  validateInput({ id });
  try {
    const { data, error } = await supabase.from('game_leaderboard').delete().eq('id', id);
    if (error) handleError(error);
    return data;
  } catch (error) {
    console.error('Error deleting game leaderboard entry:', error);
    return null;
  }
};

export const fetchClasses = async () => {
  const { data, error } = await supabase.rpc('fetch_class_details');

  if (error) {
    throw error;
  }

  return data;
};

export const getClassDataWithAggregates = async (classId: any) => {
  try {
    // جلب بيانات الصف الأساسي
    const { data: classData, error: classError } = await supabase
      .from('classes')
      .select('id, class_name, code')
      .eq('id', classId)
      .single();

    if (classError) throw classError;

    // تنفيذ استعلامات أخرى بالتوازي
    const [studentCount, lessonCount, completionData] = await Promise.all([
      supabase
        .from('class_students')
        .select('id', { count: 'exact' })
        .eq('class_id', classId),
      supabase
        .from('class_lessons')
        .select('id', { count: 'exact' })
        .eq('class_id', classId),
      supabase
        .from('lesson_progress')
        .select('completion_percentage')
        .eq('class_id', classId),
    ]);

    if (studentCount.error || lessonCount.error || completionData.error) {
      throw new Error('Error fetching aggregated data');
    }

    // حساب متوسط نسبة التقدم
    const totalCompletion = completionData.data.reduce((sum, progress) => sum + progress.completion_percentage, 0);
    const completionPercentage = completionData.data.length > 0 ? totalCompletion / completionData.data.length : 0;

    // دمج البيانات
    return {
      ...classData,
      student_count: studentCount.count || 0,
      lesson_count: lessonCount.count || 0,
      completion_percentage: completionPercentage,
    };
  } catch (error) {
    console.error('Failed to fetch class data with aggregates:', error);
    return null;
  }
};



export const addClass = async (class_name: string, teacher_id: string, schedule: string, start_date: string, end_date: string, status: string, description: string) => {
  validateInput({ class_name, teacher_id, schedule, start_date, end_date, status, description });
  try {
    const { data, error } = await supabase.from('classes').insert([{ class_name, teacher_id, schedule, start_date, end_date, status, description }]);
    if (error) handleError(error);
    return data;
  } catch (error) {
    console.error('Error adding class:', error);
    return null;
  }
};

export const updateClass = async (id: number, class_name: string, schedule: string, status: string, description: string) => {
  validateInput({ id, class_name, schedule, status, description });
  try {
    const { data, error } = await supabase.from('classes').update({ class_name, schedule, status, description }).eq('id', id);
    if (error) handleError(error);
    return data;
  } catch (error) {
    console.error('Error updating class:', error);
    return null;
  }
};

export const deleteClass = async (id: number) => {
  validateInput({ id });
  try {
    const { data, error } = await supabase.from('classes').delete().eq('id', id);
    if (error) handleError(error);
    return data;
  } catch (error) {
    console.error('Error deleting class:', error);
    return null;
  }
};

// Class Students Table
export const fetchClassStudents = async () => {
  try {
    const { data, error } = await supabase.from('class_students').select('*');
    if (error) handleError(error);
    return data;
  } catch (error) {
    console.error('Error fetching class students:', error);
    return [];
  }
};

export const addClassStudent = async (class_id: number, student_id: string, enrollment_date: string) => {
  validateInput({ class_id, student_id, enrollment_date });
  try {
    const { data, error } = await supabase.from('class_students').insert([{ class_id, student_id, enrollment_date }]);
    if (error) handleError(error);
    return data;
  } catch (error) {
    console.error('Error adding class student:', error);
    return null;
  }
};

export const deleteClassStudent = async (id: number) => {
  validateInput({ id });
  try {
    const { data, error } = await supabase.from('class_students').delete().eq('id', id);
    if (error) handleError(error);
    return data;
  } catch (error) {
    console.error('Error deleting class student:', error);
    return null;
  }
};

// Class Lessons Table
export const fetchClassLessons = async () => {
  try {
    const { data, error } = await supabase.from('class_lessons').select('*');
    if (error) handleError(error);
    return data;
  } catch (error) {
    console.error('Error fetching class lessons:', error);
    return [];
  }
};

export const addClassLesson = async (class_id: number, lesson_id: number, scheduled_date: string) => {
  validateInput({ class_id, lesson_id, scheduled_date });
  try {
    const { data, error } = await supabase.from('class_lessons').insert([{ class_id, lesson_id, scheduled_date }]);
    if (error) handleError(error);
    return data;
  } catch (error) {
    console.error('Error adding class lesson:', error);
    return null;
  }
};

export const deleteClassLesson = async (id: number) => {
  validateInput({ id });
  try {
    const { data, error } = await supabase.from('class_lessons').delete().eq('id', id);
    if (error) handleError(error);
    return data;
  } catch (error) {
    console.error('Error deleting class lesson:', error);
    return null;
  }
};

// Class Attendance Table
export const fetchClassAttendance = async () => {
  try {
    const { data, error } = await supabase.from('class_attendance').select('*');
    if (error) handleError(error);
    return data;
  } catch (error) {
    console.error('Error fetching class attendance:', error);
    return [];
  }
};

export const addClassAttendance = async (class_id: number, student_id: string, attendance_date: string, status: string) => {
  validateInput({ class_id, student_id, attendance_date, status });
  try {
    const { data, error } = await supabase.from('class_attendance').insert([{ class_id, student_id, attendance_date, status }]);
    if (error) handleError(error);
    return data;
  } catch (error) {
    console.error('Error adding class attendance:', error);
    return null;
  }
};

export const updateClassAttendance = async (id: number, status: string) => {
  validateInput({ id, status });
  try {
    const { data, error } = await supabase.from('class_attendance').update({ status }).eq('id', id);
    if (error) handleError(error);
    return data;
  } catch (error) {
    console.error('Error updating class attendance:', error);
    return null;
  }
};

export const deleteClassAttendance = async (id: number) => {
  validateInput({ id });
  try {
    const { data, error } = await supabase.from('class_attendance').delete().eq('id', id);
    if (error) handleError(error);
    return data;
  } catch (error) {
    console.error('Error deleting class attendance:', error);
    return null;
  }
};

// Live Sessions Table
export const fetchLiveSessions = async (): Promise<LiveSessionType[]> => {
  try {
    const { data, error } = await supabase
      .from('live_sessions')
      .select('*')
      .gt('scheduled_at', new Date().toISOString()) // Fetch only future sessions

    if (error) {
      console.error('Error fetching live sessions:', error);
      return [];
    }

    return (data as LiveSessionType[]) || [];
  } catch (error) {
    console.error('Error fetching live sessions:', error);
    return [];
  }
};

export const addLiveSession = async (session: {
  title: string;
  description: string;
  teacher_id: string;
  scheduled_at: string;
  status: string;
}) => {
  try {
    const response = await fetch('https://yourapi.com/api/sessions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(session),
    });

    if (!response.ok) {
      throw new Error('Failed to add session');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error adding session:', error);
    throw error;
  }
};


// export const addLiveSession = async (title: string, description: string, teacher_id: string, scheduled_at: string, status: string) => {
//   validateInput({ title, description, teacher_id, scheduled_at, status });
//   try {
//     const { data, error } = await supabase.from('live_sessions').insert([{ title, description, teacher_id, scheduled_at, status }]);
//     if (error) handleError(error);
//     return data;
//   } catch (error) {
//     console.error('Error adding live session:', error);
//     return null;
//   }
// };

export const updateLiveSession = async (id: number, title: string, description: string, status: string) => {
  validateInput({ id, title, description, status });
  try {
    const { data, error } = await supabase.from('live_sessions').update({ title, description, status }).eq('id', id);
    if (error) handleError(error);
    return data;
  } catch (error) {
    console.error('Error updating live session:', error);
    return null;
  }
};

export const deleteLiveSession = async (id: number) => {
  validateInput({ id });
  try {
    const { data, error } = await supabase.from('live_sessions').delete().eq('id', id);
    if (error) handleError(error);
    return data;
  } catch (error) {
    console.error('Error deleting live session:', error);
    return null;
  }
};

// Live Session Participants Table
export const fetchLiveSessionParticipants = async () => {
  try {
    const { data, error } = await supabase.from('live_session_participants').select('*');
    if (error) handleError(error);
    return data;
  } catch (error) {
    console.error('Error fetching live session participants:', error);
    return [];
  }
};

export const addLiveSessionParticipant = async (session_id: number, user_id: string) => {
  validateInput({ session_id, user_id });
  try {
    const { data, error } = await supabase.from('live_session_participants').insert([{ session_id, user_id }]);
    if (error) handleError(error);
    return data;
  } catch (error) {
    console.error('Error adding live session participant:', error);
    return null;
  }
};

export const deleteLiveSessionParticipant = async (id: number) => {
  validateInput({ id });
  try {
    const { data, error } = await supabase.from('live_session_participants').delete().eq('id', id);
    if (error) handleError(error);
    return data;
  } catch (error) {
    console.error('Error deleting live session participant:', error);
    return null;
  }
};

// Achievements Table
export const fetchAchievements = async () => {
  try {
    const { data, error } = await supabase.from('achievements').select('*');
    if (error) handleError(error);
    return data;
  } catch (error) {
    console.error('Error fetching achievements:', error);
    return [];
  }
};

export const addAchievement = async (user_id: string, title: string, description: string) => {
  validateInput({ user_id, title, description });
  try {
    const { data, error } = await supabase.from('achievements').insert([{ user_id, title, description }]);
    if (error) handleError(error);
    return data;
  } catch (error) {
    console.error('Error adding achievement:', error);
    return null;
  }
};

export const deleteAchievement = async (id: number) => {
  validateInput({ id });
  try {
    const { data, error } = await supabase.from('achievements').delete().eq('id', id);
    if (error) handleError(error);
    return data;
  } catch (error) {
    console.error('Error deleting achievement:', error);
    return null;
  }
};

// Notifications Table
export const fetchNotifications = async () => {
  try {
    const { data, error } = await supabase.from('notifications').select('*');
    if (error) handleError(error);
    return data;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return [];
  }
};

export const addNotification = async (user_id: string, message: string, read: boolean) => {
  validateInput({ user_id, message, read });
  try {
    const { data, error } = await supabase.from('notifications').insert([{ user_id, message, read }]);
    if (error) handleError(error);
    return data;
  } catch (error) {
    console.error('Error adding notification:', error);
    return null;
  }
};

export const updateNotification = async (id: number, read: boolean) => {
  validateInput({ id, read });
  try {
    const { data, error } = await supabase.from('notifications').update({ read }).eq('id', id);
    if (error) handleError(error);
    return data;
  } catch (error) {
    console.error('Error updating notification:', error);
    return null;
  }
};

export const deleteNotification = async (id: number) => {
  validateInput({ id });
  try {
    const { data, error } = await supabase.from('notifications').delete().eq('id', id);
    if (error) handleError(error);
    return data;
  } catch (error) {
    console.error('Error deleting notification:', error);
    return null;
  }
};

// Parental Controls Table
export const fetchParentalControls = async () => {
  try {
    const { data, error } = await supabase.from('parental_controls').select('*');
    if (error) handleError(error);
    return data;
  } catch (error) {
    console.error('Error fetching parental controls:', error);
    return [];
  }
};

export const addParentalControl = async (parent_id: string, student_id: string, screen_time_limit: number, restrict_multiplayer: boolean, restrict_live_sessions: boolean) => {
  validateInput({ parent_id, student_id, screen_time_limit, restrict_multiplayer, restrict_live_sessions });
  try {
    const { data, error } = await supabase.from('parental_controls').insert([{ parent_id, student_id, screen_time_limit, restrict_multiplayer, restrict_live_sessions }]);
    if (error) handleError(error);
    return data;
  } catch (error) {
    console.error('Error adding parental control:', error);
    return null;
  }
};

export const updateParentalControl = async (id: number, screen_time_limit: number, restrict_multiplayer: boolean, restrict_live_sessions: boolean) => {
  validateInput({ id, screen_time_limit, restrict_multiplayer, restrict_live_sessions });
  try {
    const { data, error } = await supabase.from('parental_controls').update({ screen_time_limit, restrict_multiplayer, restrict_live_sessions }).eq('id', id);
    if (error) handleError(error);
    return data;
  } catch (error) {
    console.error('Error updating parental control:', error);
    return null;
  }
};

export const deleteParentalControl = async (id: number) => {
  validateInput({ id });
  try {
    const { data, error } = await supabase.from('parental_controls').delete().eq('id', id);
    if (error) handleError(error);
    return data;
  } catch (error) {
    console.error('Error deleting parental control:', error);
    return null;
  }
};

// Subscriptions Table
export const fetchSubscriptions = async () => {
  try {
    const { data, error } = await supabase.from('subscriptions').select('*');
    if (error) handleError(error);
    return data;
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    return [];
  }
};

export const addSubscription = async (user_id: string, plan_type: string, start_date: string, end_date: string, status: string) => {
  validateInput({ user_id, plan_type, start_date, end_date, status });
  try {
    const { data, error } = await supabase.from('subscriptions').insert([{ user_id, plan_type, start_date, end_date, status }]);
    if (error) handleError(error);
    return data;
  } catch (error) {
    console.error('Error adding subscription:', error);
    return null;
  }
};

export const updateSubscription = async (id: number, plan_type: string, status: string) => {
  validateInput({ id, plan_type, status });
  try {
    const { data, error } = await supabase.from('subscriptions').update({ plan_type, status }).eq('id', id);
    if (error) handleError(error);
    return data;
  } catch (error) {
    console.error('Error updating subscription:', error);
    return null;
  }
};

export const deleteSubscription = async (id: number) => {
  validateInput({ id });
  try {
    const { data, error } = await supabase.from('subscriptions').delete().eq('id', id);
    if (error) handleError(error);
    return data;
  } catch (error) {
    console.error('Error deleting subscription:', error);
    return null;
  }
};

// Feedback Table
export const fetchFeedback = async () => {
  try {
    const { data, error } = await supabase.from('feedback').select('*');
    if (error) handleError(error);
    return data;
  } catch (error) {
    console.error('Error fetching feedback:', error);
    return [];
  }
};

export const addFeedback = async (user_id: string, type: string, content_id: number, rating: number, comments: string) => {
  validateInput({ user_id, type, content_id, rating, comments });
  try {
    const { data, error } = await supabase.from('feedback').insert([{ user_id, type, content_id, rating, comments }]);
    if (error) handleError(error);
    return data;
  } catch (error) {
    console.error('Error adding feedback:', error);
    return null;
  }
};

export const deleteFeedback = async (id: number) => {
  validateInput({ id });
  try {
    const { data, error } = await supabase.from('feedback').delete().eq('id', id);
    if (error) handleError(error);
    return data;
  } catch (error) {
    console.error('Error deleting feedback:', error);
    return null;
  }
};

// Offline Content Table
export const fetchOfflineContent = async () => {
  try {
    const { data, error } = await supabase.from('offline_content').select('*');
    if (error) handleError(error);
    return data;
  } catch (error) {
    console.error('Error fetching offline content:', error);
    return [];
  }
};

export const addOfflineContent = async (user_id: string, content_type: string, content_id: number, synced: boolean) => {
  validateInput({ user_id, content_type, content_id, synced });
  try {
    const { data, error } = await supabase.from('offline_content').insert([{ user_id, content_type, content_id, synced }]);
    if (error) handleError(error);
    return data;
  } catch (error) {
    console.error('Error adding offline content:', error);
    return null;
  }
};

export const updateOfflineContent = async (id: number, synced: boolean) => {
  validateInput({ id, synced });
  try {
    const { data, error } = await supabase.from('offline_content').update({ synced }).eq('id', id);
    if (error) handleError(error);
    return data;
  } catch (error) {
    console.error('Error updating offline content:', error);
    return null;
  }
};

export const deleteOfflineContent = async (id: number) => {
  validateInput({ id });
  try {
    const { data, error } = await supabase.from('offline_content').delete().eq('id', id);
    if (error) handleError(error);
    return data;
  } catch (error) {
    console.error('Error deleting offline content:', error);
    return null;
  }
};

// Image Recognition Games Table
export const fetchImageRecognitionGames = async () => {
  try {
    const { data, error } = await supabase.from('image_recognition_games').select('*');

    if (error) {
      console.error('Error fetching image recognition games from Supabase:', error);
      handleError(error); 
      return []; 
    }

    if (!data || data.length === 0) {
      console.warn('No image recognition games found.');
      return []; 
    }

    return data; 
  } catch (error) {
    console.error('Unexpected error occurred while fetching image recognition games:', error);
    return []; 
  }
};


export const addImageRecognitionGame = async (game_id: number, image_url: string, correct_answer: string, options: string[]) => {
  validateInput({ game_id, image_url, correct_answer, options });
  try {
    const { data, error } = await supabase.from('image_recognition_games').insert([{ game_id, image_url, correct_answer, options }]);
    if (error) handleError(error);
    return data;
  } catch (error) {
    console.error('Error adding image recognition game:', error);
    return null;
  }
};



export const updateImageRecognitionGame = async (id: number, image_url: string, correct_answer: string) => {
  validateInput({ id, image_url, correct_answer });
  try {
    const { data, error } = await supabase.from('image_recognition_games').update({ image_url, correct_answer }).eq('id', id);
    if (error) handleError(error);
    return data;
  } catch (error) {
    console.error('Error updating image recognition game:', error);
    return null;
  }
};

export const deleteImageRecognitionGame = async (id: number) => {
  validateInput({ id });
  try {
    const { data, error } = await supabase.from('image_recognition_games').delete().eq('id', id);
    if (error) handleError(error);
    return data;
  } catch (error) {
    console.error('Error deleting image recognition game:', error);
    return null;
  }
};

// Image Recognition Progress Table
export const fetchImageRecognitionProgress = async () => {
  try {
    const { data, error } = await supabase.from('image_recognition_progress').select('*');
    if (error) handleError(error);
    return data;
  } catch (error) {
    console.error('Error fetching image recognition progress:', error);
    return [];
  }
};

export const addImageRecognitionProgress = async (user_id: string, game_id: number, score: number, attempts: number, correct_attempts: number) => {
  validateInput({ user_id, game_id, score, attempts, correct_attempts });
  try {
    const { data, error } = await supabase.from('image_recognition_progress').insert([{ user_id, game_id, score, attempts, correct_attempts }]);
    if (error) handleError(error);
    return data;
  } catch (error) {
    console.error('Error adding image recognition progress:', error);
    return null;
  }
};


export const updateImageRecognitionProgress = async (id: number, score: number, attempts: number, correct_attempts: number) => {
  validateInput({ id, score, attempts, correct_attempts });
  try {
    const { data, error } = await supabase.from('image_recognition_progress').update({ score, attempts, correct_attempts }).eq('id', id);
    if (error) handleError(error);
    return data;
  } catch (error) {
    console.error('Error updating image recognition progress:', error);
    return null;
  }
};

export const deleteImageRecognitionProgress = async (id: number) => {
  validateInput({ id });
  try {
    const { data, error } = await supabase.from('image_recognition_progress').delete().eq('id', id);
    if (error) handleError(error);
    return data;
  } catch (error) {
    console.error('Error deleting image recognition progress:', error);
    return null;
  }
};

export async function fetchMessages(conversationId: string | number) {
  try {
    if (!conversationId) throw new Error("Conversation ID is required");

    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId);  // استخدم conversation_id كشرط

    if (error) {
      console.error("Error fetching messages:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Failed to fetch messages:", error);
    throw error;  // إعادة رمي الخطأ ليتم معالجته في مكان آخر
  }
}
export const fetchConversations = async (studentId: string) => {
  const { data, error } = await supabase
    .from('conversations')
    .select('*');
   // .eq('student_id', studentId);  

  if (error) throw error;
  return data;
};

// جلب رسائل المحادثة الفردية
export const fetchConversationMessages = async (conversationId: string | number) => {
  try {
    if (!conversationId) throw new Error("Conversation ID is required");

    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error("Error fetching conversation messages:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Failed to fetch conversation messages:", error);
    throw error;  
  }
};

// إرسال رسالة
// export async function sendMessage(conversationId: string | number, messageText: string, isTeacher: boolean = true) {
//   try {
//     if (!conversationId || !messageText) throw new Error("Both Conversation ID and Message Text are required");

//     const { data, error } = await supabase
//       .from('messages')
//       .insert([{ conversation_id: conversationId, text: messageText, is_teacher: isTeacher }]);

//     if (error) {
//       console.error("Error sending message:", error);
//       throw error;
//     }

//     return data;
//   } catch (error) {
//     console.error("Failed to send message:", error);
//     throw error;  // إعادة رمي الخطأ ليتم معالجته في مكان آخر
//   }
// }


async function checkConversationExists(conversationId: number): Promise<boolean> {
  const { data, error } = await supabase
    .from('conversations')
    .select('id')
    .eq('id', conversationId)
    .single();

  if (error) {
    console.error('Error checking conversation existence:', error);
    return false;
  }

  return !!data;
}

// Updated sendMessage function
export async function sendMessage(conversationId: any, messageText: string, isTeacher: boolean) {
  try {
    // Check if the conversation exists
    const conversationExists = await checkConversationExists(conversationId);

    if (!conversationExists) {
      throw new Error(`Conversation with ID ${conversationId} does not exist.`);
    }

    // Proceed to send the message if the conversation exists
    const { data, error } = await supabase
      .from('messages')
      .insert([
        { 
          conversation_id: conversationId, 
          text: messageText, 
          is_teacher: isTeacher 
        }
      ]);

    if (error) {
      console.error('Failed to send message:', error.message);
      throw new Error('Failed to send message');
    }

    console.log('Message sent successfully:', data);
    return data;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
}



export const fetchProgress = async () => {
  try {
    // الحصول على الجلسة الحالية
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) throw sessionError;

    const user = sessionData?.session?.user;
    if (!user) throw new Error('User not found');

    const { data, error } = await supabase
      .from('progress')
      .select('current, learning')
      .eq('user_id', user.id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching progress:', error);
    return { current: 0, learning: 0 };
  }
};

// جلب جميع التحديات
export const fetchChallenges = async (classId: any): Promise<Challenge[]> => {
  try {
    const { data, error } = await supabase
      .from('challenges')
      .select('*');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching challenges:', error);
    return [];
  }
};

export const fetchChallengess = async (): Promise<Challenge[]> => {
  try {
    const { data, error } = await supabase
      .from('challenges')
      .select('*');

    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error fetching challenges:', error);
    return [];
  }
};


// جلب تحدي بناءً على معرفه
export const fetchChallengeById = async (challengeId: number): Promise<Challenge | null> => {
  try {
    const { data, error } = await supabase
      .from('challenges')
      .select('*')
      .eq('id', challengeId)
      .single();

    if (error) throw error;
    return data || null;
  } catch (error) {
    console.error('Error fetching challenge by ID:', error);
    return null;
  }
};

export const createChallenge = async (challengeData: ChallengeInput) => {
  try {
    const { data, error } = await supabase
      .from('challenges')
      .insert([challengeData]); // Insert expects an array of objects

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error('Error creating challenge:', error);
    throw error;
  }
};

// تحديث تحدي موجود
export const updateChallenge = async (challengeId: number, updatedChallenge: Partial<Challenge>): Promise<void> => {
  try {
    const { error } = await supabase
      .from('challenges')
      .update(updatedChallenge)
      .eq('id', challengeId);

    if (error) throw error;
  } catch (error) {
    console.error('Error updating challenge:', error);
    throw error;
  }
};

// حذف تحدي
export const deleteChallenge = async (challengeId: number): Promise<void> => {
  try {
    const { error } = await supabase
      .from('challenges')
      .delete()
      .eq('id', challengeId);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting challenge:', error);
    throw error;
  }
};

// جلب جميع المهام
export const fetchAssignments = async (classId: number): Promise<Assignment[]> => {
  try {
    const { data, error } = await supabase
      .from('assignments')
      .select('*')
      .eq('class_id', classId);

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  } catch (error) {
    console.error("Error fetching assignments:", error);
    return [];
  }
};

// جلب مهمة بناءً على معرفها
export const fetchAssignmentById = async (assignmentId: number): Promise<Assignment | null> => {
  try {
    const { data, error } = await supabase
      .from('assignments')
      .select('*')
      .eq('id', assignmentId)
      .single();

    if (error) throw error;
    return data || null;
  } catch (error) {
    console.error('Error fetching assignment by ID:', error);
    return null;
  }
};

// إنشاء مهمة جديدة
export const createAssignment = async (assignmentData: AssignmentInput) => {
  try {
    const { data, error } = await supabase
      .from('assignments')  // جدول المهام في قاعدة البيانات
      .insert([assignmentData]); // يقوم بإدراج المهمة الجديدة ككائن

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error('Error creating assignment:', error);
    throw error;
  }
};
// تحديث مهمة موجودة
export const updateAssignment = async (assignmentId: number, updatedAssignment: Partial<Assignment>): Promise<void> => {
  try {
    const { error } = await supabase
      .from('assignments')
      .update(updatedAssignment)
      .eq('id', assignmentId);

    if (error) throw error;
  } catch (error) {
    console.error('Error updating assignment:', error);
    throw error;
  }
};

// حذف مهمة
export const deleteAssignment = async (assignmentId: number): Promise<void> => {
  try {
    const { error } = await supabase
      .from('assignments')
      .delete()
      .eq('id', assignmentId);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting assignment:', error);
    throw error;
  }
};
export const fetchAssignmentDetails = async (assignmentId: number): Promise<Assignment | null> => {
  try {
    // استعلام Supabase لاسترجاع تفاصيل واجب معين
    const { data, error } = await supabase
      .from('assignments')
      .select('*')
      .eq('id', assignmentId)
      .single(); // استخدم .single() لأننا نتوقع سجلًا واحدًا فقط

    if (error) {
      throw new Error(error.message);
    }

    return data as Assignment; // نعيد البيانات من النوع Assignment
  } catch (error) {
    console.error('Error fetching assignment details:', error);
    return null; // نعيد null في حالة حدوث خطأ
  }
};


export const fetchBadges = async () => {
  try {
    // الحصول على جلسة المستخدم
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) throw sessionError;

    const user = sessionData?.session?.user;
    if (!user) throw new Error('User not found');

    const { data, error } = await supabase
      .from('badges')
      .select('*')
      .eq('user_id', user.id);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching badges:', error);
    return [];
  }
};


// export const fetchCourseProgress = async () => {
//   try {
//     const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
//     if (sessionError) throw sessionError;

//     const user = sessionData?.session?.user;
//     if (!user) throw new Error('User not found');

//     const { data, error } = await supabase
//       .from('course_progress')
//       .select('course_id, progress_percentage')
//       .eq('user_id', user.id);

//     if (error) throw error;
//     return data;
//   } catch (error) {
//     console.error('Error fetching course progress:', error);
//     return [];
//   }
// };




export const fetchLessonsByCourseId = async (courseId: number) => {
  try {
    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .eq('course_id', courseId);

    if (error) {
      handleError(error);
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching lessons:', error);
    return [];
  }
};


export const fetchProgressByCourseId = async (courseId: number) => {
  try {
    const { data, error } = await supabase
      .from('lesson_progress')
      .select('*')
      .eq('course_id', courseId);

    if (error) {
      handleError(error);
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching progress:', error);
    return [];
  }
};


