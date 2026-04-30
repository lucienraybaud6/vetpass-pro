import React, { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Landing from './pages/Landing.jsx'
import ClinicLayout from './pages/clinic/ClinicLayout.jsx'
import Dashboard from './pages/clinic/Dashboard.jsx'
import Patients from './pages/clinic/Patients.jsx'
import PatientDetail from './pages/clinic/PatientDetail.jsx'
import Rappels from './pages/clinic/Rappels.jsx'
import Messagerie from './pages/clinic/Messagerie.jsx'
import Fiches from './pages/clinic/Fiches.jsx'
import OwnerSpace from './pages/owner/OwnerSpace.jsx'
import Tarifs from './pages/Tarifs.jsx'
import Contact from './pages/Contact.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/tarifs" element={<Tarifs />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/clinique" element={<ClinicLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="patients" element={<Patients />} />
        <Route path="patients/:id" element={<PatientDetail />} />
        <Route path="rappels" element={<Rappels />} />
        <Route path="messagerie" element={<Messagerie />} />
        <Route path="fiches" element={<Fiches />} />
      </Route>
      <Route path="/proprietaire" element={<OwnerSpace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
