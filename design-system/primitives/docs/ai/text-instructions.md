# Prop guidance

- **size** - small (12px), medium (14px), large (16px), xlarge (18px)
- **weight** - light, regular, medium, semibold, bold
- **color** - Use design tokens (color.text, color.text.subtle, etc.)
- **align** - start, center, end, justify

# Translating from Tailwind

An example diff of a migration from Tailwind generated code to ADS generated code.

```diff
+import Text from '@atlaskit/primitives/text';
+import { token } from '@atlaskit/tokens';

-<p className="text-sm text-gray-600">Small text</p>
+<Text size="small" color={token('color.text.subtle')}>Small text</Text>

-<h2 className="text-xl font-semibold text-gray-900">Heading</h2>
+<Text size="xlarge" weight="semibold" color={token('color.text')}>Heading</Text>

-<p className="text-center text-gray-500">Centered text</p>
+<Text align="center" color={token('color.text.subtle')}>Centered text</Text>
```
