import React, { Fragment, type HTMLAttributes } from 'react';

import { styled } from '@compiled/react';

import Link from '@atlaskit/link';
import { SimpleTag as Tag } from '@atlaskit/tag';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
const A = styled.a({
	color: 'red',
});

const StyledExample = (props: HTMLAttributes<HTMLAnchorElement>) => {
	// eslint-disable-next-line styled-components-a11y/anchor-has-content, @repo/internal/react/no-unsafe-spread-props
	return <A {...props} target="_blank" />;
};

interface SpreadExampleProps {
	children: string;
	className: string;
	href: string;
	tabIndex?: number;
}

const SpreadExample = ({ children, className, href }: SpreadExampleProps) => {
	const props = { className, href };
	return (
		<Link {...props} target="_blank">
			{children}
		</Link>
	);
};

export default () => {
	return (
		<Fragment>
			<Tag href="https://www.atlassian.com/search?query=Carrot%20cake" text="Carrot cake" />
			<p>
				You can also provide your own custom link component, which will have the appropriate styles
				applied to it. There are two ways of doing this while ensure that unneeded props are not
				pass to the anchor. See the code example for both approaches.
			</p>
			<Tag
				href="https://www.atlassian.com/search?query=Carrot%20cake"
				text="Blank target styled"
				linkComponent={StyledExample}
			/>
			<Tag
				href="https://www.atlassian.com/search?query=Carrot%20cake"
				text="Blank target spread"
				linkComponent={SpreadExample}
			/>
		</Fragment>
	);
};
