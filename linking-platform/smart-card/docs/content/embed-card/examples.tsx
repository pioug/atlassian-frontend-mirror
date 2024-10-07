import React from 'react';
import CardViewExample from '../../../examples/card-view';
import { ResolvedClientEmbedUrl } from '../../../examples/utils/custom-client';
import CustomExample from '../../utils/custom-example';
import customMd from '../../utils/custom-md';
import state_description from '../state-description';

export default customMd`

### Frame style

${(
	<CustomExample
		Component={require('../../../examples/content/embed-card-frame-style').default}
		source={require('!!raw-loader!../../../examples/content/embed-card-frame-style')}
	/>
)}

### Setting height and width of the embed

${(
	<CustomExample
		Component={require('../../../examples/content/embed-card-inherit-dimension').default}
		source={require('!!raw-loader!../../../examples/content/embed-card-inherit-dimension')}
	/>
)}

### Platform

### Url type

### States

${state_description}

${(<CardViewExample appearance="embed" frameStyle="show" url={ResolvedClientEmbedUrl} />)}
`;
