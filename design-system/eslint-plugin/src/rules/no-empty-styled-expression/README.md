Disallows/discourages passing empty arguments to any `styled` expression when using a CSS-in-JS library, including `@atlaskit/css`, `@compiled/react`, Emotion, and `styled-components`.

If Compiled is used in the file, passing an empty object or no object at all causes Compiled to build extra `div/span` elements, as opposed to simply using a `div`. This leads to reduced performance and is greatly discouraged. If a wrapper is necessary, opt to use a `div` or wrap it in the empty React fragment `<> <YourComponentHere></YourComponentHere> </>`.

## Examples

### Incorrect

```tsx
const EmptyStyledExpression = styled.div();

const EmptyStyledExpressionArgument = styled.div({});

const EmptyStyledExpressionArgument = styled.div([]);
```

### Correct

```tsx
const Wrapper = styled.div({
  backgroundColor: 'red',
  MyComponent: {
    backgroundColor: 'green',
  },
});
```

## What to do instead?

### Use elements directly

```diff
- const Wrapper = styled.div({});

   function App() {
-    return <Wrapper>hello world</Wrapper>;
+    return <div>hello world</div>;
  }
```

### Use a React fragment

```diff
- const Wrapper = styled.div({});

   function App() {
-    return <Wrapper>hello world</Wrapper>;
+    return <>hello world</>;
  }
```

## Options

### importSources

By default, this rule will check `styled` usages from:

- `@atlaskit/css`
- `@atlaskit/primitives`
- `@compiled/react`
- `@emotion/react`
- `@emotion/core`
- `@emotion/styled`
- `styled-components`

To change this list of libraries, you can define a custom set of `importSources`, which accepts an array of package names (strings).

```tsx
// [{ importSources: ['other-lib'] }]

import { styled } from 'other-lib';

// Invalid!
export const Component = styled.div({});
```
