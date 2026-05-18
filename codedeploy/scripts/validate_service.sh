#!/usr/bin/env sh
set -eu

HEALTH_URL="${PROD_HEALTHCHECK_URL:-http://localhost/health}"

curl -fsS "$HEALTH_URL" >/dev/null
echo "Production healthcheck passed: $HEALTH_URL"
