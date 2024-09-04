// import React, { createContext, useState, useEffect, ReactNode } from 'react';
// import { supabase } from '../../lib/supabase';  // تأكد من أن المسار صحيح

// interface User {
//   id: string;
//   name: string;
//   role: string; // إضافة الحقل role
// }

// interface AuthContextProps {
//   user: User | null;
//   isTeacher: boolean;
// }

// // استخدم React.PropsWithChildren لتضمين خاصية children بشكل صحيح
// export const AuthContext = createContext<AuthContextProps | null>(null);

// export const AuthProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [isTeacher, setIsTeacher] = useState<boolean>(false);

//   useEffect(() => {
//     const fetchUser = async () => {
//       const { data: userData, error: userError } = await supabase.auth.getUser();
//       if (userError) {
//         console.error('Error fetching user:', userError);
//       } else if (userData?.user) {
//         // قم بجلب بيانات user من جدول profiles باستخدام userId
//         const { data: profileData, error: profileError } = await supabase
//           .from('profiles')
//           .select('id, full_name, role') // اختر الحقول التي تريدها من الجدول
//           .eq('id', userData.user.id)  // استخدم معرف المستخدم لجلب الصف الصحيح
//           .single();  // نستخدم single() لأننا نتوقع صف واحد فقط

//         if (profileError) {
//           console.error('Error fetching profile:', profileError);
//         } else if (profileData) {
//           setUser({
//             id: profileData.id,
//             name: profileData.full_name,
//             role: profileData.role,
//           });

//           // تحقق مما إذا كان المستخدم مدرس بناءً على الحقل role
//           setIsTeacher(profileData.role === 'Teacher');
//         }
//       }
//     };

//     fetchUser();
//   }, []);

//   return (
//     <AuthContext.Provider value={{ user, isTeacher }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };





// AuthContext.tsx

import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import { supabase } from '../../lib/supabase';  
import { ActivityIndicator, View } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import Auth from '../../components/Auth';

interface User {
  id: string;
  name: string;
  role: string;
}

interface AuthContextProps {
  user: User | null;
  isTeacher: boolean;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextProps | null>(null);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isTeacher, setIsTeacher] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const navigation = useNavigation<NavigationProp<any>>(); // Type navigation correctly

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      const { data: userData, error: userError } = await supabase.auth.getUser(); // Correct function call

      if (userError) {
        console.error('Error fetching user:', userError.message);
        setLoading(false);
        return;
      } 

      if (userData?.user) {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('id, full_name, role')
          .eq('id', userData.user.id)
          .single();

        if (profileError) {
          console.error('Error fetching profile:', profileError.message);
        } else if (profileData) {
          setUser({
            id: profileData.id,
            name: profileData.full_name,
            role: profileData.role,
          });

          setIsTeacher(profileData.role === 'Teacher');
        }
      } else {
        setUser(null);
        setIsTeacher(false);
      }

      setLoading(false);
    };

    fetchUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        setUser(null);
        setIsTeacher(false);
      } else if (event === 'SIGNED_IN' && session) {
        fetchUser();
      }
    });

    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error('Error signing out:', error.message);
    setUser(null);
    setIsTeacher(false);
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!user) {
    return <Auth navigation={navigation} />;
  }

  return (
    <AuthContext.Provider value={{ user, isTeacher, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
