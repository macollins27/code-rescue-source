---
displayId: block-inner-html-xss
area: security
action: warn
event: "file (Write|Edit on src/**/*.ts/.tsx/.js/.jsx)"
lockedOn: "2026-02-15"
origin: "OWASP A7: Cross-Site Scripting; direct DOM manipulation with unsanitized content"
verbatim: true
gloss: "Block innerHTML, outerHTML, document.write, dangerouslySetInnerHTML in source files. Use textContent for plain text, DOMPurify.sanitize() for HTML when truly required."
cites: []
---

```markdown
---
name: block-inner-html-xss
enabled: true
event: file
tool_matcher: Write|Edit
action: warn
conditions:
  - field: file_path
    operator: regex_match
    pattern: src/.*\.(ts|tsx|js|jsx)$
  - field: new_text
    operator: regex_match
    pattern: (innerHTML\s*=|outerHTML\s*=|document\.write\s*\(|dangerouslySetInnerHTML)
---

**BLOCKED: XSS vector detected**

Direct DOM manipulation with unsanitized content is an XSS vulnerability (OWASP A7: Cross-Site Scripting).

Detected one of:
- `innerHTML =` — injects raw HTML
- `outerHTML =` — replaces element with raw HTML
- `document.write()` — writes raw HTML to document
- `dangerouslySetInnerHTML` — React raw HTML injection

**Fix:** Use safe alternatives:

\`\`\`typescript
// BAD — XSS vulnerable
element.innerHTML = userInput;

// GOOD — safe text content
element.textContent = userInput;

// GOOD — sanitized HTML (if HTML is required)
import DOMPurify from 'dompurify';
element.innerHTML = DOMPurify.sanitize(userInput);
\`\`\`
```
