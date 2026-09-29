# Top layer: the relative wide guard

**Status:** Compiles everywhere we can run locally. **Not adopted**, because the local recipe cannot
reproduce the one build defect that matters. Adoption is gated on a real-build probe, described
below.

## The problem it would solve

The wide guard the transform emits today is absolute:

```
& div:not(:where([popover], dialog, [popover] *, dialog *))
```

`[popover] *` and `dialog *` mean "not inside any surface", not "not inside a surface that sits
inside `&`". So when the element carrying `&` is itself rendered inside a Modal or a popover, every
`div` under it is `dialog *` or `[popover] *`, and the rule stops applying to the component's own
content. Consumer content inside a surface is the common case, so this is a real cost. It was raised
in review on PR 467939, where the reviewer's tooling suggested guarding relative to the subject.

## The form

In a nested style object or template, the guard can name `&` inside `:where()`:

```
& div:not(:where([popover], dialog, & [popover] *, & dialog *))
```

Compiled substitutes every `&` with the generated atomic class, so this emits

```
._c div:not(:where([popover], dialog, ._c [popover] *, ._c dialog *))
```

which excludes the host and every host nested under `._c`, and nothing else. A component rendered
inside a Modal keeps matching its own divs. Specificity is unchanged: `:where()` is (0,0,0) whatever
it contains. At global scope there is no `&`, so a `.css` file would keep the absolute form.

## What was measured, 2026-09-21

The probe script is not kept in the tree; it was a throwaway harness, and the result below is the
part worth keeping. It ran one fixture through `@compiled/babel-plugin` 3.0.2 in runtime mode and in
`extract: true` mode with `@compiled/babel-plugin-strip-runtime` 2.0.0, the same plugin pair
`@compiled/parcel-transformer` 1.0.2 configures, then through `@compiled/parcel-optimizer` 0.6.9's
`buildDeterministicStylesheet`, which is the last step that touches the CSS text before `<style>`
injection or the `compiled.*.css` file. Reproducing it means driving that plugin pair and that
optimizer call directly; note that `node` needs `OPENSSL_CONF=/dev/null` here.

| Rule in the fixture                                      | Runtime mode | Extract mode | Optimizer path |
| -------------------------------------------------------- | ------------ | ------------ | -------------- |
| relative wide guard, `css()` key                         | present      | present      | present        |
| relative wide guard, `cssMap` key                        | present      | present      | present        |
| relative wide guard, `styled` template (stylis)          | present      | present      | present        |
| absolute wide guard (what ships today)                   | present      | present      | present        |
| `&:nth-last-child(n+2 of S)::after` (known-drop control) | present      | **present**  | **present**    |
| `&:not(:last-child)::after` (plain control)              | present      | present      | present        |

Emitted text for the `css()` key in extract mode, verbatim. The guard then also listed the
non-rendered tags, which it no longer does:

```
._1o9e5scu div:not(:where([popover],dialog,._1o9e5scu [popover] *,._1o9e5scu dialog *,style,script,template,link,noscript)){color:red}
```

The `&` inside `:where()` is substituted in every authoring form, in both modes, and the optimizer's
sort keeps the rule intact.

## Why this does not clear the gate

The known-drop control survived. A real Atlaspack build of `@atlaskit/breadcrumbs` is measured to
emit the atomic class for `&:nth-last-child(n+2 of S)::after` and omit its CSS rule
([the `of S` forms do not survive the build](./top-layer-unsafe-selectors.md#the-of-s-forms-do-not-survive-the-build)).
This recipe keeps that rule, so whatever drops it in a real build sits outside the babel plugin, the
strip-runtime plugin and the optimizer's stylesheet builder, and this recipe cannot see it. A
"present" for the relative guard here therefore says nothing about a real build.

The relative form is ordinary CSS once `&` is substituted, and the absolute form with the same
`[popover] *` terms already extracts in production. The risk is low. It is not zero, and the failure
mode is the worst one available: a sweep that deletes working styling across the monorepo with no
build error. The same reasoning withdrew the `of S` forms.

## What adopting it needs

1. The VR probe that caught the `of S` drop, pointed at the relative form: render a component with a
   `& div` rule guarded relatively into a Gemini VR fixture, once inside a `<dialog>` and once with
   a popover nested under it, and read the matching rule count and computed style off the page. The
   `of S` drop was caught exactly this way: a rule whose class is emitted but whose CSS is absent
   shows up as a matching-rule count of zero, not as a build error.
2. Two browser fixtures: a component inside a `<dialog>` whose `& div` rule must still match its own
   divs, and a popover nested inside the component whose internals must not match.
3. Then, in `rewrite-selector.tsx`: emit the relative list at `nested` scope wherever `WIDE_GUARD`
   is used, keep the absolute list at `global` scope, and teach `isCompoundGuarded` and
   `planPreExistingGuards` to accept either spelling as complete, so hand-written absolute guards
   are not churned. Re-pin the transform tests and the rule fixtures whose expected output carries a
   nested wide guard, and update the README's guard-form section and the changeset.

Until step 1 passes, the transform emits the absolute form and the README's Known limitations entry
says so.
