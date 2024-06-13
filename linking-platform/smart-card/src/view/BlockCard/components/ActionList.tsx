/** @jsx jsx */
import { css, jsx } from '@emotion/react';

import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/standard-button';
import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';
import MoreIcon from '@atlaskit/icon/glyph/more';

import { type ActionProps, Action } from './Action';
import { gs, mq } from '../../common/utils';
import { di } from 'react-magnetic-di';

const buttonStyles = css({ height: 'auto' });

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
			css={mq({
				display: 'flex',
				// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage/preview, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
				marginTop: [gs(2), 0],
			})}
		>
			<ButtonGroup>
				{actionsToShow.map((action) => (
					<Action key={action.id} {...action} />
				))}
			</ButtonGroup>
			{actionsToList.length ? (
				// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage/preview, @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
				<div css={{ marginLeft: gs(0.5) }}>
					<DropdownMenu
						trigger={({ triggerRef, ...props }) => (
							<Button
								{...props}
								iconBefore={<MoreIcon label="more" />}
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
