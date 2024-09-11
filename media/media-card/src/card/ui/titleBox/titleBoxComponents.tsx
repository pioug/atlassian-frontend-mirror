/**
 * @jsxRuntime classic
 * @jsx jsx
 */
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
	const { breakpoint, titleBoxBgColor, hidden } = props;

	return (
		<div
			id="titleBoxWrapper"
			data-testid="media-title-box"
			// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
			css={titleBoxWrapperStyles({
				breakpoint: breakpoint,
				display: hidden ? 'none' : 'flex',
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
		<div
			id="titleBoxHeader"
			data-testid="title-box-header"
			// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
			css={titleBoxHeaderStyles({ hasIconOverlap })}
		>
			{props.children}
		</div>
	);
};

export const TitleBoxFooter = (props: TitleBoxFooterProps) => {
	const { hasIconOverlap } = props;
	return (
		<div
			id="titleBoxFooter"
			data-testid="title-box-footer"
			// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
			css={titleBoxFooterStyles({ hasIconOverlap })}
		>
			{props.children}
		</div>
	);
};

export const TitleBoxIcon = (props: any) => {
	return (
		<div
			id="titleBoxIcon"
			data-testid="title-box-icon"
			// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
			css={titleBoxIconStyles}
		>
			{props.children}
		</div>
	);
};

export const ErrorMessageWrapper = (props: any) => {
	// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	return <div css={errorMessageWrapperStyles}>{props.children}</div>;
};
