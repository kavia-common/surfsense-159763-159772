import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../config/firebase';

// PUBLIC_INTERFACE
export const uploadPhoto = async (file, sessionId) => {
  /**
   * Uploads a photo to Firebase Storage
   * @param {File} file - Photo file to upload
   * @param {string} sessionId - ID of the session this photo belongs to
   * @returns {Promise<string>} Download URL of uploaded photo
   */
  try {
    if (!file) throw new Error('No file provided');
    
    // Create a unique filename
    const timestamp = Date.now();
    const filename = `sessions/${sessionId}/${timestamp}_${file.name}`;
    
    // Create a storage reference
    const storageRef = ref(storage, filename);
    
    // Upload the file
    const snapshot = await uploadBytes(storageRef, file);
    
    // Get the download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return downloadURL;
  } catch (error) {
    console.error('Error uploading photo:', error);
    throw new Error('Failed to upload photo. Please try again.');
  }
};

// PUBLIC_INTERFACE
export const deletePhoto = async (photoUrl) => {
  /**
   * Deletes a photo from Firebase Storage
   * @param {string} photoUrl - URL of photo to delete
   */
  try {
    if (!photoUrl) return;
    
    // Extract the path from the URL
    const decodedUrl = decodeURIComponent(photoUrl);
    const pathMatch = decodedUrl.match(/\/o\/(.*?)\?/);
    
    if (pathMatch && pathMatch[1]) {
      const filePath = pathMatch[1];
      const storageRef = ref(storage, filePath);
      await deleteObject(storageRef);
    }
  } catch (error) {
    console.error('Error deleting photo:', error);
    // Don't throw error for deletion failures
  }
};

// PUBLIC_INTERFACE
export const compressImage = (file, maxWidth = 800, quality = 0.8) => {
  /**
   * Compresses an image file before upload
   * @param {File} file - Image file to compress
   * @param {number} maxWidth - Maximum width for the compressed image
   * @param {number} quality - Quality of compression (0-1)
   * @returns {Promise<File>} Compressed image file
   */
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // Calculate new dimensions
      const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
      canvas.width = img.width * ratio;
      canvas.height = img.height * ratio;
      
      // Draw and compress
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      canvas.toBlob((blob) => {
        const compressedFile = new File([blob], file.name, {
          type: 'image/jpeg',
          lastModified: Date.now()
        });
        resolve(compressedFile);
      }, 'image/jpeg', quality);
    };
    
    img.src = URL.createObjectURL(file);
  });
};
