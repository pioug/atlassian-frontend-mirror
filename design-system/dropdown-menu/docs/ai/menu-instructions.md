# Prop guidance

- **trigger** - Text or custom component that opens the dropdown
- **isOpen** - Control dropdown open state (optional)
- **onOpenChange** - Handle open/close state changes
- **placement** - Position relative to trigger (top, bottom, left, right)

# Translating from Tailwind

An example diff of a migration from Tailwind generated code to ADS generated code.

```diff
+import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';

-<div className="relative">
-  <button
-    onClick={() => setIsOpen(!isOpen)}
-    className="bg-white border border-gray-300 rounded-md px-4 py-2 flex items-center justify-between"
-  >
-    Options
-    <ChevronDown className="w-4 h-4 ml-2" />
-  </button>
-  {isOpen && (
-    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
-      <div className="py-1">
-        <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Edit</a>
-        <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Delete</a>
-      </div>
-    </div>
-  )}
-</div>
+<DropdownMenu trigger="Options">
+  <DropdownItemGroup>
+    <DropdownItem>Edit</DropdownItem>
+    <DropdownItem>Delete</DropdownItem>
+  </DropdownItemGroup>
+</DropdownMenu>
```
