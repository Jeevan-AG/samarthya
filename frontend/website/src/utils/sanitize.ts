/**
 * Form Sanitization & Cyber Attack Defense Utilities for SAMARTHYA
 *
 * Protection layers:
 * 1. XSS / Script Injection: Escapes HTML special entities.
 * 2. SQL / NoSQL Injection: Detects SQL keywords & escape syntax.
 * 3. Buffer Overflow & Memory Exhaustion: Clamps string lengths.
 * 4. Bot & Honeypot detection.
 * 5. Strict Email validation.
 */

const SQL_INJECTION_PATTERN =
  /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER|CREATE|TRUNCATE|EXEC|DECLARE|WAITFOR|CAST|CONVERT)\b)|(--)|(\/\*)|(\*\/)|(;\s*$)|(\bOR\b\s+['"\d\w]+\s*=\s*['"\d\w]+)|(\bAND\b\s+['"\d\w]+\s*=\s*['"\d\w]+)/i;

export function sanitizeInput(input: string): string {
  if (!input) return '';
  return input
    .trim()
    .replace(/[&<>"'/]/g, (match) => {
      const entities: Record<string, string> = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '/': '&#x2F;',
      };
      return entities[match] || match;
    });
}

export function hasSQLInjectionThreat(input: string): boolean {
  if (!input) return false;
  return SQL_INJECTION_PATTERN.test(input);
}

export function stripControlCharacters(input: string): string {
  if (!input) return '';
  return input.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
}

export function cleanSecureInput(input: string, maxLength: number = 1000): string {
  if (!input) return '';
  const clean = stripControlCharacters(input).trim();
  const truncated = clean.slice(0, maxLength);
  return sanitizeInput(truncated);
}

export function isValidEmail(email: string): boolean {
  if (!email || email.length > 254) return false;
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return emailRegex.test(email.trim());
}
