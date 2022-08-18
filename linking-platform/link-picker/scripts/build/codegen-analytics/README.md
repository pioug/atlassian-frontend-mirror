# Analytics Codegen

This codegen is designed to help generate basic typesafe utilities to implement analytics based on a `analytics.spec.yaml`.

This is very much work in progress and should evolve to support the spec as outlined in this [Analytics Defintion File](https://hello.atlassian.net/wiki/spaces/SMRT/pages/742668844/RFC+-+Analytic+Definition+File) spec.

Support needs to be built out for:

- Validating the spec file (JSON schema)
- Common section
- Context section
- Boolean attributes
- Enum attributes
- Array attributes
- Map attributes
- Required vs optional
- Allowing events to have no attributes (when calling utilities)
- Potentially generating different analytics utilities depending on team preference and goals/trade-offs
- Adding checks on postbuild to check the codegen is up to date with the schema

The goal of this codegen should be that this lives in its own mono repo package `@af/linking-analytics-codegen` so that it can be consumed by any of our packages.

The starting point for all analytics work should be defining attributes in the `analytics.spec.yaml` in the package root, codegen should be applied, then the generated code should be called to create the analytics payload in the project code.

The command to run this currently is `yarn workspace @atlaskit/link-picker run codegen-analytics` but I am not sure if this is the intended pattern or not.

For more info see https://developer.atlassian.com/cloud/framework/atlassian-frontend/development/codegen/
