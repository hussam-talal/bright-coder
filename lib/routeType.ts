// routeType.ts

import { Session } from "@supabase/supabase-js";
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

export type LiveSessionType = {
  id: number;
  title: string;
  description: string;
  teacher_id: string;
  scheduled_at: string;
  status: string;
  image?: string; 
  enrolled?: number; 

};


// routeType.ts
export type AuthStackParamList = {
  navigate(arg0: string, arg1: { conversationId: number; }): unknown;
  AccountTypeSelection: undefined;
  Auth: { role: string };
  SignUp: { role: string };
  AgeSelection: undefined;
  ClassCodeScreen: undefined;
  Account: { session: Session | null };
  TeacherDetails: {userId: string | undefined};
  TeacherDashboard: undefined;
  ParentDetails: undefined;  // يمكن تغييرها لاحقًا
  MainApp: undefined;  // أضف هذا السطر
  Messages: { Message :any};
  Header: {title: string};
  Classes: undefined;
  CreateClass: undefined;
  NextCreateClass: { 
    className: string;
    capacity: string;
    description: string;
    selectedDays: Record<string, boolean>;
  };
  PrograssClass: {
     classId:  any;
    className: string;
    studentCount: number;
    lessonCount: number;
    classCode: string;
    progressPercentage: number;
  };
  Lessons: {
    classId: any; 

  };
  LessonsCourseScreen: {
    classId: any; 

    courseId: any;
  };
  StudentsClass: {
    classId: any;
  };
  CodeCombatCourses: undefined;
  StudentHome: undefined;
  TutorialsScreen: undefined;
  GamesScreen: undefined;
  CoursesScreen: undefined;
  GamesDiffrentScreen: undefined;

  
 // LessonStudentScreen: undefined;
  ProgramStudentScreen: undefined;
  ImageRecognitionGames: undefined;
  Multiplayer: undefined;
  SinglePlayer: undefined;
  CompletedCourses: undefined;
  CompletedGames: undefined;
  ProgressStudent: undefined;
  
 
    LiveSession: LiveSessionType; 
    CreateNewSession: undefined; 
    UpcomingSessions: undefined;

    LessonsStudentScreen: { courseId: number }; 
    LiveTeacherScreen: undefined;
    sessionNavigator: undefined;

    ConversationsScreen: undefined;
    ChatNavigation: undefined;
    ChatScreen: { conversationId: string }; 
    AddStudent: { classId: string }; 
    ChatConversationScreen: { conversationId: string }; 
    Activity: { classId: any }; 
   //Assignments: undefined;
    Challenges: undefined;

    Chat: undefined;
    CustomDrawerContent: undefined;
    ClassCode: { classId: string };


    // الصفحات الجديدة
  CreateChallengeScreen: { classId: any ; teacherId: any}; 
  EditChallengeScreen: { challengeId: number }; 
  //ChallengesScreen: { classId: any }; 
  CreateAssignmentScreen: { classId: number; teacherId: string };
  AssignmentDetailsScreen: { assignmentId: number }; 
  Assignments: { classId: number; teacherId: string }; 
  ChallengesScreen: { classId: any; teacherId: string }; 

  NotificationsScreen: undefined; 
  AddCourse: {classId: any};

  AddImageRecognitionGame: undefined; 
  AdminRecognition: undefined; 
  OfflineGamesScreen: undefined;

  //parent

  //ControlParent:undefined;
  ChildProgressScreen: {childId: any};
  ProgressParentScreen: undefined;
  ActivityParentScreen: undefined;
  ParentHome: undefined;
  DetailsParent: undefined;
  EditChild: {childId: any};
  ControlParentScreen:{ childId: any};
  AddChild: undefined;  
  ChildManagement: undefined;

  DrawerNavigator:undefined;
  SplashScreen: undefined;

  ProfileStudent: undefined;
  ProfileTeacher: undefined;
  ProfileParent: undefined;

};


// أنواع التنقلات لكل شاشة
export type ClassesNavigationProp = StackNavigationProp<AuthStackParamList, 'Classes'>;
export type CreateClassNavigationProp = StackNavigationProp<AuthStackParamList, 'CreateClass'>;
export type NextCreateClassNavigationProp = StackNavigationProp<AuthStackParamList, 'NextCreateClass'>;
export type PrograssClassNavigationProp = StackNavigationProp<AuthStackParamList, 'PrograssClass'>;
export type StudentsClassNavigationProp = StackNavigationProp<AuthStackParamList, 'StudentsClass'>;
export type LiveSessionNavigationProp = StackNavigationProp<AuthStackParamList, 'LiveSession'>;
export type CreateNewSessionNavigationProp = StackNavigationProp<AuthStackParamList, 'CreateNewSession'>;
export type CreateNewSessionRouteProp = RouteProp<AuthStackParamList, 'CreateNewSession'>;
export type CreateChallengeScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'CreateChallengeScreen'>;
export type EditChallengeScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'EditChallengeScreen'>;
export type ChallengesScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'ChallengesScreen'>;
export type CreateAssignmentScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'CreateAssignmentScreen'>;
export type AssignmentDetailsScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'AssignmentDetailsScreen'>;
type AddCourseScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'AddCourse'>;

// أنواع الخصائص (Props) الممررة لكل شاشة
export type ClassesRouteProp = RouteProp<AuthStackParamList, 'Classes'>;
export type CreateClassRouteProp = RouteProp<AuthStackParamList, 'CreateClass'>;
export type NextCreateClassRouteProp = RouteProp<AuthStackParamList, 'NextCreateClass'>;
export type PrograssClassRouteProp = RouteProp<AuthStackParamList, 'PrograssClass'>;
export type StudentsClassRouteProp = RouteProp<AuthStackParamList, 'StudentsClass'>;
export type CreateChallengeScreenRouteProp = RouteProp<AuthStackParamList, 'CreateChallengeScreen'>;
export type EditChallengeScreenRouteProp = RouteProp<AuthStackParamList, 'EditChallengeScreen'>;
export type ChallengesScreenRouteProp = RouteProp<AuthStackParamList, 'ChallengesScreen'>;
export type CreateAssignmentScreenRouteProp = RouteProp<AuthStackParamList, 'CreateAssignmentScreen'>;
export type AssignmentDetailsScreenRouteProp = RouteProp<AuthStackParamList, 'AssignmentDetailsScreen'>;