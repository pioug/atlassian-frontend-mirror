# Prop guidance

- **id** - Unique identifier for the toggle
- **label** - Descriptive label for the toggle
- **isChecked** - Current checked state
- **onChange** - Handler called when toggle state changes
- **isDisabled** - Disable the toggle

# Translating from Tailwind

An example diff of a migration from Tailwind generated code to ADS generated code.

```diff
+import Toggle from '@atlaskit/toggle';

-<label className="relative inline-flex items-center cursor-pointer">
-  <input type="checkbox" className="sr-only peer" />
-  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
-  <span className="ml-3 text-sm font-medium text-gray-900">Enable notifications</span>
-</label>
+<Toggle
+  id="notifications"
+  label="Enable notifications"
+  isChecked={isEnabled}
+  onChange={setIsEnabled}
+/>

-<label className="relative inline-flex items-center cursor-pointer opacity-50">
-  <input type="checkbox" disabled className="sr-only peer" />
-  <div className="w-11 h-6 bg-gray-200 rounded-full"></div>
-  <span className="ml-3 text-sm font-medium text-gray-400">Disabled toggle</span>
-</label>
+<Toggle
+  id="disabled"
+  label="Disabled toggle"
+  isDisabled
+/>
```
