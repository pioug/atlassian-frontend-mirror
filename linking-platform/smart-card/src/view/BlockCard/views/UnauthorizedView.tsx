/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type MouseEvent } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import { FormattedMessage } from 'react-intl-next';

import { messages } from '../../../messages';
import type { CardActionOptions } from '../../Card/types';
import { Byline } from '../../common/Byline';
import { type IconProps } from '../../common/Icon';
import { type ActionProps } from '../components/Action';
import { ActionList } from '../components/ActionList';
import { Content } from '../components/Content';
import { ContentFooter } from '../components/ContentFooter';
import { ContentHeader } from '../components/ContentHeader';
import { Frame } from '../components/Frame';
import { Link } from '../components/Link';
import { Provider } from '../components/Provider';
import { handleClickCommon } from '../utils/handlers';

const textBylineProps = { ...messages.connect_link_account_card_description };

export interface UnauthorizedViewProps {
	actions: ActionProps[];
	context?: { icon?: React.ReactNode; text: string };
	isSelected?: boolean;
	testId?: string;
	actionOptions?: CardActionOptions;
	icon: IconProps;
	link?: string;
	onClick?: React.EventHandler<React.MouseEvent | React.KeyboardEvent>;
}

export const UnauthorizedView = ({
	context = { text: '' },
	isSelected = false,
	actions = [],
	testId = 'block-card-unauthorized-view',
	actionOptions,
	link = '',
	onClick = () => {},
}: UnauthorizedViewProps) => {
	const handleClick = (event: MouseEvent<HTMLElement>) => handleClickCommon(event, onClick);

	return (
		<Frame isSelected={isSelected} testId={testId} isFluidHeight>
			<Content isCompact>
				<div>
					<ContentHeader onClick={handleClick} link={link}>
						{/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
						<Link url={link} testId={testId} />
					</ContentHeader>
					<Byline
						testId={testId ? `${testId}-byline` : undefined}
						text={<FormattedMessage {...textBylineProps} values={{ context: context.text }} />}
					/>
				</div>
				<ContentFooter>
					<Provider name={context.text} icon={context.icon} />
					{!actionOptions?.hide && <ActionList items={actions} />}
				</ContentFooter>
			</Content>
		</Frame>
	);
};
