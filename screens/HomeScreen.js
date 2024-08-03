import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { firestore } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

const HomeScreen = ({ navigation }) => {
  const [books, setBooks] = React.useState([]);

  React.useEffect(() => {
    const fetchBooks = async () => {
      const querySnapshot = await getDocs(collection(firestore, 'books'));
      const fetchedBooks = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBooks(fetchedBooks);
    };

    fetchBooks();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={books}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => navigation.navigate('Book Detail', { bookId: item.id })}
          >
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.author}>{item.author}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

// Styles for the component
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  author: {
    fontSize: 14,
  },
});

export default HomeScreen;
