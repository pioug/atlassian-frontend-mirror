# Prop guidance

- **appearance** - Visual style: announcement, error, warning
- **isOpen** - Control visibility of the banner
- **icon** - Optional icon to accompany the message
- **children** - Banner content (text or JSX)

# Translating from Tailwind

An example diff of a migration from Tailwind generated code to ADS generated code.

```diff
+import Banner from '@atlaskit/banner';

-<div className="bg-blue-100 border-l-4 border-blue-500 p-4 mb-4">
-  <div className="flex">
-    <div className="ml-3">
-      <p className="text-sm text-blue-700">
-        Important system announcement
-      </p>
-    </div>
-  </div>
-</div>
+<Banner appearance="announcement" isOpen>
+  Important system announcement
+</Banner>

-<div className="bg-red-100 border-l-4 border-red-500 p-4 mb-4">
-  <div className="flex">
-    <div className="ml-3">
-      <p className="text-sm text-red-700">
-        Critical error occurred
-      </p>
-    </div>
-  </div>
-</div>
+<Banner appearance="error" isOpen>
+  Critical error occurred
+</Banner>
```
