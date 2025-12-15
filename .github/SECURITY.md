# Security Policy

## Supported Versions

We release patches for security vulnerabilities for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

## Reporting a Vulnerability

We take security vulnerabilities seriously. If you discover a security issue, please report it responsibly.

### How to Report

**Please do NOT report security vulnerabilities through public GitHub issues.**

Instead, please report them through one of the following methods:

1. **GitHub Security Advisories** (Preferred)
   - Go to the [Security Advisories](https://github.com/PegasusHeavyIndustries/nestjs-angular-ssr/security/advisories/new) page
   - Click "Report a vulnerability"
   - Fill out the form with details about the vulnerability

2. **Email**
   - Send an email to security@pegasusheavy.com (if available)
   - Include "SECURITY" in the subject line

### What to Include

Please include the following information in your report:

- **Description** of the vulnerability
- **Steps to reproduce** the issue
- **Potential impact** of the vulnerability
- **Suggested fix** (if you have one)
- **Your contact information** for follow-up questions

### What to Expect

- **Acknowledgment**: We will acknowledge receipt of your report within 48 hours
- **Initial Assessment**: We will provide an initial assessment within 7 days
- **Resolution Timeline**: We aim to resolve critical vulnerabilities within 30 days
- **Credit**: We will credit reporters in our security advisories (unless you prefer to remain anonymous)

### Disclosure Policy

- We follow coordinated disclosure practices
- We will work with you to understand and resolve the issue
- We will notify you when the vulnerability is fixed
- We will publicly disclose the vulnerability after a fix is available

## Security Best Practices for Users

When using this library, we recommend:

1. **Keep dependencies updated** - Regularly update to the latest version
2. **Use environment variables** - Never hardcode sensitive configuration
3. **Implement proper caching** - Be mindful of what data is cached
4. **Sanitize user input** - Always validate and sanitize any user-provided data
5. **Use HTTPS** - Always serve your application over HTTPS in production

## Security-Related Configuration

### Cache Security

When using caching, be aware that:

- Cached responses may contain sensitive data
- Use appropriate cache expiration times
- Consider implementing cache key generators that account for user sessions

### Error Handling

When configuring error handlers:

- Never expose stack traces in production
- Log errors securely
- Return generic error messages to users

## Acknowledgments

We would like to thank the following individuals for responsibly disclosing vulnerabilities:

- _No vulnerabilities reported yet_

---

Thank you for helping keep our project and its users safe! 🛡️
