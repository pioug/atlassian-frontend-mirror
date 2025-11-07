import React from 'react';
import { injectIntl, type WithIntlProps, type WrappedComponentProps } from 'react-intl-next';
import { token } from '@atlaskit/tokens';
import { messages } from '../../../../messages';

import { LoadingRectangle } from '../../../../util/styled';

export const Loading: React.FC<WrappedComponentProps> = ({ intl: { formatMessage } }) => (
	<div aria-label={formatMessage(messages.help_loading)} role="img">
		<LoadingRectangle
			style={{
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				display: 'inline-block',
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				verticalAlign: 'middle',
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				position: 'relative',
			}}
			contentHeight="16px"
			contentWidth="16px"
			marginTop="4px"
		/>
		<LoadingRectangle
			style={{
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				marginLeft: token('space.100', '8px'),
			}}
			contentHeight="11px"
			contentWidth="60px"
			marginTop="4px"
		/>
		<LoadingRectangle marginTop="8px" />
		<LoadingRectangle contentWidth="90%" marginTop="16px" />
		<LoadingRectangle contentWidth="90%" />
		<LoadingRectangle contentWidth="80%" />
		<LoadingRectangle contentWidth="80%" />
	</div>
);

const _default_1: React.FC<WithIntlProps<WrappedComponentProps>> & {
	WrappedComponent: React.ComponentType<WrappedComponentProps>;
} = injectIntl(Loading);
export default _default_1;
