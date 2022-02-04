async function githubApiUrl() {
  const defaultUrl = "https://api.github.com";

  const envAccess = { name: "env", variable: "GITHUB_API_URL" } as const;
  const permissions = await Deno.permissions.query(envAccess);

  if (permissions.state == "granted") {
    return Deno.env.get("GITHUB_API_URL") ?? defaultUrl;
  }
  return defaultUrl;
}

export async function appRequest(
  jwt: string,
  endpoint: string,
  // deno-lint-ignore no-explicit-any
  params?: Record<string, any>,
) {
  const apiUrl = await githubApiUrl();
  const response = await fetch(`${apiUrl}/${endpoint}`, {
    headers: {
      authorization: `bearer ${jwt}`,
      accept: "application/vnd.github.v3+json",
    },
    ...params,
  });
  return await response.json();
}

export function listInstallations(jwt: string) {
  return appRequest(jwt, "app/installations");
}

export function createInstallationToken(
  jwt: string,
  installationId: string,
  ...repositories: string[]
) {
  const body = {
    repositories,
  };
  return appRequest(jwt, `app/installations/${installationId}/access_tokens`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}
