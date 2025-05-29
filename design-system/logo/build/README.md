# Logo Examples and Documentation Generator

This directory contains the code generation system for the logo package's examples and
documentation.

## Overview

The generator creates:

1. Individual examples for each logo in the package, matching the existing example structure
2. Documentation for all logos with feature flag information

## Usage

To generate/update examples and documentation:

```bash
yarn generate:examples
```

## Structure

The generator:

1. Uses the logo categories from `src/logo-config.ts`
2. Generates logo examples in `examples/constellation/`
3. Generates product logo documentation in `constellation/index/product-logos.mdx`

## Generated Examples

Each generated logo example:

- Uses the standard table layout with Logo and Icon columns
- Includes proper styling (width: 415px for logo column)
- Shows both logo and icon variants where applicable
- Uses the brand appearance by default

## Documentation Structure

The generated documentation:

1. Groups logos by category (legacy-only, shared, new-only)
2. Includes feature flag information for shared logos
3. Provides clear messaging about implementation status

Note: The size, appearance, and other general examples are maintained manually in their respective
files.

## Maintenance

When adding new logos:

1. Add them to the appropriate category in `src/logo-config.ts`
2. Run `yarn generate:examples` to generate the example and update docs
3. Review the generated files
4. Update any manual examples if needed

## Feature Flag Support

The documentation includes clear information about the feature flag behavior for shared logos. Each
shared logo example includes a note about the feature flag dependency.
