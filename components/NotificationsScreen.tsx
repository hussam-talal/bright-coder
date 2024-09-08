import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { fetchNotifications, updateNotification } from '../lib/CRUD'; // تأكد من تعديل المسار حسب مكان وجود دوال CRUD الخاصة بك
import Ionicons from 'react-native-vector-icons/Ionicons';
import Header from './Header';

// تعريف نوع البيانات للإشعار
interface Notification {
  id: number;
  message: string;
  read: boolean;
  created_at: string;
}

const NotificationsScreen: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]); 
  const [loading, setLoading] = useState<boolean>(true); 

  // جلب الإشعارات عند تحميل الصفحة
  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedNotifications = await fetchNotifications() || []; 
        setNotifications(fetchedNotifications);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // دالة لتحديث حالة الإشعار عند قراءته
  const handleMarkAsRead = async (notificationId: number) => {
    try {
      await updateNotification(notificationId, true);
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification.id === notificationId ? { ...notification, read: true } : notification
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const renderNotificationItem = ({ item }: { item: Notification }) => (
    <TouchableOpacity
      style={[styles.notificationItem, item.read ? styles.read : styles.unread]}
      onPress={() => handleMarkAsRead(item.id)}
    >
      <Ionicons name="notifications-outline" size={20} color={item.read ? '#999' : '#007BFF'} />
      <View style={styles.notificationTextContainer}>
        <Text style={styles.notificationTitle}>{item.message}</Text>
        <Text style={styles.notificationDate}>{new Date(item.created_at).toLocaleDateString()}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  return (
    <View style={styles.container1}>
        <Header title="Image Recognition" />
    <View style={styles.container}>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderNotificationItem}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={<Text style={styles.emptyText}>لا توجد إشعارات</Text>}
      />
    </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container1: {
    flex: 1,
    backgroundColor: '#800080',
  },
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingTop: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    paddingHorizontal: 20,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: '#FFF',
    elevation: 2,
  },
  unread: {
    backgroundColor: '#E3F2FD',
  },
  read: {
    backgroundColor: '#F0F0F0',
  },
  notificationTextContainer: {
    marginLeft: 10,
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  notificationDate: {
    fontSize: 12,
    color: '#999',
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
  },
});

export default NotificationsScreen;
