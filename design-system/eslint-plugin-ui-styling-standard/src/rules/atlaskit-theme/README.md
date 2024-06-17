Blocks legacy `@atlaskit/theme` mixins that `@compiled/react` cannot compile. This includes the
`typography`, `elevation` and `skeletonShimmer` mixins.

## Examples

### Typography

Don't use `typography` mixins.

Use [typography tokens](https://atlassian.design/foundations/typography-beta/applying-typography) or
the [Heading](https://atlassian.design/components/heading) and
[Text](https://atlassian.design/components/primitives/text) components.

#### Incorrect

```tsx
import { css } from '@compiled/react';
import { typography } from '@atlaskit/theme';

const titleStyles = css(typography.h700());
```

#### Correct

```tsx
import { css } from '@compiled/react';
import { token } from '@atlaskit/tokens';

const titleStyles = css({
	font: token('font.heading.large'),
});

const paragraphStyles = css({
	font: token('font.body.large'),
});
```

```tsx
import { css } from '@compiled/react';
import Heading from '@atlaskit/heading';
import { Stack, Text } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

const Component = () => (
	<Stack>
		<Heading size="large">Title</Heading>
		<Text size="large">Lorem ipsum</Text>
	</Stack>
);
```

### Elevation

Don't use `elevation` mixins.

Use [elevation tokens](https://atlassian.design/foundations/elevation) instead.

#### Incorrect

```tsx
import { css } from '@compiled/react';
import { elevation } from '@atlaskit/theme';

const cardStyles = css(elevation.e100());
```

#### Correct

```tsx
import { styled } from '@compiled/react';
import { token } from '@atlaskit/tokens';

const cardStyles = css({
	backgroundColor: token('elevation.surface.raised'),
	boxShadow: token('elevation.shadow.raised'),
});
```

### Skeleton Shimmer

Don't use the `skeletonShimmer` mixin.

Preview our [Skeleton](https://staging.atlassian.design/components/skeleton/examples) component
(internal Atlassians only).

Otherwise:

- Use the `color.skeleton` and `color.skeleton.subtle` tokens to make your own component.
- Use `@atlassian/jira-skeletons` when working on Jira (internal Atlassians only).

#### Incorrect

```tsx
import { css } from '@compiled/react';
import { skeletonShimmer } from '@atlaskit/theme/constants';

const skeletonStyles = css(skeletonShimmer());
```

#### Correct

```tsx
import Skeleton from '@atlaskit/skeleton';

<Skeleton width="200px" height="16px" isShimmering />;
```

```tsx
import { css, keyframes } from '@compiled/react';

const shimmer = keyframes({
	from: { backgroundColor: token('color.skeleton') },
	to: { backgroundColor: token('color.skeleton.subtle') },
});

const skeletonStyles = css({
	backgroundColor: token('color.skeleton'),
	animationName: shimmer,
	animationDuration: '1.5s',
	animationIterationCount: 'infinite',
	animationTimingFunction: 'linear',
	animationDirection: 'alternate',
});
```

```tsx
import { ListSkeleton } from '@atlassian/jira-skeletons';

<ListSkeleton numOfRows={3} />;
```
