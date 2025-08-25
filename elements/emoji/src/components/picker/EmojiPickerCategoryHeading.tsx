/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@compiled/react';
import { token } from '@atlaskit/tokens';
import { N900 } from '@atlaskit/theme/colors';
import { FormattedMessage } from 'react-intl-next';
import { isMessagesKey } from '../../util/type-helpers';
import { messages } from '../i18n';
import type { CategoryGroupKey } from './categories';

const emojiCategoryTitle = css({
	boxSizing: 'border-box',
	color: token('color.text', N900),
	font: token('font.body'),
	paddingTop: token('space.075', '6px'),
	paddingBottom: token('space.075', '6px'),
	paddingLeft: token('space.100', '8px'),
	paddingRight: token('space.100', '8px'),
	textTransform: 'lowercase',
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

const EmojiPickerCategoryHeading = ({ id, title, className }: Props) => (
	<div
		id={id}
		data-category-id={id}
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
		className={className}
		data-testid={RENDER_EMOJI_PICKER_CATEGORY_HEADING_TESTID}
		role="rowheader"
	>
		<div css={emojiCategoryTitle}>
			{isMessagesKey(title) ? <FormattedMessage {...messages[title]} /> : title}
		</div>
	</div>
);

export default EmojiPickerCategoryHeading;
