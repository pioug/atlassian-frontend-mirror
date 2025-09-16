# SplitButton requires exactly two children

1. `Button` component (the primary action)
2. `DropdownMenu` component (the secondary actions)

```tsx
// ❌ WRONG - Missing Button and DropdownMenu children
<SplitButton text="Add Item" appearance="primary" />

// ❌ WRONG - Using text prop instead of Button component
<SplitButton appearance="primary">
  <span>Add Item</span>
</SplitButton>

// ❌ WRONG - Missing DropdownMenu
<SplitButton appearance="primary">
  <Button>Add Item</Button>
</SplitButton>
```

# Translating from Tailwind

An example diff of a migration from Tailwind generated code to ADS generated code.

```diff
+import Button, { IconButton, SplitButton } from '@atlaskit/button/new';
+import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';
+import ChevronDownIcon from '@atlaskit/icon/core/chevron-down';
-<div className="inline-flex rounded-md shadow-sm">
-  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm font-medium rounded-l-md">
-    Save
-  </button>
-  <button className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-2 text-sm font-medium rounded-r-md border-l border-blue-500">
-    <ChevronDownIcon className="w-4 h-4" />
-  </button>
-</div>
+<SplitButton appearance="primary">
+  <Button>Save</Button>
+  <DropdownMenu<HTMLButtonElement>
+    shouldRenderToParent
+    trigger={({ triggerRef, ...triggerProps }) => (
+      <IconButton
+        ref={triggerRef}
+        {...triggerProps}
+        icon={ChevronDownIcon}
+        label="More save options"
+      />
+    )}
+  >
+    <DropdownItemGroup>
+      <DropdownItem>Save and continue</DropdownItem>
+      <DropdownItem>Save as draft</DropdownItem>
+    </DropdownItemGroup>
+  </DropdownMenu>
+</SplitButton>
```
