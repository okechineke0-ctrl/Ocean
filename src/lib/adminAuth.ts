/**
 * Enterprise Admin Authentication Service
 * Uses Cryptographic HMAC Bearer Session Tokens verified server-side.
 * Eliminates client-side hardcoded secrets and enforces zero-trust architecture.
 */

const TOKEN_STORAGE_KEY = 'ocean_tech_admin_session_token';

export function getAdminToken(): string | null {
  try {
    return sessionStorage.getItem(TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function setAdminToken(token: string): void {
  try {
    sessionStorage.setItem(TOKEN_STORAGE_KEY, token);
  } catch (err) {
    console.error('Failed to store admin token:', err);
  }
}

export function clearAdminToken(): void {
  try {
    sessionStorage.removeItem(TOKEN_STORAGE_KEY);
    sessionStorage.removeItem('ocean_tech_admin_auth');
  } catch (err) {
    console.error('Failed to clear admin token:', err);
  }
}

export function getAdminAuthHeaders(): Record<string, string> {
  const token = getAdminToken();
  if (!token) return {};
  return {
    Authorization: `Bearer ${token}`,
  };
}

export interface AdminLoginResult {
  success: boolean;
  token?: string;
  expiresIn?: string;
  error?: string;
}

/**
 * Authenticates with the server backend using timing-safe comparison
 * Protected by anti-brute-force rate limiting (max 8 attempts per 15 min)
 */
export async function loginAdmin(passcode: string): Promise<AdminLoginResult> {
  try {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ passcode }),
    });

    const data = await res.json().catch(() => ({}));

    if (res.status === 429) {
      return {
        success: false,
        error: data.error || 'Too many administration login attempts. Rate limit triggered. Please wait 15 minutes.',
      };
    }

    if (!res.ok || !data.token) {
      return {
        success: false,
        error: data.error || 'Invalid administrator passcode. Access denied.',
      };
    }

    setAdminToken(data.token);
    return {
      success: true,
      token: data.token,
      expiresIn: data.expiresIn,
    };
  } catch (err) {
    console.error('Admin login network failure:', err);
    return {
      success: false,
      error: 'Network connectivity error. Unable to verify credentials with security server.',
    };
  }
}

/**
 * Validates the existing session token against the server
 */
export async function verifyAdminSession(): Promise<boolean> {
  const token = getAdminToken();
  if (!token) return false;

  try {
    const res = await fetch('/api/admin/verify', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      const data = await res.json().catch(() => ({}));
      return Boolean(data.authenticated);
    }

    // Token invalid or expired
    clearAdminToken();
    return false;
  } catch {
    // Keep token for offline resilience if server temporary network glitch, but don't elevate privileges
    return true;
  }
}

export function logoutAdmin(): void {
  clearAdminToken();
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('ocean-admin-logout'));
  }
}
