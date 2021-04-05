#!/usr/bin/env deno run --allow-net=api.github.com

import { appJwt } from "./jwt.ts";
import { listInstallations, createInstallationToken } from "./request.ts";

const [appId, privateKey, installationId, ...repositories] = Deno.args;
if (Deno.args.length < 2) {
  console.log(
    "Usage: github-app-auth <app-id> <private-key-base64-encoded> [installation-id [repositories ...]]"
  );
  Deno.exit(1);
}

const jwt = await appJwt(appId, privateKey);

if (!installationId) {
  const response = await listInstallations(jwt);
  console.log(JSON.stringify(response, null, 2));
} else {
  const response = await createInstallationToken(
    jwt,
    installationId,
    ...repositories
  );
  console.log(response.token);
}
