import { Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ErrorBoundary } from './core/providers/ErrorBoundary'
import { ToastProvider } from './core/providers/ToastProvider'
import { AppShell } from './shared/components/AppShell'
import { ProtectedRoute } from './components/layout/ProtectedRoute'

// Public Pages
import { HomePage } from './pages/public/HomePage'
import { LoginPage } from './pages/public/LoginPage'
import { RegisterPage } from './pages/public/RegisterPage'
import { JobDetailsPage } from './pages/public/JobDetailsPage'

// Candidate Features
import { CandidateDashboard } from './features/candidates/CandidateDashboard'
import { CandidateProfile } from './features/candidates/CandidateProfile'
import { ApplicationsList as CandidateApplications } from './features/candidates/ApplicationsList'

// Employer Features
import { EmployerDashboard } from './features/employers/EmployerDashboard'
import { JobForm } from './features/employers/JobForm'
import { JobsList } from './features/employers/JobsList'
import { ApplicationsList as EmployerApplications } from './features/employers/ApplicationsList'

// Admin Features
import { AdminDashboard } from './features/admin/AdminDashboard'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
})

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <AppShell>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/jobs/:id" element={<JobDetailsPage />} />
              
              {/* Candidate Routes */}
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
              <Route path="/candidate/applications" element={
                <ProtectedRoute roles={['CANDIDATE']}>
                  <CandidateApplications />
                </ProtectedRoute>
              } />
              
              {/* Employer Routes */}
              <Route path="/employer/dashboard" element={
                <ProtectedRoute roles={['EMPLOYER']}>
                  <EmployerDashboard />
                </ProtectedRoute>
              } />
              <Route path="/employer/jobs" element={
                <ProtectedRoute roles={['EMPLOYER']}>
                  <JobsList />
                </ProtectedRoute>
              } />
              <Route path="/employer/jobs/new" element={
                <ProtectedRoute roles={['EMPLOYER']}>
                  <JobForm />
                </ProtectedRoute>
              } />
              <Route path="/employer/jobs/:id/edit" element={
                <ProtectedRoute roles={['EMPLOYER']}>
                  <JobForm />
                </ProtectedRoute>
              } />
              <Route path="/employer/applications" element={
                <ProtectedRoute roles={['EMPLOYER']}>
                  <EmployerApplications />
                </ProtectedRoute>
              } />
              
              {/* Admin Routes */}
              <Route path="/admin/dashboard" element={
                <ProtectedRoute roles={['ADMIN']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              
              {/* Fallback */}
              <Route path="*" element={
                <div className="text-center p-8">
                  <h2>Página não encontrada</h2>
                  <p>A página que você está procurando não existe.</p>
                </div>
              } />
            </Routes>
          </AppShell>
        </ToastProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ErrorBoundary>
  )
}

export default App