import React from 'react';
import CustomExample from '../../utils/custom-example';
import customMd from '../../utils/custom-md';

export default customMd`

### Appearance

Card component has three default appearances.

#### Inline

This style shows off the link right in the text, just like a regular hyperlink.
It's clean and sleek, fitting in smoothly with the rest of the content.
Check out [the inline card doc](./inline-card).

${(
	<CustomExample
		Component={require('../../../examples/content/inline-card').default}
		source={require('!!raw-loader!../../../examples/content/inline-card')}
	/>
)}

#### Block

This format presents the link as a card, giving a more detailed view of the linked material.
It really stands out compared to the inline style and comes in handy when you need extra context or a preview of the content.
Take a look at [the block card doc](./block-card).

${(
	<CustomExample
		Component={require('../../../examples/content/block-card').default}
		source={require('!!raw-loader!../../../examples/content/block-card')}
	/>
)}

#### Embed

Embed: With this format, the linked content is directly shown on the page, similar to embedding a video or a document.
It gives a full view of the linked content without users having to leave the current page.
Dive into [the embed card doc](./embed-card).

${(
	<CustomExample
		Component={require('../../../examples/content/embed-card').default}
		source={require('!!raw-loader!../../../examples/content/embed-card')}
	/>
)}

### Composable card

Card component provides a composable system to enhance links, offering greater customization options compared to traditional Smart Links (Inline, Card, Embed).
This enables product teams to tailor link appearance for different layouts, granting them improved control over link presentation and enhancing user experience through additional contextual information.
For more information, refer to [flexible card doc](./flexible-card).

### Placeholder

Smart card is a React component that is [lazy-loaded](https://react.dev/reference/react/lazy) by default. It displays the \`url\` as a placeholder until the component is fully loaded.
When \`placeholder\` is provided, it will replace the URL with the placeholder text.

${(
	<CustomExample
		Component={require('../../../examples/content/card-placeholder').default}
		source={require('!!raw-loader!../../../examples/content/card-placeholder-code')}
	/>
)}

For non lazy-loaded smart card, please see [CardSSR](./card-ssr).
`;
