import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { firestore } from '../firebase';

const BorrowedScreen = ({ navigation }) => {
  const [borrowedBooks, setBorrowedBooks] = useState([]);

  useEffect(() => {
    const fetchBorrowedBooks = async () => {
      try {
        // Get all borrowed book references
        const borrowedSnapshot = await getDocs(collection(firestore, 'borrowed'));
        const borrowedData = await Promise.all(
          borrowedSnapshot.docs.map(async (borrowedDoc) => {
            const bookId = borrowedDoc.data().bookId;

            // Fetch full book details from the books collection
            const bookDoc = await getDoc(doc(firestore, 'books', bookId));
            if (bookDoc.exists()) {
              return {
                id: borrowedDoc.id, // Use the borrowed document ID for list key
                bookId,             // Include the original bookId for navigation
                ...bookDoc.data(),
              };
            }
            return null;
          })
        );

        // Filter out any null results where book data wasn't found
        setBorrowedBooks(borrowedData.filter((book) => book !== null));
      } catch (error) {
        console.error('Error fetching borrowed books:', error);
      }
    };

    fetchBorrowedBooks();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={borrowedBooks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => navigation.navigate('Book Detail', { bookId: item.bookId })}
          >
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.author}>{item.author}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

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

export default BorrowedScreen;
