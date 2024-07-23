/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { Fragment, type PropsWithChildren } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import type { InviteToEditComponentProps } from '@atlaskit/editor-common/collab';
import { ToolbarButton } from '@atlaskit/editor-common/ui-menu';
import InviteTeamIcon from '@atlaskit/icon/glyph/editor/add';

import { inviteTeamWrapperStyles } from './styles';

const ID = (props: PropsWithChildren<{}>) => <Fragment>{props.children}</Fragment>;

export type InviteToEditButtonProps = PropsWithChildren<{
	onClick?: React.MouseEventHandler;
	selected?: boolean;
	Component?: React.ComponentType<React.PropsWithChildren<InviteToEditComponentProps>>;
	title: string;
}>;

export const InviteToEditButton = (props: InviteToEditButtonProps) => {
	const { Component, onClick, selected, title } = props;

	const iconBefore = React.useMemo(() => <InviteTeamIcon label={title} />, [title]);

	if (!Component && !onClick) {
		return null;
	}

	const Wrapper = Component ? Component : ID;

	return (
		// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
		<div css={inviteTeamWrapperStyles}>
			<Wrapper>
				<ToolbarButton
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
					className="invite-to-edit"
					onClick={onClick}
					selected={selected}
					title={title}
					titlePosition="bottom"
					iconBefore={iconBefore}
				/>
			</Wrapper>
		</div>
	);
};
