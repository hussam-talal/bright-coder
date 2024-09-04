import { supabase } from '../../lib/supabase';  // تأكد من أن المسار صحيح

const addDataToDatabase = async () => {
  // إضافة رسالة إلى جدول 'messages'
  const { error: messageError } = await supabase.from('messages').insert([
    {
      id: '1', // ضع معرف مناسب أو اجعل العمود Auto Increment
      text: 'مرحباً، هذه رسالة اختبار!',
      is_teacher: false,
      created_at: new Date().toISOString(),
      conversation_id: 1, // مثال على معرف المحادثة
    },
  ]);

  if (messageError) {
    console.error('Error inserting message:', messageError);
  } else {
    console.log('Message inserted successfully!');
  }

  // إضافة مستخدم إلى جدول 'profiles'
  const { error: profileError } = await supabase.from('profiles').insert([
    {
      id: 'user-1', // معرف المستخدم
      full_name: 'Test User', 
      role: 'student', // مثال على دور المستخدم
    },
  ]);

  if (profileError) {
    console.error('Error inserting profile:', profileError);
  } else {
    console.log('Profile inserted successfully!');
  }
};

// استدعاء الوظيفة لإضافة البيانات
addDataToDatabase();
