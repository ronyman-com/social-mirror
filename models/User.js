const admin = require('../config/firebase');
const db = admin.firestore();
const bcrypt = require('bcryptjs');

class User {
  static collection = db.collection('users');

  /**
   * Find a user by conditions (supports both facebookId and email)
   * @param {Object} conditions - {facebookId} or {email}
   * @returns {Promise<Object|null>} User document or null
   */
  static async findOne(conditions) {
    let snapshot;
    
    if (conditions.facebookId) {
      snapshot = await this.collection
        .where('facebookId', '==', conditions.facebookId)
        .get();
    } else if (conditions.email) {
      snapshot = await this.collection
        .where('email', '==', conditions.email)
        .get();
    } else {
      return null;
    }

    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() };
  }

  /**
   * Create a new user with optional password hashing
   * @param {Object} userData - User data including optional password
   * @returns {Promise<Object>} Created user with id
   */
  static async create(userData) {
    // Hash password if present
    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 10);
    }

    const docRef = await this.collection.add(userData);
    const doc = await docRef.get();
    return { id: doc.id, ...doc.data() };
  }

  /**
   * Update user data
   * @param {string} id - User document ID
   * @param {Object} userData - Data to update
   * @returns {Promise<Object>} Updated user data
   */
  static async update(id, userData) {
    // Rehash password if being updated
    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 10);
    }

    await this.collection.doc(id).update(userData);
    const updatedDoc = await this.collection.doc(id).get();
    return { id, ...updatedDoc.data() };
  }

  /**
   * Find user by document ID
   * @param {string} id - User document ID
   * @returns {Promise<Object|null>} User document or null
   */
  static async findById(id) {
    const doc = await this.collection.doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() };
  }

  /**
   * Find user by email
   * @param {string} email - User email
   * @returns {Promise<Object|null>} User document or null
   */
  static async findByEmail(email) {
    return this.findOne({ email });
  }

  /**
   * Delete a user
   * @param {string} id - User document ID
   * @returns {Promise<boolean>} True if successful
   */
  static async delete(id) {
    await this.collection.doc(id).delete();
    return true;
  }

  /**
   * Verify user password
   * @param {string} id - User document ID
   * @param {string} password - Password to verify
   * @returns {Promise<boolean>} True if password matches
   */
  static async verifyPassword(id, password) {
    const user = await this.findById(id);
    if (!user || !user.password) return false;
    return bcrypt.compare(password, user.password);
  }
}

module.exports = User;