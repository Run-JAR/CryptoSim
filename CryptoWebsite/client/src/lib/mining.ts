// SHA-256 helper for mining
export async function sha256hex(msg: string): Promise<string> {
  const enc = new TextEncoder();
  const buf = await crypto.subtle.digest("SHA-256", enc.encode(msg));
  return Array.from(new Uint8Array(buf))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

// Check if hash meets target difficulty
export function hashMeetsTarget(hash: string, target: string): boolean {
  return hash.startsWith(target);
}

// Generate random nonce for mining
export function generateNonce(): string {
  return Math.floor(Math.random() * 1e12).toString();
}
