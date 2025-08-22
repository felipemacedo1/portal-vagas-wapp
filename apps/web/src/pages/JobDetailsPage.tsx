import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { jobsService } from '@core/services/jobs'
import { Job } from '@core/types/jobs'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Toast } from '@/components/ui/toast'
import { ArrowLeft, MapPin, Building2, Clock, DollarSign } from 'lucide-react'

export function JobDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)
  const [applying, setApplying] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [toast, setToast] = useState<{ message: string; variant: 'default' | 'destructive' } | null>(null)

  useEffect(() => {
    if (!id) return
    
    const fetchJob = async () => {
      try {
        const data = await jobsService.getPublicJob(id)
        setJob(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar vaga')
      } finally {
        setLoading(false)
      }
    }

    fetchJob()
  }, [id])

  const handleApply = async () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    if (user?.role !== 'CANDIDATE') {
      setToast({ message: 'Apenas candidatos podem se candidatar', variant: 'destructive' })
      return
    }

    setApplying(true)
    try {
      await jobsService.applyToJob(job!.id)
      setToast({ message: 'Candidatura enviada com sucesso!', variant: 'default' })
    } catch (err) {
      setToast({ message: 'Erro ao enviar candidatura', variant: 'destructive' })
    } finally {
      setApplying(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6">
            <p className="text-destructive text-center">{error || 'Vaga não encontrada'}</p>
            <Button onClick={() => navigate('/')} className="w-full mt-4">
              Voltar ao início
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {toast && (
        <Toast variant={toast.variant} className="animate-in slide-in-from-top-2">
          {toast.message}
        </Toast>
      )}

      <main className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>

        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <div className="space-y-4">
                <div>
                  <CardTitle className="text-2xl mb-2">{job.title}</CardTitle>
                  <div className="flex items-center gap-4 text-muted-foreground">
                    <div className="flex items-center">
                      <Building2 className="h-4 w-4 mr-1" />
                      {job.company.name}
                      {job.company.verified && (
                        <Badge variant="secondary" className="ml-2">
                          Verificada
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {job.location}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {new Date(job.createdAt).toLocaleDateString('pt-BR')}
                    </div>
                  </div>
                </div>
                
                {job.salary && (
                  <div className="flex items-center text-green-600 font-medium">
                    <DollarSign className="h-4 w-4 mr-1" />
                    {job.salary}
                  </div>
                )}
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Descrição da Vaga</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">{job.description}</p>
              </div>
              
              {job.requirements && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Requisitos</h3>
                  <p className="text-muted-foreground whitespace-pre-wrap">{job.requirements}</p>
                </div>
              )}
              
              <div>
                <h3 className="text-lg font-semibold mb-3">Sobre a Empresa</h3>
                <div className="space-y-2">
                  <p className="font-medium">{job.company.name}</p>
                  {job.company.description && (
                    <p className="text-muted-foreground">{job.company.description}</p>
                  )}
                  {job.company.website && (
                    <a 
                      href={job.company.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {job.company.website}
                    </a>
                  )}
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <Button 
                  size="lg" 
                  className="w-full md:w-auto"
                  onClick={handleApply}
                  disabled={applying}
                >
                  {applying ? 'Enviando...' : 'Candidatar-se'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}