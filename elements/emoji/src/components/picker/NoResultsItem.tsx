/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { jsx } from '@compiled/react';

import { AbstractItem } from './AbstractItem';
import EmojiPickerNoResults, { type Props as NoResultsProps } from './EmojiPickerNoResults';
import { sizes } from './EmojiPickerSizes';

export class NoResultsItem extends AbstractItem<NoResultsProps> {
	constructor(props: NoResultsProps) {
		super(props, sizes.noResultsHeight);
	}

	renderItem = (): JSX.Element => <EmojiPickerNoResults {...this.props} />;
}
