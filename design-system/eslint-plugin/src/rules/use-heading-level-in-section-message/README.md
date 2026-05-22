The `SectionMessage` component in `@atlaskit/section-message`, when used with a `title` prop, needs to be the correct level within the document flow. This is not something that can be automated and requires contextual knowledge of what is present in the experience.

For more information on proper heading flow, consider this [W3C document on heading hierarchy](https://www.w3.org/WAI/tutorials/page-structure/headings/).

## Examples

### Incorrect

```tsx
import Heading from '@atlaskit/heading';
import { Text } from '@atlaskit/primitives/compiled';
import SectionMessage from '@atlaskit/section-message';

<Heading as="h1">Jira</Heading>
<SectionMessage title="Editing is restricted">
 ^^^^^^^^^^^^^^ Heading level is not explicitly set.
	<Text as="p">You must be an administrator to edit this content.</Text>
</SectionMessage>
```

### Correct

```tsx
import Heading from '@atlaskit/heading';
import { Text } from '@atlaskit/primitives/compiled';
import SectionMessage from '@atlaskit/section-message';

<Heading as="h1">Jira</Heading>
<SectionMessage title="Editing is restricted" headingLevel="h2">
	<Text as="p">You must be an administrator to edit this content.</Text>
</SectionMessage>
```
