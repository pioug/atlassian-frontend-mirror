# Prop guidance

- **icon** - The icon component to display
- **label** - Required descriptive label for accessibility
- **appearance** - Color appearance (blue, green, red, etc.)
- **shape** - Circle or square tile shape
- **size** - Tile size in pixels (16, 24, 32, 40, 48)

# Translating from Tailwind

An example diff of a migration from Tailwind generated code to ADS generated code.

```diff
+import { IconTile } from '@atlaskit/icon';
+import AddIcon from '@atlaskit/icon/core/add';
+import CheckMarkIcon from '@atlaskit/icon/core/check-mark';

-<div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
-  <AddIcon className="w-4 h-4 text-white" />
-</div>
+<IconTile icon={AddIcon} label="Add icon" appearance="blue" shape="circle" size="24" />

-<div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
-  <CheckIcon className="w-5 h-5 text-white" />
-</div>
+<IconTile icon={CheckMarkIcon} label="Success icon" appearance="green" shape="square" size="32" />
```
