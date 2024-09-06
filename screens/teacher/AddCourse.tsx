import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { TextInput, Button, useTheme, ActivityIndicator } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker'; 
import { supabase } from '../../lib/supabase';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../lib/routeType';

type AddCourseScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'AddCourse'>;

type Props = {
  navigation: AddCourseScreenNavigationProp;
  route: { params: { classId: any } };  // Add classId to route params
};

const AddCourse: React.FC<Props> = ({ navigation, route }) => {
  const { classId } = route.params; // Get classId from route params
  const theme = useTheme();
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [image, setImage] = useState<{ uri: string } | null>(null);
  const [document, setDocument] = useState<DocumentPicker.DocumentResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleImagePicker = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const selectedImage = result.assets?.[0];
      if (selectedImage) {
        setImage({ uri: selectedImage.uri });
      }
    }
  };

  const handleDocumentPicker = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: '*/*',
      });

      if (res.type === 'success') {
        setDocument(res);
      } else {
        console.log('User cancelled document picker');
      }
    } catch (err) {
      console.error('DocumentPicker Error: ', err);
    }
  };

  const handleAddCourse = async () => {
    if (!title) {
      Alert.alert('Error', 'Course title is required.');
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('courses')
        .insert([
          {
            title: title,
            description: description,
            imageurl: image?.uri || '',
            classid: classId,
          },
        ]);

      if (error) {
        throw error;
      }

      if (document) {
        console.log('Document to upload:', document);
        // يمكنك إضافة منطق لرفع المستند هنا
      }

      Alert.alert('Success', 'Course added successfully.');
      navigation.goBack();
    } catch (error) {
      console.error('Failed to add course:', error);
      Alert.alert('Error', 'Failed to add course.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TextInput
        label="Course Title"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
        mode="outlined"
      />
      <TextInput
        label="Description"
        value={description}
        onChangeText={setDescription}
        style={styles.input}
        mode="outlined"
        multiline
        numberOfLines={4}
      />

      <TouchableOpacity style={styles.uploadButton} onPress={handleImagePicker}>
        <Text style={styles.uploadButtonText}>Upload Image</Text>
      </TouchableOpacity>

      {image && (
        <Image
          source={{ uri: image.uri }}
          style={styles.previewImage}
        />
      )}

      <TouchableOpacity style={styles.uploadButton} onPress={handleDocumentPicker}>
        <Text style={styles.uploadButtonText}>Upload Document or Video</Text>
      </TouchableOpacity>

      {document && (
        <Text style={styles.uploadedFileText}>
          {document.name}
        </Text>
      )}

      {loading ? (
        <ActivityIndicator animating={true} color={theme.colors.primary} />
      ) : (
        <Button
          mode="contained"
          onPress={handleAddCourse}
          style={styles.button}
        >
          Add Course
        </Button>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  input: {
    marginBottom: 15,
  },
  uploadButton: {
    backgroundColor: '#6D31ED',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
  },
  uploadButtonText: {
    color: '#FFF',
    fontSize: 16,
  },
  previewImage: {
    width: '100%',
    height: 200,
    marginVertical: 10,
  },
  uploadedFileText: {
    marginVertical: 10,
    fontSize: 16,
    color: '#333',
  },
  button: {
    marginTop: 20,
  },
});

export default AddCourse;
