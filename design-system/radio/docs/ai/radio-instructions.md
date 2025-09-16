# Translating from Tailwind

An example diff of a migration from Tailwind generated code to ADS generated code.

```diff
+import { Radio } from '@atlaskit/radio';

-<input
-  type="radio"
-  name="option"
-  value="option1"
-  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
-/>
+<Radio value="option1" label="Option 1" />
```
