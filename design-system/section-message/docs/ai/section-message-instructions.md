# Prop guidance

- **appearance** - information (general), warning (caution), error (problems), success (positive),
  discovery (new features)
- **title** - Descriptive title for the message
- **actions** - Optional action buttons for next steps

# Translating from Tailwind

An example diff of a migration from Tailwind generated code to ADS generated code.

```diff
+import SectionMessage from '@atlaskit/section-message';

-<div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
-  <div className="flex">
-    <div className="flex-shrink-0">
-      <Info className="h-5 w-5 text-blue-400" />
-    </div>
-    <div className="ml-3">
-      <h3 className="text-sm font-medium text-blue-800">Information</h3>
-      <div className="mt-2 text-sm text-blue-700">
-        <p>This is an informational message.</p>
-      </div>
-    </div>
-  </div>
-</div>
+<SectionMessage appearance="information" title="Information">
+  This is an informational message.
+</SectionMessage>

-<div className="bg-red-50 border border-red-200 rounded-lg p-4">
-  <div className="flex">
-    <div className="flex-shrink-0">
-      <ExclamationTriangle className="h-5 w-5 text-red-400" />
-    </div>
-    <div className="ml-3">
-      <h3 className="text-sm font-medium text-red-800">Error</h3>
-      <div className="mt-2 text-sm text-red-700">
-        <p>Something went wrong.</p>
-      </div>
-    </div>
-  </div>
-</div>
+<SectionMessage appearance="error" title="Error">
+  Something went wrong.
+</SectionMessage>
```
