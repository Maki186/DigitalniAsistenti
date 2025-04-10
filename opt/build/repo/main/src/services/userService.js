import usersData from '../data/users.json'
import fs from 'fs'
import path from 'path'
import bcrypt from 'bcryptjs'

// Cesta k souboru s databází
const DB_PATH = path.resolve(__dirname, '../data/users.json')

// Načtení databáze
const loadDatabase = () => {
  try {
    const data = fs.readFileSync(DB_PATH, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Chyba při načítání databáze:', error)
    return { users: [], nextId: 1 }
  }
}

// Uložení databáze
const saveDatabase = (data) => {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8')
    return true
  } catch (error) {
    console.error('Chyba při ukládání databáze:', error)
    return false
  }
}

// Registrace nového uživatele
export const registerUser = async (email, password, name) => {
  const db = loadDatabase()
  
  // Kontrola, zda email již není používán
  if (db.users.some(user => user.email === email)) {
    throw new Error('Email je již používán')
  }
  
  // Hashování hesla
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)
  
  // Vytvoření nového uživatele
  const newUser = {
    id: db.nextId,
    email,
    password: hashedPassword,
    name,
    role: 'user',
    createdAt: new Date().toISOString()
  }
  
  // Přidání uživatele do databáze
  db.users.push(newUser)
  db.nextId++
  
  // Uložení databáze
  if (!saveDatabase(db)) {
    throw new Error('Chyba při ukládání uživatele')
  }
  
  // Vrátíme uživatele bez hesla
  const { password: _, ...userWithoutPassword } = newUser
  return userWithoutPassword
}

// Přihlášení uživatele
export const loginUser = async (email, password) => {
  const db = loadDatabase()
  
  // Najít uživatele podle emailu
  const user = db.users.find(user => user.email === email)
  if (!user) {
    throw new Error('Uživatel s tímto emailem neexistuje')
  }
  
  // Ověření hesla
  const isPasswordValid = await bcrypt.compare(password, user.password)
  if (!isPasswordValid) {
    throw new Error('Nesprávné heslo')
  }
  
  // Vrátíme uživatele bez hesla
  const { password: _, ...userWithoutPassword } = user
  return userWithoutPassword
}

// Získání uživatele podle ID
export const getUserById = (id) => {
  const db = loadDatabase()
  const user = db.users.find(user => user.id === id)
  
  if (!user) {
    return null
  }
  
  // Vrátíme uživatele bez hesla
  const { password, ...userWithoutPassword } = user
  return userWithoutPassword
}

// Aktualizace uživatele
export const updateUser = async (id, updates) => {
  const db = loadDatabase()
  const userIndex = db.users.findIndex(user => user.id === id)
  
  if (userIndex === -1) {
    throw new Error('Uživatel neexistuje')
  }
  
  // Pokud se aktualizuje heslo, musíme ho zahashovat
  if (updates.password) {
    const salt = await bcrypt.genSalt(10)
    updates.password = await bcrypt.hash(updates.password, salt)
  }
  
  // Aktualizace uživatele
  db.users[userIndex] = {
    ...db.users[userIndex],
    ...updates
  }
  
  // Uložení databáze
  if (!saveDatabase(db)) {
    throw new Error('Chyba při aktualizaci uživatele')
  }
  
  // Vrátíme aktualizovaného uživatele bez hesla
  const { password, ...userWithoutPassword } = db.users[userIndex]
  return userWithoutPassword
}

// Smazání uživatele
export const deleteUser = (id) => {
  const db = loadDatabase()
  const userIndex = db.users.findIndex(user => user.id === id)
  
  if (userIndex === -1) {
    throw new Error('Uživatel neexistuje')
  }
  
  // Smazání uživatele
  db.users.splice(userIndex, 1)
  
  // Uložení databáze
  if (!saveDatabase(db)) {
    throw new Error('Chyba při mazání uživatele')
  }
  
  return true
} 