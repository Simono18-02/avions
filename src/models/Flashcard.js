// src/models/Flashcard.js
import { v4 as uuidv4 } from 'uuid';

export class Flashcard {
  constructor(name, imagePath, categoryIds = [], id = null) {
    this.id = id || uuidv4();
    this.name = name;
    this.imagePath = imagePath;
    this.categoryIds = categoryIds;
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  static fromObject(obj) {
    const flashcard = new Flashcard(
      obj.name,
      obj.imagePath,
      obj.categoryIds,
      obj.id
    );
    flashcard.createdAt = obj.createdAt;
    flashcard.updatedAt = obj.updatedAt;
    return flashcard;
  }

  update(name, imagePath, categoryIds) {
    this.name = name;
    this.imagePath = imagePath;
    this.categoryIds = categoryIds;
    this.updatedAt = new Date().toISOString();
    return this;
  }
}