# Audit Decision Log

> Canonical record of decisions made during code and migration audits.
> Future audits should check this file before raising issues.

---

## 2026-03-17 Deep Audit

### Top-Layer Package Decisions

#### 1. Along-axis offset — Dropped
**Decision:** Drop along-axis offset entirely. Mark the `offset` prop as `@private` and `@deprecated` in migration adapters. CSS Anchor Positioning does not natively support along-axis offset, and we are leaning into the platform.
**Action:** Document in migration notes and JSDoc. Consumers using non-zero `offset[0]` values should find alternative layouts.

#### 2. DialogScrollLock stacking — Innermost modal only
**Decision:** Only the innermost modal (stackIndex === 0) should enable `DialogScrollLock`. Modal-dialog already tracks stack depth, so this is a modal-dialog concern — not a top-layer concern. `DialogScrollLock` itself remains a clean, generic component.
**Action:** Wire in `@atlaskit/modal-dialog` using existing `stackIndex`.

#### 3. Width fallback feature detection — Fixed
**Decision:** Changed `CSS.supports('anchor-name', '--a')` to `CSS.supports('width', 'anchor-size(width)')` in `popup-content.tsx`. This correctly detects `anchor-size()` support rather than `anchor-name` support, ensuring the JS fallback fires in browsers that support anchor positioning but not anchor sizing.
**Action:** Code change applied.

#### 4. `aria-controls` in standalone `Popup.Content` mode — Consumer responsibility
**Decision:** When tooltip/spotlight use `Popup.Content` directly (without `Popup.Trigger`), they own the trigger lifecycle and therefore own the `aria-controls` wiring. This is a consumer-level concern, not a top-layer concern. Each standalone consumer should wire `aria-controls` in their own migration code.
**Rationale:** Each standalone use case has its own trigger lifecycle (hover for tooltip, programmatic for spotlight). A generic solution would be either too simple or too opinionated.

#### 5. `popover="hint"` fallback to `"auto"` — Accepted with documentation
**Decision:** Keep `"auto"` as the fallback when `popover="hint"` is unsupported. Document the behavioral difference prominently: `"auto"` participates in the auto-dismiss stack (will close other auto popovers), while `"hint"` does not. This only affects browsers without `popover="hint"` support, which is a shrinking set.
**Action:** Comment added in `popover.tsx`.

#### 6. `returnFocusRef` — Override native focus restoration in `onClose`
**Decision:** Focus restoration is handled natively by the browser's Popover API (see notes/architecture/focus.md). For `returnFocusRef`, the consumer should redirect focus via `requestAnimationFrame` in the `onClose` callback to override the browser's default restoration. No special top-layer API is needed — the consumer owns the focus redirect.
**Action:** Wire in `@atlaskit/modal-dialog`.

#### 7. `ensurePresetStyles` no cleanup — Accepted
**Decision:** The append-only `<style>` injection and module-scoped `Set` are accepted as-is. The bounded preset count (~5 presets) makes cleanup unnecessary. Future Compiled solution will handle style injection natively.
**Action:** Decision comment added in code.

#### 8. `prefersReducedMotion` — Cached via `once`
**Decision:** Wrap in `once` from `@atlaskit/ds-lib/once`. Locks the preference at first call — a page refresh picks up changes. This avoids calling `matchMedia` on every render. Toggling reduced-motion mid-session is extremely rare; a page refresh is a reasonable expectation.
**Action:** Code change applied.

#### 9. `useId()` colon stripping via regex — Accepted
**Decision:** Keep `id.replace(/:/g, '')`. `replaceAll` is not available in our supported browser matrix. Comment added explaining the constraint.
**Action:** Comments added in `popover.tsx` and `popup.tsx`.

#### 10. Controlled `isOpen` does not survive light-dismiss — By design
**Decision:** Leave as-is. The DOM owns the dismiss for `popover="auto"`. Consumers must respond to `onClose` by setting `isOpen=false`. Existing documentation is sufficient. We tried adding dev-mode warnings and it was a poor experience.

---

### Modal-Dialog Migration Decisions

#### 11. Modal `height` prop — Needs VR verification
**Decision:** Verify with VR tests whether the height prop is actually broken. Significant work was done to get this working — it may already be resolved.
**Action:** Run VR tests to validate.

#### 12. Modal `width: "100%"` — Needs VR verification
**Decision:** Verify with VR tests whether this is actually broken. May have been resolved by subsequent work.
**Action:** Run VR tests to validate.

#### 13. Modal tooltip mispositioning inside `<dialog>` — Accepted
**Decision:** This is a transitional mixed-stack issue. When tooltip also migrates to top-layer, CSS Anchor Positioning handles the coordinate system correctly. No fix needed — resolved by migration order.

#### 14. Modal `focusLockAllowlist` — Deprecated
**Decision:** Mark as `@private` and `@deprecated`. Native `<dialog>.showModal()` makes everything outside inert — there is no allowlist mechanism. This is the correct accessibility behavior per WCAG (external content must not be discoverable when dialog is modal). Investigate production usage to confirm use cases are resolved by the new stack.
**Action:** Deprecate prop, add explanation, investigate usage.

#### 15. Modal `autoFocus` prop — Deprecated
**Decision:** Deprecate, mark as `@private`. Native `showModal()` always moves focus into the dialog — this is correct per WCAG 2.4.3. `autoFocus={false}` on a modal was an anti-pattern that allowed focus to stay on background content.
**Action:** Deprecate prop, add explanation.

#### 16. Portal-based select dropdowns invisible (Bug #9) — Ignored
**Decision:** This will be resolved by migrating `@atlaskit/select` to use top-layer. The select dropdown will then render in the top layer and won't be affected by `<dialog>` inertness. No workaround needed.

---

### Other Migration Decisions

#### 17. `@atlaskit/select` test coverage — Deferred
**Decision:** Tests come with the implementation. The migration plan doc (`select-migration.md`) exists but implementation isn't complete. Tests will be written alongside the implementation.

#### 18. `@atlaskit/inline-message` `fg()` crash — Fix needed
**Decision:** Fix the pre-existing `fg('add-max-width-and-height-to-inline-message')` import issue so unit tests can run. This is a test infrastructure problem, not a top-layer issue.
**Action:** Fix the `fg()` import.

#### 19. `onOpenChange` event is `null` on light-dismiss close — Accepted
**Decision:** Leave as-is. The `OnOpenChangeArgs.event` type already allows `null` and the JSDoc already documents it: "The value will be `null` when the dropdown is closed programmatically and has no corresponding event." The top-layer light-dismiss close is analogous — the browser dismissed it, not user code.

#### 20. Unit tests for inline-dialog / avatar-group — Not needed
**Decision:** Browser tests provide sufficient coverage. As long as browser tests cover component functionality, dedicated unit tests for the top-layer path are not required.

#### 21. Avatar-group disabled item skipping — Accepted improvement
**Decision:** The top-layer path has a broader (more correct) definition of "not focusable". It additionally skips items with `aria-disabled="true"`, `tabindex="-1"`, and `aria-hidden="true"`. This is correct per WAI-ARIA — these items should not be focus targets during arrow navigation. The real-world impact is negligible since avatar items use HTML `disabled`, not `aria-disabled`.
**Action:** Document in migration notes as an intentional improvement.
