import React from 'react';
import { injectIntl, type WrappedComponentProps } from 'react-intl-next';

import Header from './Header';

import { type HelpLayout } from '../model/HelpLayout';
import { messages } from '../messages';
import { token } from '@atlaskit/tokens';
import { Container, Section, HelpFooter, LoadingContainer, LoadingRectangle } from './styled';

export const HelpContent: React.FC<HelpLayout & WrappedComponentProps> = (props) => {
	const {
		isLoading = false,
		footer,
		children,
		intl: { formatMessage },
		...rest
	} = props;
	return (
		<Container>
			<Section>
				<Header {...rest} />
				{isLoading ? (
					<LoadingContainer aria-label={formatMessage(messages.help_loading)} role="img">
						<LoadingRectangle contentHeight={token('space.250', '20px')} marginTop="0" />
						<LoadingRectangle contentWidth="90%" />
						<LoadingRectangle contentWidth="80%" />
						<LoadingRectangle contentWidth="80%" />
						<LoadingRectangle contentWidth="80%" />
						<LoadingRectangle contentWidth="80%" />
						<LoadingRectangle contentWidth="80%" />
						<LoadingRectangle contentWidth="80%" />
						<LoadingRectangle contentWidth="80%" />
						<LoadingRectangle contentWidth="70%" />
					</LoadingContainer>
				) : (
					<>{children}</>
				)}
				{footer ? <HelpFooter dataTestId="footer">{footer}</HelpFooter> : null}
			</Section>
		</Container>
	);
};

export default injectIntl(HelpContent);
