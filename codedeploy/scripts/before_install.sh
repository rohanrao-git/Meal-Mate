#!/usr/bin/env sh
set -eu

mkdir -p /opt/meal-mate
cd /opt/meal-mate

if command -v docker >/dev/null 2>&1; then
  docker compose -f ci/docker-compose.prod.yml down --remove-orphans || true
fi
