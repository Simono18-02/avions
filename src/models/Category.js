// src/models/Category.js
import { v4 as uuidv4 } from 'uuid';

export class Category {
  constructor(name, color, id = null) {
    this.id = id || uuidv4();
    this.name = name;
    this.color = color;
  }

  static fromObject(obj) {
    return new Category(obj.name, obj.color, obj.id);
  }
}