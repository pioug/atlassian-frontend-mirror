/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type MouseEvent, useMemo } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import { FormattedMessage } from 'react-intl-next';

import WarningIcon from '@atlaskit/icon/utility/migration/warning';
import { Flex, xcss } from '@atlaskit/primitives';
import { R300 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { messages } from '../../../messages';
import { Byline } from '../../common/Byline';
import { RetryAction } from '../actions/RetryAction';
import { type ActionProps } from '../components/Action';
import { ActionList } from '../components/ActionList';
import { Content } from '../components/Content';
import { ContentFooter } from '../components/ContentFooter';
import { ContentHeader } from '../components/ContentHeader';
import { Frame } from '../components/Frame';
import { Link } from '../components/Link';
import { UnresolvedText } from '../components/UnresolvedText';
import { handleClickCommon } from '../utils/handlers';

const textDescriptionProps = { ...messages.could_not_load_link };

const iconWrapperStyles = xcss({
	marginInline: 'space.025',
});

export interface ErroredViewProps {
	/* URL to the link */
	link?: string;
	/* Event handler - on click of the card, to be passed down to clickable components */
	onClick?: React.EventHandler<React.MouseEvent | React.KeyboardEvent>;
	/* If selected, would be true in edit mode */
	isSelected?: boolean;
	/* If there is a way to recover from the current error, this handler is used
     to trigger a re-resolve */
	onRetry?: () => void;
	message?: string;
	testId?: string;
	inheritDimensions?: boolean;
}

/**
 * Class name for selecting non-flexible errored block card
 *
 * @deprecated {@link https://hello.jira.atlassian.cloud/browse/ENGHEALTH-6878 Internal documentation for deprecation (no external access)}
 * Using this selctor is deprecated as once the flexible block card feature flag is removed, this class will no longer be used.
 */
export const blockCardErroredViewClassName = 'block-card-errored-view';

export const ErroredView = ({
	isSelected = false,
	testId = 'block-card-errored-view',
	link = '',
	onClick = () => {},
	onRetry,
	inheritDimensions = false,
}: ErroredViewProps) => {
	const handleClick = (event: MouseEvent<HTMLElement>) => handleClickCommon(event, onClick);

	const actions = useMemo<ActionProps[]>(() => (onRetry ? [RetryAction(onRetry)] : []), [onRetry]);

	return (
		<Frame
			isSelected={isSelected}
			testId={testId}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
			className={blockCardErroredViewClassName}
			isFluidHeight
			inheritDimensions={inheritDimensions}
		>
			<Content isCompact>
				<div>
					<ContentHeader onClick={handleClick} link={link}>
						<Link url={link} testId={testId} />
					</ContentHeader>
					<Byline>
						<UnresolvedText
							icon={
								<Flex alignItems="center" xcss={iconWrapperStyles}>
									<WarningIcon
										label="errored-warning-icon"
										LEGACY_size="small"
										color={token('color.icon.warning', R300)}
										testId={`${testId}-warning-icon`}
										LEGACY_margin={`0 ${token('space.negative.025')} 0 ${token('space.negative.025')}`}
									/>
								</Flex>
							}
							text={<FormattedMessage {...textDescriptionProps} />}
						/>
					</Byline>
				</div>
				<ContentFooter>
					<ActionList items={actions} />
				</ContentFooter>
			</Content>
		</Frame>
	);
};
