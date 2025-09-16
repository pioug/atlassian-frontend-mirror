# Prop guidance

- **text** - Text content of the tag
- **appearance** - Visual style: default, rounded
- **color** - Custom color for the tag
- **isRemovable** - Allow tag to be removed (if supported)

# Translating from Tailwind

An example diff of a migration from Tailwind generated code to ADS generated code.

```diff
+import Tag from '@atlaskit/tag';

-<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
-  React
-</span>
+<Tag text="React" />

-<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
-  Completed
-</span>
+<Tag text="Completed" color="green" />

-<span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
-  Default
-</span>
+<Tag text="Default" appearance="default" />
```
