/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import type { FC, ReactNode } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled, @typescript-eslint/consistent-type-imports
import { css, jsx } from '@emotion/react';

import LayoutFiveColumnsIcon from '@atlaskit/icon-lab/core/layout-five-columns';
import LayoutFourColumnsIcon from '@atlaskit/icon-lab/core/layout-four-columns';

const wrapperStyle = css({
	padding: '0 4px',
});

const Wrapper: FC<{ children: ReactNode }> = ({ children }) => {
	return <div css={wrapperStyle}>{children}</div>;
};

export const EditorLayoutFiveColumnsIcon = (): jsx.JSX.Element => {
	return (
		<Wrapper>
			<LayoutFiveColumnsIcon label="" />
		</Wrapper>
	);
};

export const EditorLayoutFourColumnsIcon = (): jsx.JSX.Element => {
	return (
		<Wrapper>
			<LayoutFourColumnsIcon label="" />
		</Wrapper>
	);
};
