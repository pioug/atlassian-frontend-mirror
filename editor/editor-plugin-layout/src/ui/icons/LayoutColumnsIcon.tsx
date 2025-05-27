/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { FC, ReactNode } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import LayoutFiveColumnsIcon from '@atlaskit/icon-lab/core/layout-five-columns';
import LayoutFourColumnsIcon from '@atlaskit/icon-lab/core/layout-four-columns';

const wrapperStyle = css({
	padding: '0 4px',
});

const Wrapper: FC<{ children: ReactNode }> = ({ children }) => {
	return <div css={wrapperStyle}>{children}</div>;
};

export const EditorLayoutFiveColumnsIcon = () => {
	return (
		<Wrapper>
			<LayoutFiveColumnsIcon label="" />
		</Wrapper>
	);
};

export const EditorLayoutFourColumnsIcon = () => {
	return (
		<Wrapper>
			<LayoutFourColumnsIcon label="" />
		</Wrapper>
	);
};
