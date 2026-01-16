import React from 'react';
import { md, PropsTable } from '@atlaskit/docs';

const _default_1: any = md`
# Props

This package utilizes the \`@atlaskit/icon\` component and accepts the following props:

  ${(
		<PropsTable
			details={[
				{
					name: 'label',
					type: 'string',
					description:
						'Text used to describe what the icon is in context. A label is needed when there is no pairing visible text next to the icon. An empty string marks the icon as presentation only.',
				},
				{
					name: 'testId',
					type: 'string',
					description:
						'A `testId` prop is provided for specified elements, which is a unique string that appears as a data attribute `data-testid` in the rendered code, serving as a hook for automated tests.',
				},
			]}
		/>
	)}

`;
export default _default_1;
