import { create, getNumericDate } from "https://deno.land/x/djwt@v2.2/mod.ts";

export function appJwt(appId: string, privateKey: string): Promise<string> {
  return create(
    { alg: "RS256", typ: "JWT" },
    {
      iss: appId, // issuer
      iat: getNumericDate(0), // issued at time (now)
      exp: getNumericDate(5 * 60), // expiration time (in 5 minutes)
    },
    atob(privateKey)
  );
}
