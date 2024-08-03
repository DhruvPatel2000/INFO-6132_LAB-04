import React, { useCallback, useState } from 'react';
import { View, Text, Button, Image, Alert, StyleSheet } from 'react-native';
import { firestore } from '../firebase';
import { doc, getDoc, collection, getDocs, addDoc, deleteDoc } from 'firebase/firestore';
import { useFocusEffect } from '@react-navigation/native';

const BookDetailScreen = ({ route }) => {
  const { bookId } = route.params;
  const [book, setBook] = useState(null);
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [borrowedBookDocId, setBorrowedBookDocId] = useState(null);

  // Fetch book and borrowed book data whenever the screen is focused
  useFocusEffect(
    useCallback(() => {
      const fetchBook = async () => {
        try {
          const bookRef = doc(firestore, 'books', bookId);
          const bookDoc = await getDoc(bookRef);
          if (bookDoc.exists()) {
            setBook(bookDoc.data());
          } else {
            Alert.alert('Error', 'Book not found!');
          }
        } catch (error) {
          console.error('Error fetching book: ', error);
          Alert.alert('Error', 'Failed to fetch book details.');
        }
      };

      const fetchBorrowedBooks = async () => {
        try {
          const borrowedQuerySnapshot = await getDocs(collection(firestore, 'borrowed'));
          const borrowedBooksData = borrowedQuerySnapshot.docs.map(doc => ({
            id: doc.id,
            bookId: doc.data().bookId,
          }));
          setBorrowedBooks(borrowedBooksData.map(item => item.bookId));
          const borrowedRecord = borrowedBooksData.find(item => item.bookId === bookId);
          if (borrowedRecord) {
            setBorrowedBookDocId(borrowedRecord.id);
          }
        } catch (error) {
          console.error('Error fetching borrowed books: ', error);
          Alert.alert('Error', 'Failed to fetch borrowed books.');
        }
      };

      fetchBook();
      fetchBorrowedBooks();
    }, [bookId])
  );

  const borrowBook = async () => {
    if (borrowedBooks.includes(bookId)) {
      Alert.alert('Borrow Limit Reached', 'This book has already been borrowed.');
      return;
    }

    if (borrowedBooks.length >= 3) {
      Alert.alert('Borrow Limit Reached', 'You cannot borrow more than 3 books at a time.');
      return;
    }

    try {
      const docRef = await addDoc(collection(firestore, 'borrowed'), { bookId });
      Alert.alert('Success', 'Book borrowed successfully!');
      setBorrowedBooks([...borrowedBooks, bookId]);
      setBorrowedBookDocId(docRef.id);
    } catch (error) {
      Alert.alert('Error', 'Failed to borrow book.');
      console.error('Error borrowing book: ', error);
    }
  };

  const returnBook = async () => {
    if (borrowedBookDocId) {
      try {
        await deleteDoc(doc(firestore, 'borrowed', borrowedBookDocId));
        Alert.alert('Success', 'Book returned successfully!');
        setBorrowedBooks(borrowedBooks.filter(id => id !== bookId));
        setBorrowedBookDocId(null);
      } catch (error) {
        Alert.alert('Error', 'Failed to return book.');
        console.error('Error returning book: ', error);
      }
    } else {
      Alert.alert('Error', 'No record of borrowing found.');
    }
  };

  if (!book) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: book.coverUrl }}
        style={styles.coverImage}
        onError={(e) => console.log('Loading image failed:', e.nativeEvent.error)}
      />
      <Text style={styles.bookName}>{book.title}</Text>
      <Text style={styles.bookAuthor}>Author: {book.author}</Text>
      <Text style={styles.rating}>Rating: {book.rating}</Text>
      <Text style={styles.summary}>{book.summary}</Text>
      <View style={styles.buttonContainer}>
        <Button title="Borrow Book" onPress={borrowBook} color="#42a5f5" />
        <Button title="Return Book" onPress={returnBook} color="#f54242" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    padding: 15,
    backgroundColor: '#f5f5f5',
  },
  coverImage: {
    width: '40%',
    height: '40%',
    borderRadius: 10,
  },
  bookName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 15,
  },
  bookAuthor: {
    fontSize: 18,
    color: '#888',
    marginVertical: 3,
  },
  rating: {
    fontSize: 18,
    color: '#888',
    marginVertical: 3,
  },
  summary: {
    fontSize: 15,
    marginVertical: 3,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default BookDetailScreen;
