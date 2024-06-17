/** @jsx jsx */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import {
	errorMessageWrapperStyles,
	titleBoxFooterStyles,
	titleBoxHeaderStyles,
	titleBoxIconStyles,
	titleBoxWrapperStyles,
} from './styles';
import {
	type TitleBoxFooterProps,
	type TitleBoxHeaderProps,
	type TitleBoxWrapperProps,
} from './types';

export const TitleBoxWrapper = (props: TitleBoxWrapperProps) => {
	const { breakpoint, titleBoxBgColor } = props;

	return (
		<div
			id="titleBoxWrapper"
			data-testid="media-title-box"
			// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
			css={titleBoxWrapperStyles({
				breakpoint: breakpoint,
				titleBoxBgColor: titleBoxBgColor,
			})}
		>
			{props.children}
		</div>
	);
};

export const TitleBoxHeader = (props: TitleBoxHeaderProps) => {
	const { hasIconOverlap } = props;
	return (
		// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
		<div id="titleBoxHeader" css={titleBoxHeaderStyles({ hasIconOverlap })}>
			{props.children}
		</div>
	);
};

export const TitleBoxFooter = (props: TitleBoxFooterProps) => {
	const { hasIconOverlap } = props;
	return (
		// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
		<div id="titleBoxFooter" css={titleBoxFooterStyles({ hasIconOverlap })}>
			{props.children}
		</div>
	);
};

export const TitleBoxIcon = (props: any) => {
	return (
		// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
		<div id="titleBoxIcon" css={titleBoxIconStyles}>
			{props.children}
		</div>
	);
};

export const ErrorMessageWrapper = (props: any) => {
	// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	return <div css={errorMessageWrapperStyles}>{props.children}</div>;
};
