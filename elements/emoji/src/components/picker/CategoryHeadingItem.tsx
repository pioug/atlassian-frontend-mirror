/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { jsx } from '@compiled/react';

import { AbstractItem } from './AbstractItem';
import EmojiPickerCategoryHeading, {
	type Props as CategoryHeadingProps,
} from './EmojiPickerCategoryHeading';
import { sizes } from './EmojiPickerSizes';

export class CategoryHeadingItem extends AbstractItem<CategoryHeadingProps> {
	constructor(props: CategoryHeadingProps) {
		super(props, sizes.categoryHeadingHeight);
	}

	renderItem = (): JSX.Element => <EmojiPickerCategoryHeading {...this.props} />;
}
