/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { css, jsx } from '@compiled/react';

import Spinner from '@atlaskit/spinner/spinner';

import { AbstractItem } from './AbstractItem';
import { sizes } from './EmojiPickerSizes';

const emojiPickerSpinner = css({
	display: 'flex',
	width: '100%',
	height: '150px',
	justifyContent: 'center',
	alignItems: 'center',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'>div': {
		flex: '0 0 auto',
	},
});

export class LoadingItem extends AbstractItem<{}> {
	constructor() {
		super({}, sizes.loadingRowHeight);
	}

	renderItem = (): JSX.Element => (
		<div css={emojiPickerSpinner}>
			<div>
				<Spinner size="medium" />
			</div>
		</div>
	);
}
