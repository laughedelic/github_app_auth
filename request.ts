const githubApiUrl = Deno.env.get("GITHUB_API_URL") ?? "https://api.github.com";

export async function appRequest(
  jwt: string,
  endpoint: string,
  params?: Record<string, any>
) {
  const response = await fetch(`${githubApiUrl}/${endpoint}`, {
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
