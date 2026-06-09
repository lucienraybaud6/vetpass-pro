import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext.jsx'
import Login from './pages/Login.jsx'
import Landing from './pages/Landing.jsx'
import ClinicLayout from './pages/clinic/ClinicLayout.jsx'
import Dashboard from './pages/clinic/Dashboard.jsx'
import Patients from './pages/clinic/Patients.jsx'
import PatientDetail from './pages/clinic/PatientDetail.jsx'
import NouveauPatient from './pages/clinic/NouveauPatient.jsx'
import Calendrier from './pages/clinic/Calendrier.jsx'
import Messagerie from './pages/clinic/Messagerie.jsx'
import Fiches from './pages/clinic/Fiches.jsx'
import Facturation from './pages/clinic/Facturation.jsx'
import FeedbacksPage from './pages/clinic/FeedbacksPage.jsx'
import OwnerSpace from './pages/owner/OwnerSpace.jsx'
import { Tarifs, Contact } from './pages/Tarifs.jsx'

function VetRoute({ children }) {
  const { isVet } = useAuth()
  return isVet ? children : <Navigate to="/connexion" replace />
}
function OwnerRoute({ children }) {
  const { isOwner } = useAuth()
  return isOwner ? children : <Navigate to="/connexion" replace />
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/connexion" element={<Login />} />
      <Route path="/tarifs" element={<Tarifs />} />
      <Route path="/contact" element={<Contact />} />

      <Route path="/clinique" element={<VetRoute><ClinicLayout /></VetRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="patients" element={<Patients />} />
        <Route path="patients/nouveau" element={<NouveauPatient />} />
        <Route path="patients/:id" element={<PatientDetail />} />
        <Route path="calendrier" element={<Calendrier />} />
        <Route path="messagerie" element={<Messagerie />} />
        <Route path="fiches" element={<Fiches />} />
        <Route path="facturation" element={<Facturation />} />
        <Route path="feedbacks" element={<FeedbacksPage />} />
      </Route>

      <Route path="/proprietaire" element={<OwnerRoute><OwnerSpace /></OwnerRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return <AuthProvider><AppRoutes /></AuthProvider>
}
