#!/usr/bin/env sh
set -eu

cd /opt/meal-mate

if [ ! -f deployment.env ]; then
  echo "deployment.env is missing. Expected IMAGE_REPO and IMAGE_TAG." >&2
  exit 1
fi

set -a
. ./deployment.env
set +a

if [ -z "${IMAGE_REPO:-}" ] || [ -z "${IMAGE_TAG:-}" ]; then
  echo "IMAGE_REPO/IMAGE_TAG not set in deployment.env" >&2
  exit 1
fi

IMAGE_REPO="$IMAGE_REPO" IMAGE_TAG="$IMAGE_TAG" docker compose -f ci/docker-compose.prod.yml up -d
