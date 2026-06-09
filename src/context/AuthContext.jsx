import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export const CREDENTIALS = {
  veterinaire: {
    login: 'vetpass-admin',
    password: 'clinique2026',
    role: 'vet',
    nom: 'Dr. Martin',
    clinique: 'Clinique du Parc',
  },
  proprietaires: {
    // Rempli dynamiquement depuis les patients enregistrés
    // Format : 'email@ex.fr': { password: 'CODE', patientId: 'PAT-xxx', nom: 'Mme. X' }
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('vp_session')
      return saved ? JSON.parse(saved) : null
    } catch { return null }
  })

  useEffect(() => {
    if (user) localStorage.setItem('vp_session', JSON.stringify(user))
    else localStorage.removeItem('vp_session')
  }, [user])

  const loginVet = (login, password) => {
    if (login === CREDENTIALS.veterinaire.login && password === CREDENTIALS.veterinaire.password) {
      const u = { role: 'vet', ...CREDENTIALS.veterinaire }
      setUser(u)
      return { success: true }
    }
    return { success: false, error: 'Identifiants incorrects' }
  }

  const loginOwner = (email, password) => {
    // Cherche dans les patients enregistrés
    try {
      const patients = JSON.parse(localStorage.getItem('vp_patients') || '[]')
      const patient = patients.find(p =>
        p.proprietaire?.email?.toLowerCase() === email.toLowerCase() &&
        p.codeAcces === password
      )
      if (patient) {
        const u = {
          role: 'owner',
          email,
          patientId: patient.id,
          nom: patient.proprietaire.nom,
          patientNom: patient.nom
        }
        setUser(u)
        return { success: true }
      }
    } catch {}
    return { success: false, error: 'Email ou code d\'accès incorrect' }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('vp_session')
  }

  return (
    <AuthContext.Provider value={{
      user,
      isVet: user?.role === 'vet',
      isOwner: user?.role === 'owner',
      isLoggedIn: !!user,
      loginVet,
      loginOwner,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() { return useContext(AuthContext) }
