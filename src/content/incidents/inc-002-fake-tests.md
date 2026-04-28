---
displayId: INC-002
date: "2026-04-04"
severity: crit
title: "4,800 fake tests; 200+ bugs found by QA they should have caught"
caughtBy: "QA harness · regression"
featured: true
cost: "4,800 tests deleted. 200+ bugs surfaced by QA that the test suite had certified clean."
what: |
  <p>Across the rebuild, the test suite reached 4,800 passing tests. None of them caught the 200+ bugs the QA harness later surfaced. A pattern audit revealed why: the tests asserted on mock return values. Procedures were called through unit-test wrappers that returned exactly the data the test then asserted against — a circular pattern that proves nothing about the real router. The test file imported the procedure but never imported the router it lived in. <code class="mono" style="font-size: 13px;">it()</code> blocks did not call <code class="mono" style="font-size: 13px;">caller</code> or <code class="mono" style="font-size: 13px;">createCaller()</code>. Names were vague ("works", "valid", "correct") so a reviewer skimming a green run could not tell what each test actually exercised.</p>
how: |
  <p>The QA harness — Playwright-driven, real browser, real database — kept finding behaviors the unit suite had reported clean. The gap between unit-pass and QA-fail forced an audit of the suite itself. Every it() block was inspected. 4,800 tests were deleted in one operation. The locked rules below were authored the same week to prevent a repeat at write-time.</p>
ruleKind: ast-grep
ruleDisplayId: require-caller-in-tests
ruleSeverity: error
ruleLockedOn: "2026-04-04"
ruleGloss: "Every it() block in router/integration tests must contain createCaller(), createTestCaller(), createUnauthenticatedCaller(), or caller.<domain>.<procedure>(). Companion rule require-router-import-in-tests forces the file to import a router at all. block-vague-test-names + block-empty-cast-in-tests fire at the keystroke."
ruleYaml: |
  id: require-caller-in-tests
  language: typescript
  severity: error
  message: |
    Test it() block has no caller invocation. A test that doesn't call
    the router via caller.<domain>.<procedure>() is asserting against a
    mock — circular testing that proves nothing about production code.
  files:
    - "**/*.test.ts"
    - "**/*.integration.test.ts"
  rule:
    pattern: it($DESC, $$$BODY)
    not:
      has:
        stopBy: end
        any:
          - pattern: createCaller($$$)
          - pattern: createTestCaller($$$)
          - pattern: createUnauthenticatedCaller($$$)
          - pattern: caller.$DOMAIN.$PROC($$$)
ruleCites:
  - require-router-import-in-tests
  - block-empty-cast-in-tests
  - block-vague-test-names
---
