# Prop guidance

- **appearance** - primary (main), default (secondary), subtle (tertiary), danger (destructive),
  warning (caution), discovery (new features)
- **spacing** - compact (tight spaces), default (standard), comfortable (generous)
- **isDisabled** - Use instead of removing the button
- **isLoading** - Show loading state during async operations

# Translating from Tailwind

An example diff of a migration from Tailwind generated code to ADS generated code.

```diff
+import Button from '@atlaskit/button/new';
-<button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded">
-  Create
-</button>
+<Button appearance="primary">Create</Button>

-<button className="bg-gray-200 hover:bg-gray-300 text-gray-900 font-medium py-2 px-4 rounded">
-  Cancel
-</button>
+<Button appearance="default">Cancel</Button>

-<button className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded">
-  Delete
-</button>
+<Button appearance="danger">Delete</Button>
```
