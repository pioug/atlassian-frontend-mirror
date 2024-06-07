import Button from '@atlaskit/button/custom-theme-button';
import LockIcon from '@atlaskit/icon/glyph/lock-filled';
import { N500, R400 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';
import withFrameStyleControl from '../utils/withFrameStyleControl';

import React from 'react';
import { FormattedMessage } from 'react-intl-next';
import { messages } from '../../../messages';
import { Frame } from '../Frame';
import { AKIconWrapper } from '../Icon';
import { IconAndTitleLayout } from '../IconAndTitleLayout';
import { IconStyledButton } from '../styled';
import { HoverCard } from '../../HoverCard';
import { type AnalyticsFacade } from '../../../state/analytics';

export interface InlineCardUnauthorizedViewProps {
	/** The url to display */
	url: string;
	/** The icon of the service (e.g. Dropbox/Asana/Google/etc) to display */
	icon?: React.ReactNode;
	/** The name of the service (e.g. Dropbox/Asana/Google/etc) to display */
	context?: string;
	/** The optional click handler */
	onClick?: React.EventHandler<React.MouseEvent | React.KeyboardEvent>;
	/** What to do when a user hit "Try another account" button */
	onAuthorise?: () => void;
	/** A flag that determines whether the card is selected in edit mode. */
	isSelected?: boolean;
	/** A `testId` prop is provided for specified elements, which is a unique string that appears as a data attribute `data-testid` in the rendered code, serving as a hook for automated tests */
	testId?: string;
	/** A flag that determines is a tooltip should show up on hover over the unauthorised link */
	showAuthTooltip?: boolean;
	/** A smart link id that may be used in analytics */
	id?: string;
	/** An AnalyticsFacade object used for calling analytics. */
	analytics: AnalyticsFacade;
	/** An identifier of the provider which will be executing the action. */
	extensionKey?: string;
}

const FallbackUnauthorizedIcon = (
	<AKIconWrapper>
		<LockIcon label="error" size="small" primaryColor={token('color.icon.danger', R400)} />
	</AKIconWrapper>
);

export class InlineCardUnauthorizedView extends React.Component<InlineCardUnauthorizedViewProps> {
	private frameRef = React.createRef<HTMLSpanElement & null>();

	handleConnectAccount = (event: React.MouseEvent<HTMLElement>) => {
		const { analytics, extensionKey, onAuthorise } = this.props;
		event.preventDefault();
		event.stopPropagation();

		if (onAuthorise) {
			analytics?.track.appAccountAuthStarted({
				extensionKey,
			});
		}
		return onAuthorise!();
	};

	renderActionButton = () => {
		const { onAuthorise, context } = this.props;
		const ActionButton = withFrameStyleControl(Button, this.frameRef);

		return onAuthorise ? (
			<ActionButton
				spacing="none"
				component={IconStyledButton}
				onClick={this.handleConnectAccount}
				testId="button-connect-account"
			>
				<FormattedMessage {...messages.connect_link_account_card_name} values={{ context }} />
			</ActionButton>
		) : undefined;
	};

	render() {
		const {
			url,
			icon,
			onAuthorise,
			onClick,
			isSelected,
			testId = 'inline-card-unauthorized-view',
			showAuthTooltip = false,
		} = this.props;

		const inlineCardUnauthenticatedView = (
			<Frame testId={testId} isSelected={isSelected} ref={this.frameRef}>
				<IconAndTitleLayout
					icon={icon ? icon : FallbackUnauthorizedIcon}
					title={url}
					link={url}
					onClick={onClick}
					titleColor={token('color.text.subtle', N500)}
				/>
				{this.renderActionButton()}
			</Frame>
		);
		if (onAuthorise && showAuthTooltip) {
			return (
				<HoverCard url={url} id={this.props.id}>
					{inlineCardUnauthenticatedView}
				</HoverCard>
			);
		}

		return inlineCardUnauthenticatedView;
	}
}
