# Prop guidance

- **appearance** - success (positive), removed (negative), inprogress (ongoing), primary (neutral)
- **isBold** - Use for emphasis when needed
- **textColor** - Override default text color if required

# Translating from Tailwind

An example diff of a migration from Tailwind generated code to ADS generated code.

```diff
+import Lozenge from '@atlaskit/lozenge';

-<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
-  Success
-</span>
+<Lozenge appearance="success">Success</Lozenge>

-<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
-  Error
-</span>
+<Lozenge appearance="removed">Error</Lozenge>

-<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
-  In Progress
-</span>
+<Lozenge appearance="inprogress">In Progress</Lozenge>
```
