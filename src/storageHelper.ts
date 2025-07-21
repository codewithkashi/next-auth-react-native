import AsyncStorage from '@react-native-async-storage/async-storage';

// Save data to storage
const saveData = async (key: string, value: any) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
    console.log('Data saved successfully');
  } catch (error) {
    console.error('Error saving data:', error);
  }
};

// Retrieve data from storage
const getData = async (key: string) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      // Data found, parse and return
      return JSON.parse(value);
    } else {
      // No data found
      console.log('No data found');
      return null;
    }
  } catch (error) {
    console.error('Error retrieving data:', error);
    return null;
  }
};

// Remove data from storage
const removeData = async (key: string) => {
  try {
    await AsyncStorage.removeItem(key);
    console.log('Data removed successfully');
  } catch (error) {
    console.error('Error removing data:', error);
  }
};

export { saveData, getData, removeData };
