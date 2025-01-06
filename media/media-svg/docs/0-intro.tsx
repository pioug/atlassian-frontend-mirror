import React from 'react';

import { Example, md, Props } from '@atlaskit/docs';
import SectionMessage from '@atlaskit/section-message';

export default md`

  For fetching and rendering SVGs secure and responsively

${(
	<SectionMessage title={'WORK IN PROGRESS'} appearance="warning">
		{/* eslint-disable-next-line @atlaskit/design-system/use-primitives-text */}
		<p>
			This package is under development. If you intend to use it, please reach out to Core
			Experiences Team in{' '}
			<a href="https://atlassian.enterprise.slack.com/archives/C05J5GNHPLN" target="_blank">
				#help-media-platform
			</a>
		</p>
	</SectionMessage>
)}

  ## Usage

  ${(
		<Example
			packageName="@atlaskit/media-svg"
			Component={require('../examples/00-basic').default}
			title="Basic example"
			source={require('!!raw-loader!../examples/00-basic')}
		/>
	)}

  ${(<Props heading="MediaSvg Props" props={require('!!extract-react-types-loader!../src')} />)}
`;
