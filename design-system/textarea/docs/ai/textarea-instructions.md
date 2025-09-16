# Prop guidance

- **placeholder** - Placeholder text when empty
- **resize** - Resize behavior: auto, vertical, horizontal, none
- **maxHeight** - Maximum height before scrolling
- **name** - Name attribute for form submission
- **defaultValue** - Initial value for uncontrolled component
- **isDisabled** - Disable the textarea
- **isRequired** - Mark field as required

# Translating from Tailwind

An example diff of a migration from Tailwind generated code to ADS generated code.

```diff
+import TextArea from '@atlaskit/textarea';

-<textarea
-  placeholder="Enter your message"
-  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
-  rows={4}
-/>
+<TextArea placeholder="Enter your message" resize="none" />

-<div>
-  <label className="block text-sm font-medium text-gray-700 mb-1">
-    Description <span className="text-red-500">*</span>
-  </label>
-  <textarea
-    required
-    className="w-full px-3 py-2 border border-red-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
-    rows={4}
-  />
-  <p className="mt-1 text-sm text-red-600">This field is required</p>
-</div>
+<TextArea
+  label="Description"
+  isRequired
+  isInvalid
+  errorMessage="This field is required"
+/>
```
