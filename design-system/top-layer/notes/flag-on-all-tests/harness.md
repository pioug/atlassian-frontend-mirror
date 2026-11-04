# Harness: how each product forces the top-layer gates on

> Note: the branch that forced `platform-dst-top-layer` on in all tests was for evaluation only. It did not merge. This file records what it found.

Branch `areardon/top-layer-flag-on-all-tests`, rebased on `origin/master` `c5b599e3bc90a` (includes
#519022 light-dismiss). Gates forced: `platform-dst-top-layer` and `platform-dst-top-layer-tooltip`.
Not forced: `platform-dst-top-layer-spotlight` (user decision). VR untouched (user decision).

| Product | Jest | Browser | Opt out |
| --- | --- | --- | --- |
| platform | `build/configs/jest-config/jest-top-layer-flags-setup.js` (renamed from tooltip setup) | `DEFAULT_ON_TEST_FEATURE_FLAGS` in integration-testing `prepare-params.ts`; libra + renderer mounts spread it | Jest `failGate`/mock fg; PW `featureFlag: '<gate>=false'` |
| jira | `configureFullyRolledOutFlags` in `jest-setup-files-after-env-base.ts` (true in all Shadow Run phases) | `dev-tooling/packages/playwright/src/fixtures.ts` `visitExample`: story args `overrideFeatureFlags.<gate>:!true`; Workbench `?fg--<gate>=enabled` | Jest `failGate`; PW `overrideFeatureFlags.<gate>:!false` (Workbench: none) |
| confluence | `next/devtools/jest-config/src/jestTopLayerFlags.js` + `jestTopLayerPolyfill.js` (also 4 classic packages) | `e2e_statsig_gates.json` true (also feeds SSR JSON overrides) | `failGate`; e2e `test.use({ statsigGates })` |
| adminhub | `tests/jest/setup-after-env.ts` + gate mock `setDefaultGate` | `playwright-utils` `test-replacement.ts` + `helper.ts` `DEFAULT_ON_GATES` | `failGate`; `featureGatesContext` |
| help-center | `test/jest/setup/top-layer-flags.tsx`; widget `apps/widget/test/jest/setup/top-layer-flags.ts` | `test/playwright/utils/index.tsx` seeds PFF resolver; `featureGates` fixture option | `failGate` (`@atlassian/feature-flags-test-utils/mock-gates`); `test.use({ featureGates })` |
| townsquare | `packages/jest/src/top-layer-flags.ts` via `jest-preset.js` | e2e `packages/playwright/src/extends/test.ts` Statsig extension; CT template `packages/playwright-ct/src/template/index.tsx` | `setOverrides`/`failGate`; gates.json |
| store | `config/test/jest/setup/setup-feature-gates-mock.ts` checkGate default | `config/e2e/fixtures.ts` seeds `STATSIG_OVERRIDES` | checkGate mock; STATSIG_OVERRIDES |
| kitsune | already all-on (`ENABLE_PLATFORM_FF=true`) | `apps/feedback/src/tests/test-fixtures/visit-story.ts` args | `visitStory(..., { featureFlags })` |
| insights | `apps/frontend/jest.setup.ts` wraps `configurePlatformBooleanFeatureFlags` resolver | Pollinator `utils/check.ts` (local backend only; manual `default-insights` pipeline) | own resolver; `PollinatorCheck({ platformFeatureFlags })` |
| studio | `dev-tooling/jest-config/src/setup-after-env/top-layer-flags.ts` | visitExample via platform `prepareParams` | mock fg; `=false` |
| post-office | `local/jest/top-layer-flags.jest-setup.ts`; `top-layer.jest-setup.ts` for 5 configs with own setup | none in CI | mock fg |
| dev-agents | `dev-tooling/packages/jest/src/top-layer-flags.js` (+ polyfill, to-be-visible) | `devai-test-environment.ts` Statsig mock | `featureGates` |
| rovo-extension | chrome + frontend `src/test/top-layer-flags.ts`; new saved-prompts setup | not covered (staging + live Statsig) | mock fg |
| volt | `build/jest-transformer/top-layer-flags.ts`; to-be-visible moved after jest-dom | not in CI | mock fg |
| avp | `packages/testing/jest/src/test_flag_resolver.js` | Sandpit only on `*/AVP-*` branches | `injectable(fg)` |
| assets-app, litmus, fixtures | no change: no runner in CI reads the gates | | |

## Not covered (by design or not reachable)
- VR everywhere (user decision).
- Pollinators / feature tests / smoke tests against deployed staging or prod (live Statsig).
- platform Playwright CT (`yarn test:playwright-ct`) is not in CI.
- rovo-extension Playwright e2e/smoke (staging, live Statsig).
- dev-agents `home-page.spec.tsx` (no Statsig mock; title only).
- adminhub `footprint-page.spec.ts` writes overrides key itself; init-script order may drop defaults.
- jira Workbench specs: no per-test opt-out.

## Known harness risks
- insights Jest: `MutationObserver` stubbed in `beforeAll`; polyfill removal tracking gets the stub.
- store: `TeamTypesEditScreen.integration.tsx` and `App.test.tsx` install their own resolvers after
  first render, so the gates flip mid-test.
- jira: every Playwright story now goes through `WithFeatureFlagsKnobWrapper` (one null tick).
- jira `GATES=` / RANDOM_GATES can no longer turn the gate off (same as tooltip).
- Commits made with `--no-verify` (no node_modules for lint-staged); CI lint is the check.
