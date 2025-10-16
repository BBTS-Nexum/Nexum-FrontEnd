import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";
import { Switch } from "./ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  User,
  Mail,
  Phone,
  Building,
  LogOut,
  Bell,
  Lock,
  Globe,
  Palette,
  Save,
} from "lucide-react";

export function Settings() {
  const [accountData, setAccountData] = useState({
    name: "João Silva",
    email: "joao.silva@nexum.com",
    phone: "+55 11 98765-4321",
    department: "Planejamento",
    company: "NEXUM Corp",
  });

  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    criticalItems: true,
    purchaseApprovals: false,
  });

  const handleLogout = () => {
    if (confirm("Tem certeza que deseja sair?")) {
      // Aqui você implementaria a lógica de logout
      alert("Logout realizado com sucesso!");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl text-gray-900">Configurações</h2>
        <p className="text-gray-500">
          Gerencie suas preferências e informações da conta
        </p>
      </div>

      <Tabs defaultValue="account" className="space-y-6">
        <TabsList className="bg-gray-100">
          <TabsTrigger value="account" className="gap-2 data-[state=active]:bg-white">
            <User className="w-4 h-4" />
            Conta
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2 data-[state=active]:bg-white">
            <Bell className="w-4 h-4" />
            Notificações
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2 data-[state=active]:bg-white">
            <Lock className="w-4 h-4" />
            Segurança
          </TabsTrigger>
          <TabsTrigger value="preferences" className="gap-2 data-[state=active]:bg-white">
            <Palette className="w-4 h-4" />
            Preferências
          </TabsTrigger>
        </TabsList>

        {/* Account Tab */}
        <TabsContent value="account" className="space-y-6">
          {/* Profile Card */}
          <Card>
            <CardHeader>
              <CardTitle>Informações da Conta</CardTitle>
              <CardDescription>
                Gerencie suas informações pessoais e de contato
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar Section */}
              <div className="flex items-center gap-6">
                <Avatar className="w-24 h-24">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-blue-100 text-blue-600 text-2xl">
                    {accountData.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <h3 className="text-lg text-gray-900">{accountData.name}</h3>
                  <p className="text-sm text-gray-500">{accountData.department}</p>
                  <Button variant="outline" size="sm">
                    Alterar Foto
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Form Fields */}
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="name" className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-500" />
                    Nome Completo
                  </Label>
                  <Input
                    id="name"
                    value={accountData.name}
                    onChange={(e) =>
                      setAccountData({ ...accountData, name: e.target.value })
                    }
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={accountData.email}
                    onChange={(e) =>
                      setAccountData({ ...accountData, email: e.target.value })
                    }
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    Telefone
                  </Label>
                  <Input
                    id="phone"
                    value={accountData.phone}
                    onChange={(e) =>
                      setAccountData({ ...accountData, phone: e.target.value })
                    }
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="department" className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-gray-500" />
                    Departamento
                  </Label>
                  <Input
                    id="department"
                    value={accountData.department}
                    onChange={(e) =>
                      setAccountData({
                        ...accountData,
                        department: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="company" className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-gray-500" />
                    Empresa
                  </Label>
                  <Input
                    id="company"
                    value={accountData.company}
                    onChange={(e) =>
                      setAccountData({ ...accountData, company: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
                  <Save className="w-4 h-4" />
                  Salvar Alterações
                </Button>
                <Button variant="outline">Cancelar</Button>
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="text-red-600">Zona de Perigo</CardTitle>
              <CardDescription>
                Ações irreversíveis relacionadas à sua conta
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                <div>
                  <h4 className="text-sm text-gray-900 mb-1">Sair da Conta</h4>
                  <p className="text-xs text-gray-500">
                    Encerrar sua sessão no sistema NEXUM
                  </p>
                </div>
                <Button
                  variant="destructive"
                  onClick={handleLogout}
                  className="gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Sair
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Preferências de Notificação</CardTitle>
              <CardDescription>
                Configure como você deseja receber notificações
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Notificações por Email</Label>
                  <p className="text-sm text-gray-500">
                    Receba atualizações importantes por email
                  </p>
                </div>
                <Switch
                  checked={notifications.email}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, email: checked })
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Notificações Push</Label>
                  <p className="text-sm text-gray-500">
                    Receba notificações em tempo real no navegador
                  </p>
                </div>
                <Switch
                  checked={notifications.push}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, push: checked })
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Alertas de Itens Críticos</Label>
                  <p className="text-sm text-gray-500">
                    Seja notificado quando itens atingirem nível crítico
                  </p>
                </div>
                <Switch
                  checked={notifications.criticalItems}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, criticalItems: checked })
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Aprovações de Compra</Label>
                  <p className="text-sm text-gray-500">
                    Receba notificações sobre requisições pendentes
                  </p>
                </div>
                <Switch
                  checked={notifications.purchaseApprovals}
                  onCheckedChange={(checked) =>
                    setNotifications({
                      ...notifications,
                      purchaseApprovals: checked,
                    })
                  }
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
                  <Save className="w-4 h-4" />
                  Salvar Preferências
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Segurança da Conta</CardTitle>
              <CardDescription>
                Gerencie a segurança e autenticação da sua conta
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="current-password">Senha Atual</Label>
                  <Input id="current-password" type="password" />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="new-password">Nova Senha</Label>
                  <Input id="new-password" type="password" />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
                  <Input id="confirm-password" type="password" />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-sm text-gray-900">Autenticação de Dois Fatores</h4>
                <p className="text-sm text-gray-500">
                  Adicione uma camada extra de segurança à sua conta
                </p>
                <Button variant="outline">Configurar 2FA</Button>
              </div>

              <div className="flex gap-3 pt-4">
                <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
                  <Save className="w-4 h-4" />
                  Atualizar Senha
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Preferências do Sistema</CardTitle>
              <CardDescription>
                Customize sua experiência no NEXUM
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="language" className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-gray-500" />
                    Idioma
                  </Label>
                  <Input id="language" value="Português (Brasil)" readOnly />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="timezone">Fuso Horário</Label>
                  <Input id="timezone" value="America/Sao_Paulo (UTC-3)" readOnly />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="date-format">Formato de Data</Label>
                  <Input id="date-format" value="DD/MM/YYYY" readOnly />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="currency">Moeda</Label>
                  <Input id="currency" value="Real Brasileiro (R$)" readOnly />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-sm text-gray-900">Tema da Interface</h4>
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1">
                    Claro
                  </Button>
                  <Button variant="outline" className="flex-1">
                    Escuro
                  </Button>
                  <Button variant="outline" className="flex-1">
                    Automático
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
