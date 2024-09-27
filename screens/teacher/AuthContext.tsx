



// // AuthContext.tsx

// import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
// import { supabase } from '../../lib/supabase';  
// import { ActivityIndicator, View } from 'react-native';
// import { useNavigation, NavigationProp } from '@react-navigation/native';
// import Auth from '../../components/Auth';

// interface User {
//   id: string;
//   name: string;
//   role: string;
// }

// interface AuthContextProps {
//   user: User | null;
//   isTeacher: boolean;
//   signOut: () => Promise<void>;
// }

// export const AuthContext = createContext<AuthContextProps | null>(null);

// export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [isTeacher, setIsTeacher] = useState<boolean>(false);
//   const [loading, setLoading] = useState<boolean>(true);

//   const navigation = useNavigation<NavigationProp<any>>(); // Type navigation correctly

//   useEffect(() => {
//     const fetchUser = async () => {
//       setLoading(true);
//       const { data: userData, error: userError } = await supabase.auth.getUser(); // Correct function call

//       if (userError) {
//         console.error('Error fetching user:', userError.message);
//         setLoading(false);
//         return;
//       } 

//       if (userData?.user) {
//         const { data: profileData, error: profileError } = await supabase
//           .from('profiles')
//           .select('id, full_name, role')
//           .eq('id', userData.user.id)
//           .single();

//         if (profileError) {
//           console.error('Error fetching profile:', profileError.message);
//         } else if (profileData) {
//           setUser({
//             id: profileData.id,
//             name: profileData.full_name,
//             role: profileData.role,
//           });

//           setIsTeacher(profileData.role === 'Teacher');
//         }
//       } else {
//         setUser(null);
//         setIsTeacher(false);
//       }

//       setLoading(false);
//     };

//     fetchUser();

//     const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
//       if (event === 'SIGNED_OUT' || !session) {
//         setUser(null);
//         setIsTeacher(false);
//       } else if (event === 'SIGNED_IN' && session) {
//         fetchUser();
//       }
//     });

//     return () => {
//       if (authListener && authListener.subscription) {
//         authListener.subscription.unsubscribe();
//       }
//     };
//   }, []);

//   const signOut = async () => {
//     const { error } = await supabase.auth.signOut();
//     if (error) console.error('Error signing out:', error.message);
//     setUser(null);
//     setIsTeacher(false);
//   };

//   if (loading) {
//     return (
//       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//         <ActivityIndicator size="large" color="#0000ff" />
//       </View>
//     );
//   }

//   if (!user) {
//     return <Auth navigation={navigation} />;
//   }

//   return (
//     <AuthContext.Provider value={{ user, isTeacher, signOut }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };






import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import { getAuth, onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth'; // استخدم Firebase Auth
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
    const auth = getAuth();

    const fetchUserProfile = async (uid: string) => {
      try {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('id, full_name, role')
          .eq('id', uid) // جلب الملف الشخصي باستخدام uid الخاص بـ Firebase
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
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // جلب بيانات المستخدم من Supabase باستخدام uid الخاص بـ Firebase
        fetchUserProfile(firebaseUser.uid);
      } else {
        setUser(null);
        setIsTeacher(false);
      }
      setLoading(false);
    });

    return () => unsubscribe(); // تنظيف المراقب عند إلغاء التثبيت
  }, []);

  const signOut = async () => {
    const auth = getAuth();
    try {
      await firebaseSignOut(auth); // تسجيل الخروج من Firebase
      setUser(null);
      setIsTeacher(false);
    } catch (error: any) {
      console.error('Error signing out:', error.message);
    }
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
