# Prop guidance

- **label** - Text label for the checkbox
- **value** - Value when checked
- **name** - Name attribute for form submission
- **isChecked** - Controlled checked state
- **defaultChecked** - Initial checked state (uncontrolled)
- **isDisabled** - Disable the checkbox
- **isInvalid** - Show error state
- **isIndeterminate** - Show indeterminate state
- **onChange** - Change handler function

# Translating from Tailwind

An example diff of a migration from Tailwind generated code to ADS generated code.

```diff
+import { Checkbox } from '@atlaskit/checkbox';

-<label className="flex items-center">
-  <input
-    type="checkbox"
-    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
-  />
-  <span className="ml-2 text-sm text-gray-700">Accept terms</span>
-</label>
+<Checkbox label="Accept terms" />

-<label className="flex items-center">
-  <input
-    type="checkbox"
-    checked
-    disabled
-    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded"
-  />
-  <span className="ml-2 text-sm text-gray-400">Disabled option</span>
-</label>
+<Checkbox label="Disabled option" isChecked isDisabled />
```
