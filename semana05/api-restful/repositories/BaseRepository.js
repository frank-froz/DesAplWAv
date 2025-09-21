const fs = require("fs");
const path = require("path");

class BaseRepository {
  constructor(entityName) {
    this.dbPath = path.join(__dirname, "..","database", "db.json");
    this.entityName = entityName;
  }

  _readDB() {
    const data = fs.readFileSync(this.dbPath, "utf-8");
    return JSON.parse(data);
  }

  _writeDB(data) {
    fs.writeFileSync(this.dbPath, JSON.stringify(data, null, 2));
  }

  findAll() {
    const db = this._readDB();
    return db[this.entityName];
  }

  findWithPagination(page = 1, limit = 10) {
    const db = this._readDB();
    const allItems = db[this.entityName];
    
    // Calcular el offset
    const offset = (page - 1) * limit;
    
    // Obtener los items paginados
    const paginatedItems = allItems.slice(offset, offset + limit);
    
    // Información de paginación
    const totalItems = allItems.length;
    const totalPages = Math.ceil(totalItems / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;
    
    return {
      data: paginatedItems,
      pagination: {
        currentPage: page,
        totalPages: totalPages,
        totalItems: totalItems,
        itemsPerPage: limit,
        hasNextPage: hasNextPage,
        hasPrevPage: hasPrevPage,
        nextPage: hasNextPage ? page + 1 : null,
        prevPage: hasPrevPage ? page - 1 : null
      }
    };
  }

  findById(id) {
    const db = this._readDB();
    return db[this.entityName].find(item => item.id === id);
  }

  save(item) {
    const db = this._readDB();
    db[this.entityName].push(item);
    this._writeDB(db);
    return item;
  }

  update(id, newData) {
    const db = this._readDB();
    const index = db[this.entityName].findIndex(item => item.id === id);
    if (index === -1) return null;
    db[this.entityName][index] = { ...db[this.entityName][index], ...newData };
    this._writeDB(db);
    return db[this.entityName][index];
  }

  delete(id) {
    console.log(id);
    const db = this._readDB();
    const index = db[this.entityName].findIndex(item => item.id === id);
    if (index === -1) return false;
    db[this.entityName].splice(index, 1);
    this._writeDB(db);
    return true;
  }
}

module.exports = BaseRepository;