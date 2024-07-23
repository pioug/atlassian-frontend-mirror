/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import { type ReactNode, type FC } from 'react';
import { enableMediaUfoLogger } from '@atlaskit/media-test-helpers';
import { payloadPublisher } from '@atlassian/ufo';
import {
	containerStyles,
	groupStyles,
	buttonListStyles,
	mVSidebarHeaderStyles,
	mVSidebarStyles,
} from './styles';

type Props = {
	children: ReactNode;
	shouldApplyStyles?: boolean;
};

export const MainWrapper: FC<Props> = ({ children, shouldApplyStyles = true }) => {
	enableMediaUfoLogger(payloadPublisher);
	// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	return <div css={shouldApplyStyles && containerStyles}>{children}</div>;
};

export const Group: FC<Props> = ({ children }) => {
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
	return <div css={groupStyles}>{children}</div>;
};

export const ButtonList: FC<Props> = ({ children }) => {
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
	return <ul css={buttonListStyles}>{children}</ul>;
};

export const MVSidebarHeader: FC<Props> = ({ children }) => {
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
	return <div css={mVSidebarHeaderStyles}>{children}</div>;
};

export const MVSidebar: FC<Props> = ({ children }) => {
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
	return <div css={mVSidebarStyles}>{children}</div>;
};
