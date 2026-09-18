import React, { forwardRef } from 'react';

import ArrowUpRightIcon from '@atlaskit/icon/core/arrow-up-right';
import type { CustomItemComponentProps } from '@atlaskit/menu/types';
// eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
import { CustomItem } from '@atlaskit/side-navigation/custom-item';
import { Section } from '@atlaskit/side-navigation/section';

type CustomProps = CustomItemComponentProps & { href: string };

const CustomLink: React.ForwardRefExoticComponent<
	React.PropsWithoutRef<CustomProps> & React.RefAttributes<HTMLAnchorElement>
> = forwardRef<HTMLAnchorElement, CustomProps>((props: CustomProps, ref) => {
	const { children, ...rest } = props;
	return (
		<>
			{/* eslint-disable-next-line @atlassian/a11y/click-events-have-key-events, @atlaskit/design-system/no-html-anchor, @atlassian/a11y/no-static-element-interactions */}
			<a ref={ref} {...rest} onClick={(e) => e.preventDefault()}>
				{children}
			</a>
		</>
	);
});

const ButtonItemExample = (): React.JSX.Element => {
	return (
		<div>
			<Section>
				<CustomItem
					href="/create-work-item"
					component={CustomLink}
					iconAfter={<ArrowUpRightIcon label="" />}
				>
					Create external work item
				</CustomItem>
			</Section>
		</div>
	);
};

export default ButtonItemExample;
