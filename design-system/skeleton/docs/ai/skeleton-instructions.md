# Prop guidance

- **height** - Height of the skeleton (string or number)
- **width** - Width of the skeleton (string or number)
- **isShimmering** - Enable shimmer animation effect (default: true)

# Translating from Tailwind

An example diff of a migration from Tailwind generated code to ADS generated code.

```diff
+import Skeleton from '@atlaskit/skeleton';

-<div className="animate-pulse">
-  <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
-  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
-</div>
+<div>
+  <Skeleton height="16px" width="75%" />
+  <Skeleton height="16px" width="50%" />
+</div>

-<div className="animate-pulse">
-  <div className="h-48 bg-gray-300 rounded mb-4"></div>
-  <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
-  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
-</div>
+<div>
+  <Skeleton height="192px" width="100%" />
+  <Skeleton height="16px" width="75%" />
+  <Skeleton height="16px" width="50%" />
+</div>
```
