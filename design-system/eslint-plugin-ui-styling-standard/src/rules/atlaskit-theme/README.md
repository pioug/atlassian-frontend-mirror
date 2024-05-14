This rule bans certain usages of `@atlaskit/theme` that `@compiled/react` is unable to compile. This includes `typography`, `elevation` and `skeletonShimmer`.

## Examples

### Typography

Use `<Heading>` instead of `typography`.

👎 Example of **incorrect** code for this rule:

```tsx
import { styled } from '@compiled/react';
import { typography } from '@atlaskit/theme';

export const HeadingComponent = styled.h2`
  ${typography.h200()};
`;
```

```tsx
import { styled } from '@compiled/react';
import { typography } from '@atlaskit/theme';

export const HeadingComponent = styled.h2(typography.h200());
```

👍 Example of **correct** code for this rule:

```tsx
import { styled } from '@compiled/react';

const HeadingComponent = styled.h2({
  fontSize: '20px',
});
```

```tsx
import Heading from '@atlaskit/heading';
import { token } from '@atlaskit/tokens';
import { styled } from '@compiled/react';

const TitleComponent = styled.span({
  marginTop: token('space.150', '12px'),
});

export const Title = (props) => (
  <Heading level="h200" as="h3">
    <TitleComponent {...props} />
  </Heading>
);
```

### Elevation

We don’t support this mixin, please use tokens instead.

👎 Example of **incorrect** code for this rule:

```tsx
import { styled } from '@compiled/react';
import { elevation } from '@atlaskit/theme';

export const ElevationComponent = styled.div`
  ${elevation.e100()};
`;
```

👍 Example of **correct** code for this rule:

```tsx
import { styled } from '@compiled/react';
import { token } from '@atlaskit/tokens';

export const TestComponent = styled.div({
  boxShadow: token(
    'elevation.shadow.raised',
    '0 1px 1px rgba(9,30,66,0.25),0 0 1px 1px rgba(9,30,66,0.13)',
  ),
});
```

### Skeleton Shimmer

You can preview our `@atlaskit/skeleton` (docs available to internal Atlassians only: [link](https://staging.atlassian.design/components/skeleton/examples)).

Otherwise, please use an SVG skeleton or your own `@compiled/react` variant yourself.

👎 Example of **incorrect** code for this rule:

```tsx
import { styled } from '@compiled/react';
import { skeletonShimmer } from '@atlaskit/theme/constants';

export const SkeletonShimmerComponent = styled.div`
  ${skeletonShimmer};
`;
```

👍 Example of **correct** code for this rule:

```tsx
export const SkeletonShimmerComponent = () => {
  return (
    <Wrapper>
      <object data="./skeleton.svg" type="image/svg+xml"></object>
    </Wrapper>
  );
};
```
