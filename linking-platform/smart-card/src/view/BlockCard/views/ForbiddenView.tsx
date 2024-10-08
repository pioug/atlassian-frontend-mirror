/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import { FormattedMessage } from 'react-intl-next';
import { type MouseEvent } from 'react';
import { R300 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';
import LockIcon from '@atlaskit/icon/utility/migration/lock-locked--lock-filled';

import { Frame } from '../components/Frame';
import { Provider } from '../components/Provider';
import { Byline } from '../../common/Byline';
import { ActionList } from '../components/ActionList';
import { Content } from '../components/Content';
import { type ActionProps } from '../components/Action';
import { messages } from '../../../messages';
import { ContentFooter } from '../components/ContentFooter';
import { type IconProps } from '../../common/Icon';
import { ContentHeader } from '../components/ContentHeader';
import { handleClickCommon } from '../utils/handlers';
import { Link } from '../components/Link';
import { UnresolvedText } from '../components/UnresolvedText';
import { type RequestAccessContextProps } from '../../types';
import type { CardActionOptions } from '../../Card/types';
import { Flex, xcss } from '@atlaskit/primitives';

const iconWrapperStyles = xcss({
	marginRight: 'space.050',
});

export interface PermissionDeniedProps {
	/* Actions which can be taken on the URL */
	actions?: Array<ActionProps>;
	/* Details about the provider for the link */
	context?: { icon?: React.ReactNode; text: string };
	/* Icon for the header of the link */
	icon: IconProps;
	/* URL to the link */
	link?: string;
	/* Event handler - on click of the card, to be passed down to clickable components */
	onClick?: React.EventHandler<React.MouseEvent | React.KeyboardEvent>;
	/* If selected, would be true in edit mode */
	isSelected?: boolean;
	testId?: string;
	actionOptions?: CardActionOptions;
	/* Describes additional metadata based on the type of access a user has to the link */
	requestAccessContext?: RequestAccessContextProps;
}

/**
 * Class name for selecting non-flexible forbidden block card
 *
 * @deprecated {@link https://hello.jira.atlassian.cloud/browse/ENGHEALTH-6878 Internal documentation for deprecation (no external access)}
 * Using this selctor is deprecated as once the flexible block card feature flag is removed, this class will no longer be used.
 */
export const blockCardForbiddenViewClassName = 'block-card-forbidden-view';

/**
 * Class name for selecting link inside non-flexible forbidden block card
 *
 * @deprecated {@link https://hello.jira.atlassian.cloud/browse/ENGHEALTH-6878 Internal documentation for deprecation (no external access)}
 * Using this selctor is deprecated as once the flexible block card feature flag is removed, this class will no longer be used.
 */
export const blockCardForbiddenViewLinkClassName = 'block-card-forbidden-view-link';

export const ForbiddenView = ({
	context = { text: '' },
	isSelected = false,
	actions = [],
	testId = 'block-card-forbidden-view',
	link = '',
	onClick = () => {},
	requestAccessContext = {},
	actionOptions,
}: PermissionDeniedProps) => {
	const handleClick = (event: MouseEvent<HTMLElement>) => handleClickCommon(event, onClick);

	const {
		action,
		descriptiveMessageKey = 'invalid_permissions_description',
		hostname = '',
		buttonDisabled,
	} = requestAccessContext;

	const items = action !== undefined && !(buttonDisabled ?? false) ? [...actions, action] : actions;

	return (
		<Frame
			isSelected={isSelected}
			testId={testId}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
			className={blockCardForbiddenViewClassName}
			isFluidHeight
		>
			<Content isCompact>
				<div>
					<ContentHeader onClick={handleClick} link={link}>
						<Link
							url={link}
							testId={testId}
							// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
							className={blockCardForbiddenViewLinkClassName}
						/>
					</ContentHeader>
					<Byline>
						<UnresolvedText
							icon={
								<Flex alignItems="center" xcss={iconWrapperStyles}>
									<LockIcon
										label="forbidden-lock-icon"
										LEGACY_size="small"
										color={token('color.icon.danger', R300)}
										testId={`${testId}-lock-icon`}
										LEGACY_margin={`0 ${token('space.negative.050')} 0 0`}
									/>
								</Flex>
							}
							text={
								<FormattedMessage
									{...messages[descriptiveMessageKey]}
									values={{
										product: context.text,
										context: context.text,
										hostname,
									}}
								/>
							}
						/>
					</Byline>
				</div>
				<ContentFooter>
					<Provider name={context.text} icon={context.icon} />
					{!actionOptions?.hide && <ActionList items={items} />}
				</ContentFooter>
			</Content>
		</Frame>
	);
};
