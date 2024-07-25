/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/standard-button';
import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';
import MoreIcon from '@atlaskit/icon/core/migration/show-more-horizontal--more';

import { type ActionProps, Action } from './Action';
import { gs, mq } from '../../common/utils';
import { di } from 'react-magnetic-di';

// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
const wrapperStyles = mq({
	display: 'flex',
	marginTop: [gs(2), 0],
});

const buttonStyles = css({ height: 'auto' });

// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
const actionsWrapperStyles = { marginLeft: gs(0.5) };

export interface ActionListProps {
	/* An array of action props, which will generate action buttons with the first passed appearing on the left (in LTR reading) */
	items: Array<ActionProps>;
}

export const ActionList = ({ items }: ActionListProps) => {
	di(DropdownMenu);

	const actionsToShow = items.slice(0, 2);
	const actionsToList = items.slice(2, items.length);

	return (
		<div
			// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
			css={wrapperStyles}
		>
			<ButtonGroup>
				{actionsToShow.map((action) => (
					<Action key={action.id} {...action} />
				))}
			</ButtonGroup>
			{actionsToList.length ? (
				// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage/preview, @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
				<div css={actionsWrapperStyles}>
					<DropdownMenu
						trigger={({ triggerRef, ...props }) => (
							<Button
								{...props}
								iconBefore={<MoreIcon label="more" color="currentColor" spacing="spacious" />}
								ref={triggerRef}
								css={buttonStyles}
								testId="dropdown-trigger"
							/>
						)}
						placement="right-start"
					>
						<DropdownItemGroup testId="dropdown-menu">
							{actionsToList.map((actionToList) => (
								<DropdownItem key={actionToList.id}>{actionToList.text}</DropdownItem>
							))}
						</DropdownItemGroup>
					</DropdownMenu>
				</div>
			) : null}
		</div>
	);
};
