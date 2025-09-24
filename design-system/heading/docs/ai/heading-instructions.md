# Translating from Tailwind

Use the table to migrate common tailwind classes

| Tailwind Classes        | React Example              | Usage Notes                                    |
| ----------------------- | -------------------------- | ---------------------------------------------- |
| `text-4xl font-medium`  | `<Heading size="xxlarge">` | Largest heading, clearly bold/medium weight    |
| `text-3xl font-medium`  | `<Heading size="xlarge">`  | Second largest, consistent heading weight      |
| `text-2xl font-medium`  | `<Heading size="large">`   | Clear heading hierarchy maintained             |
| `text-xl font-medium`   | `<Heading size="medium">`  | Standard heading size, medium weight           |
| `text-lg font-medium`   | `<Heading size="small">`   | Smaller but still maintains heading weight     |
| `text-base font-medium` | `<Heading size="xsmall">`  | Very small heading, weight appears consistent  |
| `text-sm font-medium`   | `<Heading size="xxsmall">` | Smallest heading size, maintains medium weight |

An example diff of a migration from Tailwind generated code to ADS generated code

```diff
+import Heading from '@atlaskit/heading';

-<h1 className="text-4xl font-medium">Title</h1>
+<Heading size="xxlarge">Title</Heading>

-<h2 className="text-2xl font-medium">Subtitle</h2>
+<Heading size="large" as="h2">Subtitle</Heading>
```
