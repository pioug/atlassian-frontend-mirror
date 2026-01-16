# Lozenge Discovery to Tag with Feature Gate Codemod

This codemod migrates Lozenge components with `appearance="new"` or `appearance="discovery"` to Tag components behind the `platform-dst-lozenge-tag-badge-visual-uplifts` feature gate. It also includes discovery Lozenges with `isBold` or `isBold={true}`.

## What it does

### 1. Migrates "new" and "discovery" Lozenges to feature-gated Tags

```tsx
// Before
<Lozenge appearance="new">New Feature</Lozenge>

// After
{fg('platform-dst-lozenge-tag-badge-visual-uplifts') ? 
  <Tag text="New Feature" color="purple" /> : 
  <Lozenge appearance="new">New Feature</Lozenge>
}
```

### 2. Handles discovery Lozenges with isBold={true}

```tsx
// Before
<Lozenge appearance="discovery" isBold={true}>Bold Discovery</Lozenge>

// After
{fg('platform-dst-lozenge-tag-badge-visual-uplifts') ? 
  <Tag text="Bold Discovery" color="purple" /> : 
  <Lozenge appearance="discovery" isBold={true}>Bold Discovery</Lozenge>
}
```

### 3. Automatically adds necessary imports

The codemod intelligently adds imports only when needed:

- **Tag**: `import Tag from '@atlaskit/tag';` (if not already imported)
- **fg**: `import { fg } from '@atlassian/jira-feature-gating';` (if not already imported)

```tsx
// Before
import Lozenge from '@atlaskit/lozenge';

export default function App() {
  return <Lozenge appearance="new">New</Lozenge>;
}

// After
import Lozenge from '@atlaskit/lozenge';
import Tag from '@atlaskit/tag';
import { fg } from '@atlassian/jira-feature-gating';

export default function App() {
  return {fg('platform-dst-lozenge-tag-badge-visual-uplifts') ? 
    <Lozenge appearance="new">New</Lozenge> : 
    <Tag text="New" color="purple" />
  };
}
```

### 4. Preserves other props

All props except `appearance` and `isBold` are preserved on the Tag:

```tsx
// Before
<Lozenge appearance="new" testId="my-lozenge" maxWidth={150}>New</Lozenge>

// After
{fg('platform-dst-lozenge-tag-badge-visual-uplifts') ? 
  <Lozenge appearance="new" testId="my-lozenge" maxWidth={150}>New</Lozenge> : 
  <Tag text="New" color="purple" testId="my-lozenge" maxWidth={150} />
}
```

## What gets migrated

### ✅ Migrated:
- `<Lozenge appearance="new">`
- `<Lozenge appearance="discovery">`
- `<Lozenge appearance="discovery" isBold={true}>`
- `<Lozenge appearance="discovery" isBold>` (boolean prop)

### ❌ NOT Migrated:
- `<Lozenge appearance="success">` (other appearances)
- `<Lozenge appearance="default">` (other appearances)
- Any other Lozenge variants

## Usage

```bash
# From the platform directory
npx @atlaskit/codemod-cli --preset lozenge-discovery-to-tag-with-fg [target-path]

# Examples:
npx @atlaskit/codemod-cli --preset lozenge-discovery-to-tag-with-fg src/
npx @atlaskit/codemod-cli --preset lozenge-discovery-to-tag-with-fg packages/*/src
```

## Feature Gate Details

- **Feature Gate**: `platform-dst-lozenge-tag-badge-visual-uplifts`
- **When ON**: Displays the Tag component with `color="purple"` (new behavior)
- **When OFF**: Displays the original Lozenge component (old behavior)

## What you need to do after running the codemod

1. **Review the changes**: Ensure the feature gate wrapping is correct
2. **Test both states**: Test with feature gate ON and OFF
3. **Verify imports**: Check that fg and Tag imports are added correctly
4. **Update tests**: Update component tests to handle the conditional rendering

## Files that will be transformed

The codemod only transforms files that:
- Import Lozenge from `@atlaskit/lozenge`
- Use Lozenge with `appearance="new"` or `appearance="discovery"`

Files without matching Lozenges will remain unchanged.
