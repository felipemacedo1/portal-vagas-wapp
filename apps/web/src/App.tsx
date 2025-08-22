import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@/contexts/AuthContext'
import { ProtectedRoute } from '@/components/layout/ProtectedRoute'
import { Header } from '@/components/layout/Header'
import { HomePage } from '@/pages/HomePage'
import { LoginPage } from '@/pages/LoginPage'
import { RegisterPage } from '@/pages/RegisterPage'
import { JobDetailsPage } from '@/pages/JobDetailsPage'
import { CandidateDashboard } from '@/pages/candidate/Dashboard'
import { CandidateProfile } from '@/pages/candidate/Profile'
import { EmployerDashboard } from '@/pages/employer/Dashboard'
import { AdminDashboard } from '@/pages/admin/Dashboard'

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-background">
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/jobs/:id" element={<JobDetailsPage />} />
          
          <Route path="/candidate/dashboard" element={
            <ProtectedRoute roles={['CANDIDATE']}>
              <CandidateDashboard />
            </ProtectedRoute>
          } />
          <Route path="/candidate/profile" element={
            <ProtectedRoute roles={['CANDIDATE']}>
              <CandidateProfile />
            </ProtectedRoute>
          } />
          
          <Route path="/employer/dashboard" element={
            <ProtectedRoute roles={['EMPLOYER']}>
              <EmployerDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/admin/dashboard" element={
            <ProtectedRoute roles={['ADMIN']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </AuthProvider>
  )
}

export default App