# Prop guidance

- **selected** - Index of the currently selected tab
- **onChange** - Handler called when tab selection changes
- **children** - Tab content (TabList and TabPanel components)

# Translating from Tailwind

An example diff of a migration from Tailwind generated code to ADS generated code.

```diff
+import Tabs, { Tab, TabList, TabPanel } from '@atlaskit/tabs';

-<div>
-  <div className="border-b border-gray-200">
-    <nav className="-mb-px flex space-x-8">
-      <button className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm">
-        Tab 1
-      </button>
-      <button className="border-blue-500 text-blue-600 whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm">
-        Tab 2
-      </button>
-    </nav>
-  </div>
-  <div className="py-4">
-    <div>Tab 2 content</div>
-  </div>
-</div>
+<Tabs selected={1} onChange={(index) => setSelectedTab(index)}>
+  <TabList>
+    <Tab>Tab 1</Tab>
+    <Tab>Tab 2</Tab>
+  </TabList>
+  <TabPanel>Tab 1 content</TabPanel>
+  <TabPanel>Tab 2 content</TabPanel>
+</Tabs>
```
