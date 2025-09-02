/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';
import { css, cssMap, jsx } from '@compiled/react';
import { token } from '@atlaskit/tokens';
import { N40 } from '@atlaskit/theme/colors';
// These imports are not included in the manifest file to avoid circular package dependencies blocking our Typescript and bundling tooling
// eslint-disable-next-line import/no-extraneous-dependencies
import { getEmojis } from '@atlaskit/util-data-test/get-emojis';
import {
	EmojiPickerVirtualListInternal as EmojiPickerList,
	type Props,
} from '../src/components/picker/EmojiPickerList';

import { IntlProvider } from 'react-intl-next';

const allEmojis = getEmojis();

const emojiPickerHeight = 295;
const emojiPickerMinHeight = 260;
const heightOffset = 80;

const emojiPicker = css({
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'space-between',
	backgroundColor: token('elevation.surface.overlay', 'white'),
	border: `${token('color.border', N40)} 1px solid`,
	borderRadius: token('radius.small', '3px'),
	boxShadow: token('elevation.shadow.overlay', '0 3px 6px rgba(0, 0, 0, 0.2)'),
	height: '375px',
	width: '350px',
	minWidth: '350px',
	maxHeight: 'calc(80vh - 86px)', // ensure showing full picker in small device: mobile header is 40px (Jira) - 56px(Confluence and Atlas), reaction picker height is 24px with margin 6px,
});

const withoutPreviewHeight = cssMap({
	small: {
		height: `${emojiPickerHeight}px`,
		minHeight: `${emojiPickerMinHeight}px`,
	},
	medium: {
		height: `${emojiPickerHeight + heightOffset}px`,
		minHeight: `${emojiPickerMinHeight + heightOffset}px`,
	},
	large: {
		height: `${emojiPickerHeight + heightOffset * 2}px`,
		minHeight: `${emojiPickerMinHeight + heightOffset * 2}px`,
	},
});

export default function Example() {
	const [query, setQuery] = React.useState('');
	const [emojis, setEmojis] = React.useState(allEmojis);

	const onSearch = (value: string) => {
		setQuery(value);

		setEmojis(
			value.length === 0
				? allEmojis
				: allEmojis.filter(
						(emoji) => emoji.shortName.toLowerCase().indexOf(query.toLowerCase()) > -1,
					),
		);
	};

	const props = {
		emojis,
		query,
		onSearch,
	};

	return (
		<IntlProvider locale="en">
			<h3>Default Size - medium </h3>
			<div css={emojiPicker}>
				<EmojiPickerList {...(props as Props)} />
			</div>

			<h3>Small Size</h3>
			<div css={[emojiPicker, withoutPreviewHeight['small']]}>
				<EmojiPickerList {...(props as Props)} size="small" />
			</div>

			<h3>Medium Size</h3>
			<div css={[emojiPicker, withoutPreviewHeight['medium']]}>
				<EmojiPickerList {...(props as Props)} size="medium" />
			</div>

			<h3>Large Size</h3>
			<div css={[emojiPicker, withoutPreviewHeight['large']]}>
				<EmojiPickerList {...(props as Props)} size="large" />
			</div>
		</IntlProvider>
	);
}
