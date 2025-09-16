# Translating from Tailwind

An example diff of a migration from Tailwind generated code to ADS generated code.

```diff
+import { RadioGroup } from '@atlaskit/radio';

-<div className="space-y-2">
-  <label className="flex items-center">
-    <input type="radio" name="size" value="small" className="w-4 h-4" />
-    <span className="ml-2">Small</span>
-  </label>
-  <label className="flex items-center">
-    <input type="radio" name="size" value="medium" className="w-4 h-4" />
-    <span className="ml-2">Medium</span>
-  </label>
-</div>
+const options = [
+	 { name: "small", value: "small", label: "Small" },
+	 { name: "medium", value: "medium", label: "Medium" },
+]
+<RadioGroup name="size" options={options} />
```
