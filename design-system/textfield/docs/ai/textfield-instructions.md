# Prop guidance

- **label** - Required descriptive label for accessibility
- **isRequired** - Mark field as mandatory
- **isInvalid** - Show validation error state
- **errorMessage** - Display error message when invalid
- **type** - Input type (text, email, password, number)

# Translating from Tailwind

An example diff of a migration from Tailwind generated code to ADS generated code.

```diff
+import TextField from '@atlaskit/textfield';

-<input
-  type="text"
-  placeholder="Enter text"
-  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
-/>
+<TextField label="Name" placeholder="Enter your name" />

-<div>
-  <label className="block text-sm font-medium text-gray-700 mb-1">
-    Name <span className="text-red-500">*</span>
-  </label>
-  <input
-    type="text"
-    required
-    className="w-full px-3 py-2 border border-red-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
-  />
-  <p className="mt-1 text-sm text-red-600">This field is required</p>
-</div>
+<TextField
+  label="Name"
+  isRequired
+  isInvalid
+  errorMessage="This field is required"
+/>
```
