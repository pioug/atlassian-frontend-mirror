/** @jsx jsx */
import type { ReactNode } from 'react';
import { jsx } from '@emotion/react';
import Spinner from '@atlaskit/spinner';
import EmojiPickerCategoryHeading, {
  Props as CategoryHeadingProps,
} from './EmojiPickerCategoryHeading';
import EmojiPickerEmojiRow, {
  Props as EmojiRowProps,
} from './EmojiPickerEmojiRow';
import { sizes } from './EmojiPickerSizes';
import { emojiPickerSpinner } from './styles';
import type { VirtualItem as VirtualItemContext } from '@tanstack/react-virtual';

export interface RenderItem {
  (context?: VirtualItemContext): ReactNode;
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

  renderItem = (context?: VirtualItemContext) => (
    <EmojiPickerEmojiRow {...this.props} virtualItemContext={context} />
  );
}

export class LoadingItem extends AbstractItem<{}> {
  constructor() {
    super({}, sizes.loadingRowHeight);
  }

  renderItem = () => (
    <div css={emojiPickerSpinner}>
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

export const virtualItemRenderer = (
  rows: VirtualItem<CategoryHeadingProps | EmojiRowProps | {}>[],
  context: VirtualItemContext,
) => {
  const { index, key } = context;
  const row: VirtualItem<CategoryHeadingProps | EmojiRowProps | {}> =
    rows[index];
  return <div key={key}>{row && row.renderItem(context)}</div>;
};
