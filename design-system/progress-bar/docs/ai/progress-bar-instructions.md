# Prop guidance

- **value** - Progress value between 0 and 1 (0 = 0%, 1 = 100%)
- **isIndeterminate** - Show indeterminate loading state when true
- **appearance** - Visual style: default, success, inverse
- **ariaLabel** - Accessibility label for screen readers
- **testId** - Testing identifier

# Translating from Tailwind

An example diff of a migration from Tailwind generated code to ADS generated code.

```diff
+import ProgressBar from '@atlaskit/progress-bar';

-<div className="w-full bg-gray-200 rounded-full h-2.5">
-  <div
-    className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
-    style={{ width: '45%' }}
-  ></div>
-</div>
+<ProgressBar value={0.45} ariaLabel="Loading progress" />

-<div className="w-full bg-gray-200 rounded-full h-2.5">
-  <div className="bg-blue-600 h-2.5 rounded-full animate-pulse"></div>
-</div>
+<ProgressBar isIndeterminate ariaLabel="Loading" />

-<div className="w-full bg-gray-200 rounded-full h-2.5">
-  <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '100%' }}></div>
-</div>
+<ProgressBar value={1} appearance="success" ariaLabel="Complete" />
```
