import React from 'react';

import {
	AtlassianInternalWarning,
	code,
	DevPreviewWarning,
	Example,
	md,
	Props,
} from '@atlaskit/docs';

export default md`

${(
	<>
		{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
		<div style={{ marginBottom: '0.5rem' }}>
			<AtlassianInternalWarning />
		</div>
		{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
		<div style={{ marginTop: '0.5rem' }}>
			<DevPreviewWarning />
		</div>
	</>
)}

  ## Usage
  ${code`
  import QuizWidget from '@atlaskit/quiz-widget';
  `}

  ${(
		<Example
			packageName="@atlaskit/quiz-widget"
			Component={require('../examples/0-Quiz-Widget').default}
			title="Basic"
			source={require('!!raw-loader!../examples/0-Quiz-Widget')}
		/>
	)}

  ${(
		<Props
			heading="QuizWidget Props"
			props={require('!!extract-react-types-loader!../src/components/QuizWidget/index')}
		/>
	)}
`;
