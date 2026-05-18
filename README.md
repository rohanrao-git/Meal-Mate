# Meal-Mate

## Jenkins CI/CD Pipeline

This repository includes a complete Jenkins pipeline in `Jenkinsfile` with the following stages:

1. Build
2. Test
3. Code Quality
4. Security
5. Deploy
6. Release
7. Monitoring

### What is configured

- Build: `npm ci`, `npm run build`, build artifact (`dist-<build>.tar.gz`), Docker image build.
- Test: Vitest execution with JUnit + coverage outputs archived in Jenkins.
- Code Quality: ESLint + SonarQube scan (`sonarqube-project.properties`).
- Security: `npm audit` + `trivy` scans.
  - A custom script (`scripts/security-audit-report.mjs`) prints, for each detected vulnerability:
    - what the issue is,
    - severity,
    - whether/how it is addressed (recommended package update/fix availability).
  - Pipeline fails on high/critical vulnerabilities.
- Deploy: Docker Compose deploy to staging (`ci/docker-compose.staging.yml`) and health check.
- Release: Manual promotion gate for `main`/tags, then Docker image promotion from staging-tested build to production (`prod` tag) via `ci/docker-compose.prod.yml`.
- Monitoring: New Relic deployment marker integration for production release notifications.

### Jenkins prerequisites

- Jenkins agent with Node.js 20+, Docker, Docker Compose, and Trivy installed.
- SonarQube server configured in Jenkins as `sonarqube-server`.
- Optional env/credentials for monitoring:
  - `NEW_RELIC_API_KEY`
  - `NEW_RELIC_ACCOUNT_ID`
  - `NEW_RELIC_ENTITY_GUID`

### Docker-only Promotion Flow

The pipeline demonstrates promotion from staging to production using Docker only:

1. Build stage creates image `meal-mate:<BUILD_NUMBER>`.
2. Deploy stage runs staging container from that exact image on port `18080`.
3. Release stage (manual approval) retags the same tested image to `meal-mate:prod`.
4. Release stage deploys production container using `ci/docker-compose.prod.yml` on port `8081`.
5. Release stage validates production with `curl http://localhost:8081/health`.

## Supabase Cloud CRUD

Inventory is now connected to Supabase and implements CRUD on pantry items.

- Create: add a pantry item from the Inventory add form.
- Read: load pantry items from Supabase when Inventory page opens.
- Update: use `+1 day` / `-1 day` buttons to update expiry days.
- Delete: remove an item with the trash button.

### Supabase setup (cloud only)

1. Create a Supabase project.
2. In SQL Editor, run:

```sql
create table if not exists public.pantry_items (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  emoji text not null default '🥫',
  qty text not null,
  days int not null default 3,
  cat text not null,
  created_at timestamptz not null default now()
);

alter table public.pantry_items enable row level security;

create policy "Allow anon read pantry_items"
on public.pantry_items
for select
to anon
using (true);

create policy "Allow anon insert pantry_items"
on public.pantry_items
for insert
to anon
with check (true);

create policy "Allow anon update pantry_items"
on public.pantry_items
for update
to anon
using (true)
with check (true);

create policy "Allow anon delete pantry_items"
on public.pantry_items
for delete
to anon
using (true);
```

3. Create `.env` in project root:

```bash
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Run app and use Inventory page to perform CRUD operations.
