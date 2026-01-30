/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@compiled/react';

import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/new';
import { type Size } from '@atlaskit/icon/types';
import { token } from '@atlaskit/tokens';

import ActivityIcon from '../glyph/activity';
import AddIcon from '../glyph/add';
import AddCircleIcon from '../glyph/add-circle';
import AddItemIcon from '../glyph/add-item';
import AddonIcon from '../glyph/addon';
import ArrowDownIcon from '../glyph/arrow-down';
import ArrowLeftIcon from '../glyph/arrow-left';
import ArrowLeftCircleIcon from '../glyph/arrow-left-circle';
import ArrowRightIcon from '../glyph/arrow-right';
import ArrowUpIcon from '../glyph/arrow-up';
import AppSwitcherIcon from '../glyph/menu';

const iconRowStyles = css({
	display: 'flex',
	justifyContent: 'flex-start',
	flexDirection: 'row',
	marginBlockStart: token('space.100', '8px'),
});

const iconWrapperStyles = css({
	marginBlockEnd: token('space.050', '4px'),
	marginBlockStart: token('space.050', '4px'),
	marginInlineEnd: token('space.050', '4px'),
	marginInlineStart: token('space.050', '4px'),
});

const demoIcons = [
	ActivityIcon,
	AddCircleIcon,
	AddItemIcon,
	AddIcon,
	AddonIcon,
	AppSwitcherIcon,
	ArrowDownIcon,
	ArrowLeftCircleIcon,
	ArrowLeftIcon,
	ArrowRightIcon,
	ArrowUpIcon,
];

const sizes: Size[] = ['small', 'medium', 'large', 'xlarge'];

const IconSizeExample = ({ defaultSize = 'medium' }: { defaultSize: Size }) => {
	const [size, setSize] = useState<Size>(defaultSize);

	return (
		<div>
			<ButtonGroup label="Choose icon size">
				{sizes.map((sizeOpt) => (
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					<div style={{ marginRight: token('space.050', '4px') }} key={sizeOpt}>
						<Button testId={sizeOpt} isSelected={sizeOpt === size} onClick={() => setSize(sizeOpt)}>
							{sizeOpt}
						</Button>
					</div>
				))}
			</ButtonGroup>
			<div id="size-example" css={iconRowStyles}>
				{demoIcons.map((Icon, i) => (
					<span css={iconWrapperStyles} key={i}>
						<Icon testId={`icon-${i}`} label={`Icon ${i}`} size={size} />
					</span>
				))}
			</div>
		</div>
	);
};

export const IconSizeSmall: () => JSX.Element = () => <IconSizeExample defaultSize="small" />;
export const IconSizeMedium: () => JSX.Element = () => <IconSizeExample defaultSize="medium" />;
export const IconSizeLarge: () => JSX.Element = () => <IconSizeExample defaultSize="large" />;
export const IconSizeXLarge: () => JSX.Element = () => <IconSizeExample defaultSize="xlarge" />;

export default IconSizeExample;
