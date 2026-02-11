/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { useState } from 'react';

import { cssMap, jsx } from '@compiled/react';

import UnstarredIcon from '@atlaskit/icon/core/star-unstarred';
import { LinkItem, type LinkItemProps } from '@atlaskit/menu';
import { Box } from '@atlaskit/primitives/compiled';

import ImgIcon from './common/img-icon';
import koala from './icons/koala.png';

const containerStyles = cssMap({
	root: {
		width: '500px',
	},
});

const useLinkItemComputedProps = ({ initialSelectedHref }: { initialSelectedHref?: string }) => {
	const [currentHref, setCurrentHref] = useState<string | undefined>(initialSelectedHref);

	const getComputedProps = ({ href, ...restProps }: LinkItemProps) => ({
		href,
		...restProps,
		isSelected: currentHref === href,
		onClick: () => {
			setCurrentHref(href);
		},
	});

	return {
		getComputedProps,
	};
};

const loremText =
	'Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptates incidunt nisi, esse ullam fugit omnis libero neque facilis magnam quaerat dolor iste consequuntur placeat, rerum numquam, eum tempora! Accusamus, quidem?';

const _default: () => JSX.Element = () => {
	const { getComputedProps } = useLinkItemComputedProps({
		initialSelectedHref: '#link-item2',
	});

	return (
		/**
		 * It is not normally acceptable to add click handlers to non-interactive elements
		 * as this is an accessibility anti-pattern. However, because this instance is
		 * for performance reasons (to avoid multiple click handlers) and not creating an
		 * inaccessible custom element, we can add role="presentation" so that there is
		 * no negative impacts to assistive technologies.
		 */
		// eslint-disable-next-line @atlassian/a11y/interactive-element-not-keyboard-focusable
		<Box
			onClick={(e: React.MouseEvent) => e.preventDefault()}
			role="presentation"
			xcss={containerStyles.root}
		>
			<LinkItem {...getComputedProps({ href: '#link-item1' })} testId="first-item">
				Customer Feedback
			</LinkItem>
			<LinkItem {...getComputedProps({ href: '#link-item2' })}>Customer Feedback</LinkItem>
			<LinkItem {...getComputedProps({ href: '#link-item3' })} isDisabled>
				Customer Feedback
			</LinkItem>
			<LinkItem {...getComputedProps({ href: '#link-item4' })} description="Classic service desk">
				Customer Feedback
			</LinkItem>
			<LinkItem
				{...getComputedProps({ href: '#link-item5' })}
				iconBefore={<ImgIcon src={koala} alt="" />}
				description="Classic service desk"
			>
				Customer Feedback
			</LinkItem>
			<LinkItem {...getComputedProps({ href: 'https://atlassian.design' })} testId="link-item">
				Atlassian Design
			</LinkItem>
			<LinkItem
				{...getComputedProps({ href: '#link-item7' })}
				iconBefore={<UnstarredIcon label="" />}
			>
				With iconBefore prop
			</LinkItem>
			<LinkItem
				{...getComputedProps({ href: '#link-item8' })}
				iconAfter={<UnstarredIcon label="" />}
			>
				With iconAfter prop
			</LinkItem>
			<LinkItem
				{...getComputedProps({ href: '#link-item9' })}
				iconBefore={<UnstarredIcon label="" />}
				iconAfter={<UnstarredIcon label="" />}
			>
				With both iconAfter and iconBefore prop
			</LinkItem>
			<LinkItem
				{...getComputedProps({ href: '#link-item10' })}
				description={loremText}
				iconBefore={<UnstarredIcon label="" />}
				iconAfter={<UnstarredIcon label="" />}
			>
				{loremText}
			</LinkItem>
			<LinkItem
				{...getComputedProps({ href: '#link-item11' })}
				description={loremText}
				iconBefore={<UnstarredIcon label="" />}
				iconAfter={<UnstarredIcon label="" />}
				shouldTitleWrap
				shouldDescriptionWrap
			>
				{loremText}
			</LinkItem>
		</Box>
	);
};
export default _default;
