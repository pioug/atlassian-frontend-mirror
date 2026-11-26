# ADS AI tooling content

Accessibility, internationalization and migration guidance shared by ADS MCP and the ADS skill, plus
the icon list used by ADS MCP and Platform CLI. ADS MCP exposes its existing guidance entry points
from this package. The icon packages supply the underlying icon metadata.

Add migrations in `src/migrations/migrations/` and register them in
`src/migrations/migration-registry.tsx`. When guidance changes need to ship through ADS MCP and the
Atlas ADS CLI, include an ADS MCP changeset. The release plan also bumps ADS CLI because it pins the
MCP workspace version.
