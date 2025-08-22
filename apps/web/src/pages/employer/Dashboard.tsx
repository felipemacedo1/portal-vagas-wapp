import { Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Building2, Plus, Users, FileText } from 'lucide-react'

export function EmployerDashboard() {
  const { user } = useAuth()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard do Empregador</h1>
        <p className="text-muted-foreground">Bem-vindo, {user?.email}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Minha Empresa
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Configure as informações da sua empresa
            </p>
            <Button asChild className="w-full">
              <Link to="/employer/company">Gerenciar Empresa</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Criar Vaga
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Publique uma nova oportunidade de emprego
            </p>
            <Button asChild className="w-full">
              <Link to="/employer/jobs/new">Nova Vaga</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Minhas Vagas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Gerencie suas vagas publicadas
            </p>
            <Button asChild variant="outline" className="w-full">
              <Link to="/employer/jobs">Ver Vagas</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Candidaturas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Analise os candidatos às suas vagas
            </p>
            <Button asChild variant="outline" className="w-full">
              <Link to="/employer/applications">Ver Candidaturas</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}