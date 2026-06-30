# Token Docs and Examples

When you add a new public token, you must update the **hand-authored** docs and examples in addition
to the generated artifacts. Generated docs _data_ alone (see below) does not make a token visible or
well-documented for humans.

## Generated docs data vs. hand-authored docs

| Kind                         | Location                                                                                                      | How it's produced                | Your action                                                                                               |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------- | -------------------------------- | --------------------------------------------------------------------------------------------------------- |
| Generated docs data          | `platform/packages/design-system/tokens/token-metadata.codegen.tsx` and other `@codegen`/`SignedSource` files | `yarn build tokens` (full build) | Do **not** hand-edit; regenerate from source. Feeds `@atlaskit/ads-mcp` and the hosted `llms-tokens.txt`. |
| Hosted reference table       | `atlassian.design/components/tokens` (external)                                                               | Published from token metadata    | Nothing to edit in-repo. `docs/1-tokens-reference.tsx` is just a stub linking here.                       |
| Hand-authored examples       | `platform/packages/design-system/tokens/examples/*`                                                           | Written by contributors          | **Add/update** an example demonstrating the new token.                                                    |
| Hand-authored usage guidance | `platform/packages/design-system/tokens/docs/ai/*`                                                            | Written by contributors          | **Update** the matching per-category instruction file.                                                    |

## Examples to update by token category

The `tokens/examples/` directory contains numbered example modules. Match the new token to the most
relevant one (and any matching VR example):

| Token category                                 | Example file(s)                                                   |
| ---------------------------------------------- | ----------------------------------------------------------------- |
| Elevation / surface (incl. interaction states) | `examples/2-elevations.tsx`, `examples/10-current-surface-vr.tsx` |
| Color roles (text, background, border)         | `examples/0-color-roles.tsx`, `examples/3-color-pairs.tsx`        |
| Color accents                                  | `examples/1-color-accents.tsx`                                    |
| Spacing                                        | `examples/4-spacing-vr.tsx`                                       |
| Typography                                     | `examples/20-typography.tsx`, `examples/5-typography-vr.tsx`      |
| Shape / radius                                 | `examples/8-shape-vr.tsx`                                         |

Notes:

- Files ending in `-vr.tsx` are **visual-regression** examples. Adding or changing a token's visual
  appearance usually means updating one of these so VR coverage includes the new token.
- Examples import the real token via `token('<token.name>')` from `@atlaskit/tokens`, so they only
  work after the source token exists and codegen has run.
- If no existing example fits the new token, extend the closest example rather than leaving the
  token undemonstrated.

## Usage guidance to update by category

`tokens/docs/ai/` holds per-category usage instructions consumed by AI tooling and contributors:

- `color-instructions.md` — color tokens (text, background, border, accents, surfaces).
- `spacing-instructions.md` — spacing tokens.
- `border-radius-instructions.md` — radius/shape tokens.

When the new token belongs to one of these categories, add a short, token-specific note describing
intended use and when **not** to use it. Avoid copying the generic boilerplate `usage` string from a
sibling token — guidance should be specific to the new token's role (e.g. container hover vs. press
surfaces).

## Checklist

- [ ] New token is demonstrated in a relevant `tokens/examples/*` file.
- [ ] A VR example covers the token if it has a distinct visual appearance.
- [ ] Per-category `docs/ai/*` guidance updated with token-specific (not boilerplate) usage notes.
- [ ] Generated docs data (`token-metadata.codegen.tsx`) regenerated via the full
      `yarn build tokens`, not hand-edited.
