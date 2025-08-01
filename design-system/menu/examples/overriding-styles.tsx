/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

import { cssMap, jsx } from '@compiled/react';

import RightArrow from '@atlaskit/icon/glyph/arrow-right';
import { ButtonItem } from '@atlaskit/menu';
import { token } from '@atlaskit/tokens';

import ImgIcon from './common/img-icon';
import koala from './icons/koala.png';

const styles = cssMap({
	buttonOne: {
		paddingBlockStart: token('space.150', '12px'),
		paddingInlineEnd: token('space.250', '20px'),
		paddingBlockEnd: token('space.150', '12px'),
		paddingInlineStart: token('space.250', '20px'),
		borderStyle: 'solid',
		borderWidth: token('border.width'),
		borderColor: '#CDCDCD',
		backgroundColor: 'aliceblue',
		borderRadius: 3,
		'&:hover': {
			backgroundColor: 'antiquewhite',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'[data-item-description]': {
			fontStyle: 'italic',
			textDecoration: 'underline',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'[data-item-elem-before]': { filter: 'grayscale(1)' },
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'[data-item-elem-after]': { opacity: 0 },
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'&:hover [data-item-elem-after]': { opacity: 1 },
	},
	selected: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'[data-item-description]': {
			textDecoration: 'underline',
		},
	},
	buttonTwo: {
		color: 'red',
		'&:hover': {
			color: 'green',
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'[data-item-description]': {
				color: 'green',
			},
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'[data-item-description]': {
			color: 'red',
		},
	},
});

export default () => (
	<React.Fragment>
		<ButtonItem
			onClick={console.log}
			iconBefore={<ImgIcon src={koala} alt="" />}
			description="Hover over me"
			iconAfter={<RightArrow label="" />}
			isSelected
			css={[styles.buttonOne, styles.selected]}
		>
			Button item
		</ButtonItem>
		<ButtonItem
			onClick={console.log}
			iconBefore={<ImgIcon alt="" src={koala} />}
			description="Hover over me"
			iconAfter={<RightArrow label="" />}
			css={styles.buttonTwo}
		>
			Button item
		</ButtonItem>
	</React.Fragment>
);
