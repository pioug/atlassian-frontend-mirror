import Spinner from '@atlaskit/spinner';
import React from 'react';
import { ReactNode } from 'react';
import EmojiPickerCategoryHeading, {
  Props as CategoryHeadingProps,
} from './EmojiPickerCategoryHeading';
import EmojiPickerEmojiRow, {
  Props as EmojiRowProps,
} from './EmojiPickerEmojiRow';
import { sizes } from './EmojiPickerSizes';
import * as styles from './styles';

export interface RenderItem {
  (context?: VirtualRenderContext): ReactNode;
}

export interface VirtualItem<P> {
  height: number;
  props: P;
  renderItem: RenderItem;
}

export abstract class AbstractItem<P> implements VirtualItem<P> {
  readonly height: number;
  readonly props: P;

  constructor(props: P, height: number) {
    this.props = props;
    this.height = height;
  }

  abstract renderItem: RenderItem;
}

export class EmojisRowItem extends AbstractItem<EmojiRowProps> {
  constructor(props: EmojiRowProps) {
    super(props, sizes.emojiRowHeight);
  }

  renderItem = () => <EmojiPickerEmojiRow {...this.props} />;
}

export class LoadingItem extends AbstractItem<{}> {
  constructor() {
    super({}, sizes.loadingRowHeight);
  }

  renderItem = () => (
    <div className={styles.emojiPickerSpinner}>
      <div>
        <Spinner size="medium" />
      </div>
    </div>
  );
}

export class CategoryHeadingItem extends AbstractItem<CategoryHeadingProps> {
  constructor(props: CategoryHeadingProps) {
    super(props, sizes.categoryHeadingHeight);
  }

  renderItem = () => <EmojiPickerCategoryHeading {...this.props} />;
}

/**
 * These are the values provided by react-virtualized.
 */
export interface VirtualRenderContext {
  index: number; // Index of row
  isScrolling: boolean; // The List is currently being scrolled
  isVisible: boolean; // This row is visible within the List (eg it is not an overscanned row)
  key: any; // Unique key within array of rendered rows
  parent: any; // Reference to the parent List (instance)
  style: any; // Style object to be applied to row (to position it);
  // This must be passed through to the rendered row element.
}

export const virtualItemRenderer = (
  rows: VirtualItem<any>[],
  context: VirtualRenderContext,
) => {
  const { index, key, style } = context;
  const row: VirtualItem<any> = rows[index];

  return (
    <div style={style} key={key}>
      {row.renderItem(context)}
    </div>
  );
};
