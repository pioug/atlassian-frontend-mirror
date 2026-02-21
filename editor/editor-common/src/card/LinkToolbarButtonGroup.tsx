/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import ButtonGroup from '@atlaskit/button/button-group';
import type { NewCoreIconProps } from '@atlaskit/icon/types';

import { FloatingToolbarButton as Button } from '../ui';

/**
 * Applying `pointer-events: none;` when disabled allows the Tooltip to be displayed
 */
const buttonStyle = css({
	pointerEvents: 'auto',
});
const buttonStyleNoneEvent = css({
	pointerEvents: 'none',
});

type DisallowedWrapperProps = React.HTMLAttributes<HTMLDivElement> & {
	disabled?: boolean;
};

const DisallowedWrapper = ({ disabled, children }: DisallowedWrapperProps) => {
	return <div css={disabled ? disallowedWrapperStyle : defaultWrapperStyle}>{children}</div>;
};

/**
 * The button requires `pointer-events: none;` in order to fix the tooltip, hence
 * leaving us without a disabled cursor, the following fixes this:
 */
const defaultWrapperStyle = css({
	cursor: 'pointer',
});
const disallowedWrapperStyle = css({
	cursor: 'not-allowed',
});

export interface ButtonOptionProps {
	areAnyNewToolbarFlagsEnabled: boolean;
	disabled: boolean;
	icon: (props: NewCoreIconProps) => JSX.Element;
	onClick: () => void;
	selected: boolean;
	testId: string;
	title: string;
	tooltipContent?: string | null;
}

export interface LinkToolbarButtonGroupProps {
	options: ButtonOptionProps[];
}

export const LinkToolbarButtonGroup = ({ options }: LinkToolbarButtonGroupProps) => {
	return (
		<ButtonGroup>
			{options.map(
				({
					onClick,
					selected,
					disabled,
					testId,
					tooltipContent,
					title,
					icon,
					areAnyNewToolbarFlagsEnabled,
				}) => {
					const ButtonIcon = icon as (props: NewCoreIconProps) => JSX.Element;
					return (
						<DisallowedWrapper key={testId} disabled={disabled}>
							<Button
								css={disabled ? buttonStyleNoneEvent : buttonStyle}
								title={title}
								icon={<ButtonIcon label={title} spacing="spacious" />}
								selected={selected}
								onClick={onClick}
								testId={testId}
								disabled={disabled}
								tooltipContent={tooltipContent}
								areAnyNewToolbarFlagsEnabled={areAnyNewToolbarFlagsEnabled}
							/>
						</DisallowedWrapper>
					);
				},
			)}
		</ButtonGroup>
	);
};
