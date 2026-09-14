/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { type ReactNode } from 'react';

import { jsx } from '@emotion/react'; // eslint-disable-line @atlaskit/ui-styling-standard/use-compiled, @typescript-eslint/consistent-type-imports -- Ignored via go/DSP-18766

import { type FileStatus } from '../src';
import { fileWrapperStyles } from './styles';

export const FileWrapper = ({
	children,
	status,
}: {
	children: ReactNode;
	status: FileStatus;
}): jsx.JSX.Element => {
	// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	return <div css={fileWrapperStyles(status)}>{children}</div>;
};
