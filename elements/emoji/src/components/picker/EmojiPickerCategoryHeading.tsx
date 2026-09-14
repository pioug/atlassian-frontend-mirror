/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { css, jsx } from '@compiled/react';
import { FormattedMessage } from 'react-intl';

import Heading from '@atlaskit/heading/heading';
import { token } from '@atlaskit/tokens';

import { isMessagesKey } from '../../util/is-messages-key';
import { messages } from '../i18n';
import type { CategoryGroupKey } from './categories';

const emojiCategoryTitle = css({
	boxSizing: 'border-box',
	color: token('color.text'),
	font: token('font.body'),
	paddingTop: token('space.075'),
	paddingBottom: token('space.075'),
	paddingLeft: token('space.100'),
	paddingRight: token('space.100'),
	textTransform: 'lowercase',
	// Reset heading element default styles to avoid visual changes
	margin: 0,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	'&:first-letter': {
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
		textTransform: 'uppercase',
	},
});

/**
 * Test id for wrapper Emoji Picker List div
 */
export const RENDER_EMOJI_PICKER_CATEGORY_HEADING_TESTID = 'render-emoji-picker-categorty-heading';

export interface Props {
	className?: string;
	id: CategoryGroupKey;
	title: string;
}

const EmojiPickerCategoryHeading = ({ id, title, className }: Props): JSX.Element => (
	<div
		id={id}
		data-category-id={id}
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
		className={className}
		data-testid={RENDER_EMOJI_PICKER_CATEGORY_HEADING_TESTID}
		role="presentation"
	>
		<div css={emojiCategoryTitle}>
			<Heading size="xsmall" as="h2">
				{isMessagesKey(title) ? <FormattedMessage {...messages[title]} /> : title}
			</Heading>
		</div>
	</div>
);

export default EmojiPickerCategoryHeading;
