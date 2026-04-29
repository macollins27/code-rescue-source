---
displayId: INC-002
date: "2026-04-04"
severity: crit
title: "4,800 fake tests; 200+ bugs found by QA they should have caught"
caughtBy: "QA harness · regression"
featured: true
cost: "4,800 tests deleted. 200+ bugs surfaced by QA that the test suite had certified clean."
what: |
  <p>Across the rebuild, the test suite reached 4,800 passing tests. None of them caught the 200+ bugs the QA harness later surfaced. The symptom was visible in the test code: every <code class="mono" style="font-size: 13px;">it()</code> block asserted on a mock's configured return value rather than on the production code's behavior. Procedures were called through unit-test wrappers that returned exactly the data the test then asserted against — circular by construction. Test files imported the procedure under test but never imported the router it lived in. <code class="mono" style="font-size: 13px;">caller</code> and <code class="mono" style="font-size: 13px;">createCaller()</code> were absent. Names were vague ("works", "valid", "correct") so a reviewer skimming a green run could not tell what each test actually exercised.</p>
  <p>The cause was upstream of the test code. The specifications the tests had been authored from did not carry the assertions through. With nothing in the spec to assert against, the test author had no anchor — and fell back to the only thing nearby: the mock's own configured return value. The fake-test failure mode was a property of the specification, not of the test author or the AI agent producing the tests. This is the failure mode that pervades AI-augmented test authoring at the industry level. It is not a discipline problem.</p>
how: |
  <p>The QA harness — Playwright-driven, real browser, real database — kept finding behaviors the unit suite had reported clean. The gap between unit-pass and QA-fail forced an audit of the suite. 4,800 tests were deleted in one operation. The structural fix was a methodology shift: every domain rule from this point forward would carry its testable assertion verbatim — exact error code, exact message, exact role check, exact behavior — so that an agent writing the test from the rule has the assertion already in hand and falling back to a mock returns no useful information. The locked rules below (<code class="mono" style="font-size: 13px;">require-caller-in-tests</code>, <code class="mono" style="font-size: 13px;">require-router-import-in-tests</code>, <code class="mono" style="font-size: 13px;">block-vague-test-names</code>, <code class="mono" style="font-size: 13px;">block-empty-cast-in-tests</code>) are belt-and-suspenders enforcement at write-time and gate-time. They block the symptom. The methodology shift blocks the root cause.</p>
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
