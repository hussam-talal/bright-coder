import { supabase } from '../../lib/supabase';  

const addDataToDatabase = async () => {
  const { error: messageError } = await supabase.from('messages').insert([
    {
      id: '1', 
      text: 'مرحباً، هذه رسالة اختبار!',
      is_teacher: false,
      created_at: new Date().toISOString(),
      conversation_id: 1, 
    },
  ]);

  if (messageError) {
    console.error('Error inserting message:', messageError);
  } else {
    console.log('Message inserted successfully!');
  }

  const { error: profileError } = await supabase.from('profiles').insert([
    {
      id: 'user-1', 
      full_name: 'Test User', 
      role: 'student', 
    },
  ]);

  if (profileError) {
    console.error('Error inserting profile:', profileError);
  } else {
    console.log('Profile inserted successfully!');
  }
};

addDataToDatabase();
