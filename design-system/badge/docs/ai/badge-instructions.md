# Prop guidance

- **appearance** - added (positive), removed (negative), important (warning), primary (neutral),
  default (standard)
- **value** - For numeric badges (use max prop for overflow handling)
- **max** - Maximum value before showing overflow (e.g., "99+")

# Translating from Tailwind

An example diff of a migration from Tailwind generated code to ADS generated code.

```diff
+import Badge from '@atlaskit/badge';

-<span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
-  New
-</span>
+<Badge appearance="added">New</Badge>

-<span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
-  {count > 99 ? '99+' : count}
-</span>
+<Badge appearance="removed" value={count} max={99} />

-<span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded">
-  Warning
-</span>
+<Badge appearance="important">Warning</Badge>
```
