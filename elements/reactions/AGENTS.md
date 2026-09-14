# Reactions Package

## Scope

This guide applies to work under `platform/packages/elements/reactions/**`.

This package is a shared platform for interacting with Reactions and is used by multiple products.

## Coding standards

- ⛔ ** Avoid adding product specific behaviour to the components **. As this is a platform
  component we should prefer that users of the platform component control how the components behave.
- A11Y fixes should be made in a platform component manner

## Feature gating

- Changes should be behind a feature gate/experiment
- Target apps for the gate/experiment should include: `confluence_web`, `jira_web`, `atlas_web`,
  `mercury_frontend_web`, `post-office_web`
