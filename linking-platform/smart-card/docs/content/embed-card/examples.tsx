import React from 'react';
import CardViewExample from '../../../examples/card-view';
import { ResolvedClientEmbedUrl } from '../../../examples/utils/custom-client';
import CustomExample from '../../utils/custom-example';
import customMd from '../../utils/custom-md';
import state_description from '../state-description';

export default customMd`

Smart Links embed enables users to seamlessly integrate and engage with content from different sources directly within Atlassian products.
This functionality boosts productivity by minimising the necessity to switch between tools, offering a smooth pathway to access and engage with linked content.

However, not every link can display an embed appearance.
To surface the embed appearance, the resolved link response must contain \`data.preview\`.
The frontend implementation must specify support \`platform\` that matches with \`data.preview["atlassian:supportedPlatforms"]\` from the link response.

### Frame

By default, the embed displays a frame on hover.
To consistently show the frame, set \`frameStyle\` as \`show\`.
To conceal the frame, set \`frameStyle\` as \`hide\`.

${(
	<CustomExample
		Component={require('../../../examples/content/embed-card-frame-style').default}
		source={require('!!raw-loader!../../../examples/content/embed-card-frame-style')}
	/>
)}

### Platform

\`platform\` prop informs Smart Link of the device it is rendered in.
Available values are \`web\` and \`mobile\`.
This property works in conjunction with the link response \`data.preview["atlassian:supportedPlatforms"]\`.
To make embed content available on all supported URLs, use \`web\`.

${(
	<CustomExample
		Component={require('../../../examples/content/embed-card-platform').default}
		source={require('!!raw-loader!../../../examples/content/embed-card-platform')}
	/>
)}


### Interactive URL

Supported Smart Links can display interactive embed content.
By default, the embed uses \`data.preview.href\` from the link response.
To display iframe content containing a more editable version of the link, such as including a toolbar, set \`embedIframeUrlType\` to \`interactiveHref\`.
This feature is exclusively available on supported link responses with \`data.preview.interactiveHref\`.

${(
	<CustomExample
		Component={require('../../../examples/content/embed-card-interactive-href').default}
		source={require('!!raw-loader!../../../examples/content/embed-card-interactive-href')}
	/>
)}

### Setting height and width

\`inheritDimensions\` specifies whether the width and height of an embed card should be inherited from its parent.
When set to \`true\`, the embed iframe will eliminate constraints on the aspect ratio, height, and width of the iframe.
To achieve this, the parent container must override the style of \`.loader-wrapper\` and define the desired height, such as \`height: 100%\`.

${(
	<CustomExample
		Component={require('../../../examples/content/embed-card-inherit-dimension').default}
		source={require('!!raw-loader!../../../examples/content/embed-card-inherit-dimension')}
	/>
)}

### States

${state_description}

${(<CardViewExample appearance="embed" frameStyle="show" url={ResolvedClientEmbedUrl} />)}
`;
