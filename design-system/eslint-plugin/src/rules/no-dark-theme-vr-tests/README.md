Dark theme VR tests are redundant. See
[this RFC](https://hello.atlassian.net/wiki/spaces/DST/pages/4083370233/DSTRFC-022+-+Intent+to+remove+dark+VR+tests+from+AFM)

### Incorrect

```tsx
import { snapshot } from '@af/visual-regression';

snapshot(ComponentName, {
	variants: [
		{
			name: 'Light',
			environment: {
				colorScheme: 'light',
			},
		},
		{
			name: 'Dark',
			environment: {
				colorScheme: 'dark',
				^^^^^^^^^^^^^^^^^^^^ invalid
			},
		},
	],
});

```

### Correct

```tsx
import { snapshot } from '@af/visual-regression';

snapshot(ComponentName, {
	variants: [
		{
			name: 'Light',
			environment: {
				colorScheme: 'light',
			},
		},
	],
});
```
