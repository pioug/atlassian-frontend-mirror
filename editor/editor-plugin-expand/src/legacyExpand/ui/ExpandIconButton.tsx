/** @jsx jsx */
import React, { useCallback } from 'react';

import { jsx } from '@emotion/react';
import type { IntlShape } from 'react-intl-next';

import Button from '@atlaskit/button/custom-theme-button';
import { expandClassNames } from '@atlaskit/editor-common/styles';
import {
	expandLayoutWrapperStyle,
	ExpandLayoutWrapperWithRef,
	expandMessages,
} from '@atlaskit/editor-common/ui';
import { akEditorSwoopCubicBezier } from '@atlaskit/editor-shared-styles';
import ChevronRightIcon from '@atlaskit/icon/glyph/chevron-right';
import Tooltip from '@atlaskit/tooltip';

interface ExpandIconButtonProps {
	allowInteractiveExpand: boolean;
	expanded: boolean;
	intl?: IntlShape;
}

interface ExpandIconButtonWithLabelProps extends ExpandIconButtonProps {
	label: string;
}

export const withTooltip = (WrapperComponent: React.ElementType) => {
	return class WithSortableColumn extends React.Component<ExpandIconButtonWithLabelProps> {
		constructor(props: ExpandIconButtonWithLabelProps) {
			super(props);
		}

		render() {
			const { label } = this.props;

			return (
				<Tooltip content={label} position="top" tag={ExpandLayoutWrapperWithRef}>
					<WrapperComponent {...this.props} />
				</Tooltip>
			);
		}
	};
};

export const CustomButton = (props: ExpandIconButtonWithLabelProps) => {
	const { allowInteractiveExpand, expanded } = props;
	const useTheme = useCallback(
		(currentTheme: any, themeProps: any) => {
			const { buttonStyles, ...rest } = currentTheme(themeProps);
			return {
				buttonStyles: {
					...buttonStyles,
					height: '100%',
					'& svg': {
						transform: props.expanded ? 'transform: rotate(90deg);' : 'transform: rotate(0deg);',
						transition: `transform 0.2s ${akEditorSwoopCubicBezier};`,
					},
				},
				...rest,
			};
		},
		[props],
	);

	return (
		<Button
			appearance="subtle"
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
			className={expandClassNames.iconContainer}
			iconBefore={<ChevronRightIcon label={''} />}
			shouldFitContainer
			theme={useTheme}
			aria-expanded={expanded}
			isDisabled={!allowInteractiveExpand}
		></Button>
	);
};

const ButtonWithTooltip = withTooltip(CustomButton);
const ButtonWithoutTooltip = CustomButton;

export const ExpandIconButton = (props: ExpandIconButtonProps) => {
	const { expanded, intl } = props;
	const message = expanded ? expandMessages.collapseNode : expandMessages.expandNode;

	const label = (intl && intl.formatMessage(message)) || message.defaultMessage;
	// check to ensure device supports any-hover
	const supportsAnyHover: boolean = !!window.matchMedia
		? window.matchMedia('(any-hover: hover)').matches !==
			window.matchMedia('(any-hover: none)').matches
		: false;
	const hoverEventCheck: boolean = supportsAnyHover
		? window.matchMedia('(any-hover: hover)').matches
		: true;

	// hoverEventCheck is to disable tooltips for mobile to prevent incorrect hover state causing issues on iOS
	if (props.allowInteractiveExpand && hoverEventCheck) {
		return <ButtonWithTooltip label={label} {...props} />;
	}

	return (
		// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
		<div css={expandLayoutWrapperStyle}>
			<ButtonWithoutTooltip label={label} {...props} />
		</div>
	);
};
