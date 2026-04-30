import React from 'react'
import { Link } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts'
import { stats, patients, rappels } from '../../data/demo.js'

const monthData = [
  { mois: 'Nov', consultations: 32, revenus: 6200 },
  { mois: 'Déc', consultations: 28, revenus: 5800 },
  { mois: 'Jan', consultations: 35, revenus: 7100 },
  { mois: 'Fév', consultations: 30, revenus: 6400 },
  { mois: 'Mar', consultations: 38, revenus: 8420 },
  { mois: 'Avr', consultations: 22, revenus: 5100 },
]

const satisfactionData = [
  { semaine: 'S1', score: 4.4 }, { semaine: 'S2', score: 4.7 },
  { semaine: 'S3', score: 4.5 }, { semaine: 'S4', score: 4.6 },
]

function StatCard({ value, label, sub, color, icon, trend }) {
  return (
    <div style={{ background: '#fff', border: '1px solid var(--slate-200)', borderRadius: 'var(--radius-lg)', padding: '24px 28px', boxShadow: 'var(--shadow-sm)', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: color }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.4rem', color: 'var(--slate-900)', lineHeight: 1 }}>{value}</div>
          <div style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--slate-600)', marginTop: 6 }}>{label}</div>
          {sub && <div style={{ fontSize: '0.78rem', color: 'var(--slate-400)', marginTop: 3 }}>{sub}</div>}
        </div>
        <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>{icon}</div>
      </div>
      {trend && <div style={{ marginTop: 12, fontSize: '0.78rem', color: trend > 0 ? 'var(--teal-700)' : 'var(--red-500)', display: 'flex', alignItems: 'center', gap: 4 }}>
        <span>{trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%</span>
        <span style={{ color: 'var(--slate-400)' }}>vs mois dernier</span>
      </div>}
    </div>
  )
}

function Badge({ label, color, bg }) {
  return <span style={{ background: bg, color, fontSize: '0.72rem', fontWeight: 600, padding: '2px 10px', borderRadius: 100, whiteSpace: 'nowrap' }}>{label}</span>
}

export default function Dashboard() {
  const urgents = rappels.filter(r => r.priorite === 'haute')

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <div style={{ fontSize: '0.8rem', color: 'var(--teal-700)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>Tableau de bord</div>
          <h2 style={{ color: 'var(--slate-900)' }}>Bonjour, Dr. Martin 👋</h2>
          <p style={{ color: 'var(--slate-500)', fontSize: '0.875rem', marginTop: 4 }}>Mercredi 30 avril 2026 · Clinique du Parc</p>
        </div>
        <Link to="/clinique/patients">
          <button style={{ background: 'var(--teal-800)', color: '#fff', padding: '10px 20px', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', fontWeight: 600, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
            + Nouveau patient
          </button>
        </Link>
      </div>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 28 }}>
        <StatCard value="142" label="Patients actifs" sub="Chiens, chats et NAC" color="var(--teal-600)" icon="🐾" trend={5.6} />
        <StatCard value="38" label="RDV ce mois" sub="8 420€ de revenus" color="var(--blue-500)" icon="📅" trend={8.1} />
        <StatCard value="4.6★" label="Satisfaction" sub="Basé sur 24 feedbacks" color="var(--amber-500)" icon="⭐" trend={2.2} />
        <StatCard value="74%" label="Rappels honorés" sub="17/23 ce mois" color="var(--purple-500)" icon="🔔" trend={-3.4} />
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20, marginBottom: 28 }}>
        {/* Bar chart */}
        <div style={{ background: '#fff', border: '1px solid var(--slate-200)', borderRadius: 'var(--radius-lg)', padding: 24, boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <div>
              <div style={{ fontWeight: 600, color: 'var(--slate-800)', fontSize: '0.95rem' }}>Consultations & Revenus</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--slate-400)', marginTop: 2 }}>6 derniers mois</div>
            </div>
            <div style={{ display: 'flex', gap: 16, fontSize: '0.75rem', color: 'var(--slate-500)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><span style={{ width: 10, height: 10, background: 'var(--teal-600)', borderRadius: 2, display: 'inline-block' }} />Consultations</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><span style={{ width: 10, height: 10, background: 'var(--blue-500)', borderRadius: 2, display: 'inline-block' }} />Revenus (€)</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthData} barSize={14} barGap={4}>
              <XAxis dataKey="mois" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94A3B8' }} />
              <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94A3B8' }} />
              <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94A3B8' }} />
              <Tooltip contentStyle={{ border: '1px solid var(--slate-200)', borderRadius: 8, fontSize: 13 }} />
              <Bar yAxisId="left" dataKey="consultations" fill="#0F6E56" radius={[4, 4, 0, 0]} />
              <Bar yAxisId="right" dataKey="revenus" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Satisfaction line chart */}
        <div style={{ background: '#fff', border: '1px solid var(--slate-200)', borderRadius: 'var(--radius-lg)', padding: 24, boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ fontWeight: 600, color: 'var(--slate-800)', fontSize: '0.95rem', marginBottom: 4 }}>Score satisfaction</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--slate-400)', marginBottom: 20 }}>4 dernières semaines</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', color: 'var(--amber-500)', marginBottom: 8 }}>4.6</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--teal-700)', marginBottom: 20 }}>↑ +0.2 vs mois précédent</div>
          <ResponsiveContainer width="100%" height={100}>
            <LineChart data={satisfactionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--slate-100)" />
              <XAxis dataKey="semaine" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94A3B8' }} />
              <YAxis domain={[4, 5]} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94A3B8' }} />
              <Tooltip contentStyle={{ border: '1px solid var(--slate-200)', borderRadius: 8, fontSize: 12 }} />
              <Line type="monotone" dataKey="score" stroke="#F59E0B" strokeWidth={2.5} dot={{ fill: '#F59E0B', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Rappels urgents */}
        <div style={{ background: '#fff', border: '1px solid var(--slate-200)', borderRadius: 'var(--radius-lg)', padding: 24, boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div style={{ fontWeight: 600, color: 'var(--slate-800)', fontSize: '0.95rem' }}>🔴 Rappels prioritaires</div>
            <Link to="/clinique/rappels" style={{ fontSize: '0.8rem', color: 'var(--teal-700)', fontWeight: 500 }}>Voir tout →</Link>
          </div>
          {rappels.slice(0, 5).map(r => (
            <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--slate-100)' }}>
              <span style={{ fontSize: '1.4rem' }}>{r.avatar}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--slate-800)' }}>{r.patient}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--slate-400)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.proprietaire}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <Badge
                  label={r.statut}
                  color={r.statut === 'En retard' ? 'var(--red-500)' : r.statut === 'Rappel proche' ? '#92400E' : 'var(--teal-700)'}
                  bg={r.statut === 'En retard' ? 'var(--red-100)' : r.statut === 'Rappel proche' ? 'var(--amber-100)' : 'var(--teal-100)'}
                />
                <div style={{ fontSize: '0.72rem', color: 'var(--slate-400)', marginTop: 3 }}>{r.type}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Derniers patients */}
        <div style={{ background: '#fff', border: '1px solid var(--slate-200)', borderRadius: 'var(--radius-lg)', padding: 24, boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div style={{ fontWeight: 600, color: 'var(--slate-800)', fontSize: '0.95rem' }}>👥 Derniers patients</div>
            <Link to="/clinique/patients" style={{ fontSize: '0.8rem', color: 'var(--teal-700)', fontWeight: 500 }}>Voir tout →</Link>
          </div>
          {patients.map(p => (
            <Link key={p.id} to={`/clinique/patients/${p.id}`} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--slate-100)', textDecoration: 'none' }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: `${p.couleur}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', flexShrink: 0 }}>{p.avatar}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--slate-800)' }}>{p.nom} <span style={{ fontWeight: 400, color: 'var(--slate-400)' }}>— {p.race}</span></div>
                <div style={{ fontSize: '0.78rem', color: 'var(--slate-400)' }}>{p.proprietaire.nom}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                <Badge
                  label={p.statutVaccinal}
                  color={p.statutVaccinal === 'À jour' ? 'var(--teal-700)' : p.statutVaccinal === 'En retard' ? 'var(--red-500)' : '#92400E'}
                  bg={p.statutVaccinal === 'À jour' ? 'var(--teal-100)' : p.statutVaccinal === 'En retard' ? 'var(--red-100)' : 'var(--amber-100)'}
                />
                <div style={{ fontSize: '0.72rem', color: 'var(--slate-400)' }}>Score: {p.proprietaire.score}/100</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
