# Conversa Digital — Portfólio

Site estático em HTML, CSS e JavaScript, sem dependências de build ou servidor de aplicação. As páginas de projetos e seus arquivos fazem parte do próprio site.

## Testar localmente

Na pasta do projeto, execute:

```powershell
py -m http.server 8000
```

Abra `http://localhost:8000` no navegador. Se `py` não estiver disponível, use `python -m http.server 8000`.

## Publicar no GitHub

Crie um repositório vazio no GitHub e envie o conteúdo desta pasta, incluindo os arquivos ocultos `.gitignore` e `vercel.json`. Não envie credenciais ou arquivos `.env`; a configuração atual não precisa de variáveis de ambiente.

## Publicar na Vercel

1. Importe o repositório do GitHub na Vercel.
2. Selecione **Other** como framework, sem comando de build ou instalação.
3. Configure o diretório de saída como `.` (raiz do repositório).
4. Faça o deploy. Os cabeçalhos HTTP de segurança estão em `vercel.json`.

## Observação de segurança

A política CSP permite scripts e estilos inline e avaliação dinâmica porque as páginas existentes e o Tailwind Play CDN os utilizam. Ela restringe as origens de scripts externos e bloqueia objetos e conteúdo incorporado fora das origens declaradas. O Tailwind Play CDN é voltado a desenvolvimento; para uma política mais rígida e apropriada à produção, compile o CSS do projeto `projeto-03` localmente e migre scripts/estilos inline para arquivos locais ou hashes CSP antes de remover `'unsafe-inline'` e `'unsafe-eval'`.

O site é estático: qualquer dado colocado no HTML ou JavaScript é público depois do deploy. Não inclua senhas, tokens ou chaves privadas nesses arquivos.
