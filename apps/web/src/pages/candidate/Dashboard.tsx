import { Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { User, FileText, Search } from 'lucide-react'

export function CandidateDashboard() {
  const { user } = useAuth()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard do Candidato</h1>
        <p className="text-muted-foreground">Bem-vindo, {user?.email}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Meu Perfil
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Mantenha seu perfil atualizado para aumentar suas chances
            </p>
            <Button asChild className="w-full">
              <Link to="/candidate/profile">Editar Perfil</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Minhas Candidaturas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Acompanhe o status das suas candidaturas
            </p>
            <Button asChild variant="outline" className="w-full">
              <Link to="/candidate/applications">Ver Candidaturas</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Buscar Vagas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Encontre novas oportunidades de emprego
            </p>
            <Button asChild variant="outline" className="w-full">
              <Link to="/">Buscar Vagas</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}