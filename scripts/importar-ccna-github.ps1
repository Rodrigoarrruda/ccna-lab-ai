param(
  [Parameter(Mandatory=$true)][string]$ZipPath,
  [string]$RepositoryUrl = 'https://github.com/Rodrigoarrruda/ccna-lab-ai.git',
  [string]$Branch = 'bootstrap/importacao-codigo'
)
$ErrorActionPreference = 'Stop'
if (-not (Test-Path -LiteralPath $ZipPath -PathType Leaf)) { throw 'Arquivo ZIP não encontrado.' }
if (-not (Get-Command git -ErrorAction SilentlyContinue)) { throw 'Instale Git for Windows e autentique-se no GitHub antes de executar.' }
$root = Join-Path $PWD ('ccna-import-' + [guid]::NewGuid().ToString('N').Substring(0,8))
$unzip = Join-Path $root 'fonte'; $clone = Join-Path $root 'repositorio'
New-Item -ItemType Directory -Force -Path $unzip | Out-Null
Expand-Archive -LiteralPath $ZipPath -DestinationPath $unzip
$required = @('package.json','package-lock.json','next.config.mjs','app/page.tsx','lib/labs.ts')
foreach ($file in $required) { if (-not (Test-Path (Join-Path $unzip $file))) { throw "ZIP incompleto: $file" } }
& git clone --branch $Branch --single-branch $RepositoryUrl $clone
if ($LASTEXITCODE -ne 0) { throw 'Falha no clone ou acesso à branch.' }
$blocked = @('.env','.env.local','.env.production','.env.development','.next','node_modules','.git')
Get-ChildItem -LiteralPath $unzip -Force | Where-Object { $_.Name -notin $blocked } | ForEach-Object {
  Copy-Item -LiteralPath $_.FullName -Destination $clone -Recurse -Force
}
Push-Location $clone
try {
  & git add --all
  $tracked = & git diff --cached --name-only
  if ($tracked | Where-Object { $_ -match '(^|/)\.env(\.|$)|(^|/)(node_modules|\.next)/' }) { throw 'Importação bloqueada: artefatos ou .env presentes.' }
  & git status --short
  & git commit -m 'chore: import CCNA Lab AI 2.2 source baseline'
  if ($LASTEXITCODE -ne 0) { throw 'Falha no commit (verifique nome/email Git).'}
  & git push origin $Branch
  if ($LASTEXITCODE -ne 0) { throw 'Falha no push (verifique login/permissões GitHub).'}
} finally { Pop-Location }
Write-Host "Importação concluída na branch $Branch. Confira GitHub Actions antes de abrir PR."
