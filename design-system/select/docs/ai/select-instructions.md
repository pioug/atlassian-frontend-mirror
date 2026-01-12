# Prop guidance

- **options** - Array of option objects with label and value
- **isMulti** - Enable multiple selection
- **isSearchable** - Enable search functionality
- **value** - Currently selected option(s)

# Translating from Tailwind

An example diff of a migration from Tailwind generated code to ADS generated code.

```diff
+import Select from '@atlaskit/select';

-<select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
-  <option value="">Choose an option</option>
-  <option value="option1">Option 1</option>
-  <option value="option2">Option 2</option>
-  <option value="option3">Option 3</option>
-</select>
+<Select
+  placeholder=""
+  options={[
+    { label: 'Option 1', value: 'option1' },
+    { label: 'Option 2', value: 'option2' },
+    { label: 'Option 3', value: 'option3' }
+  ]}
+/>

-<div className="relative">
-  <input
-    type="text"
-    placeholder=""
-    className="w-full px-3 py-2 border border-gray-300 rounded-md"
-  />
-  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
-    {/* Complex dropdown implementation */}
-  </div>
-</div>
+<Select
+  placeholder=""
+  isSearchable
+  options={options}
+/>
```
