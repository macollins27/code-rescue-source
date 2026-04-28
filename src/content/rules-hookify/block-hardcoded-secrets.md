---
displayId: block-hardcoded-secrets
area: security
action: block
event: "file (Write|Edit on .ts/.tsx/.js/.jsx, excluding tests)"
lockedOn: "2026-02-08"
origin: "Hardcoded credentials in code are security vulnerabilities; auditors flag them as gross negligence"
verbatim: true
gloss: "Block writes that include `(api_key|secret|password|token|credential) = '<8+ chars>'` patterns in production source files. Use environment variables instead."
cites:
  - SEC-25
---

```markdown
---
name: block-hardcoded-secrets
enabled: true
event: file
tool_matcher: Write|Edit
action: block
conditions:
  - field: file_path
    operator: regex_match
    pattern: \.(ts|tsx|js|jsx)$
  - field: file_path
    operator: regex_not_match
    pattern: \.(spec|test|e2e-spec)\.(ts|tsx|js|jsx)$
  - field: file_path
    operator: regex_not_match
    pattern: /test/
  - field: new_text
    operator: regex_match
    pattern: (api[_-]?key|secret|password|token|credential)\s*[=:]\s*['"][^'"]{8,}['"]
---

🚫 **Hardcoded Secrets are FORBIDDEN!**

Use environment variables instead of hardcoded credentials.
Secrets in code are security vulnerabilities.
```
