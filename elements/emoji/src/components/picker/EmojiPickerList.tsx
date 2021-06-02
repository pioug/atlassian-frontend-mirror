import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { PureComponent } from 'react';
import { List as VirtualList } from 'react-virtualized/dist/commonjs/List';
import { customCategory, userCustomTitle } from '../../util/constants';
import {
  EmojiDescription,
  EmojiId,
  OnCategory,
  OnEmojiEvent,
  ToneSelection,
  User,
} from '../../types';
import { EmojiContext } from '../common/internal-types';
import {
  CategoryDescriptionMap,
  CategoryGroupKey,
  CategoryId,
} from './categories';
import CategoryTracker from './CategoryTracker';
import { sizes } from './EmojiPickerSizes';
import * as Items from './EmojiPickerVirtualItems';
import {
  CategoryHeadingItem,
  EmojisRowItem,
  LoadingItem,
  VirtualItem,
  virtualItemRenderer,
} from './EmojiPickerVirtualItems';
import * as styles from './styles';
import EmojiPickerListSearch from './EmojiPickerListSearch';

const categoryClassname = 'emoji-category';

type CategoryKeyToGroup = { [key in CategoryGroupKey]: EmojiGroup };

export interface OnSearch {
  (query: string): void;
}

export interface Props {
  emojis: EmojiDescription[];
  currentUser?: User;
  onEmojiSelected?: OnEmojiEvent;
  onEmojiActive?: OnEmojiEvent;
  onEmojiDelete?: OnEmojiEvent;
  onCategoryActivated?: OnCategory;
  onMouseLeave?: () => void;
  onMouseEnter?: () => void;
  selectedTone?: ToneSelection;
  onSearch?: OnSearch;
  loading?: boolean;
  query?: string;
}

export interface State {}

/**
 * Emoji grouped by a category title ie. Frequent, Your Uploads, All Uploads
 */
interface EmojiGroup {
  emojis: EmojiDescription[];
  title: string;
  category: CategoryGroupKey;
  order: number;
}

type Orderable = {
  order?: number;
};

const byOrder = (orderableA: Orderable, orderableB: Orderable) =>
  (orderableA.order || 0) - (orderableB.order || 0);

export default class EmojiPickerVirtualList extends PureComponent<
  Props,
  State
> {
  static contextTypes = {
    emoji: PropTypes.object,
  };

  static childContextTypes = {
    emoji: PropTypes.object,
  };

  static defaultProps = {
    onEmojiSelected: () => {},
    onEmojiActive: () => {},
    onEmojiDelete: () => {},
    onCategoryActivated: () => {},
    onSearch: () => {},
  };

  private allEmojiGroups!: EmojiGroup[];
  private activeCategoryId: CategoryId | undefined | null;
  private virtualItems: VirtualItem<any>[] = [];
  private categoryTracker: CategoryTracker = new CategoryTracker();

  context!: EmojiContext;

  constructor(props: Props) {
    super(props);

    this.buildEmojiGroupedByCategory(props.emojis, props.currentUser);
    this.buildVirtualItems(props, this.state);
  }

  getChildContext(): EmojiContext {
    const { emoji } = this.context;
    return {
      emoji: {
        ...emoji,
      },
    };
  }

  UNSAFE_componentWillUpdate(nextProps: Props, nextState: State) {
    if (
      this.props.emojis !== nextProps.emojis ||
      this.props.selectedTone !== nextProps.selectedTone ||
      this.props.loading !== nextProps.loading ||
      this.props.query !== nextProps.query
    ) {
      if (!nextProps.query) {
        // Only refresh if no query
        this.buildEmojiGroupedByCategory(
          nextProps.emojis,
          nextProps.currentUser,
        );
      }
      this.buildVirtualItems(nextProps, nextState);
    }
  }

  private onEmojiMouseEnter = (emojiId: EmojiId, emoji?: EmojiDescription) => {
    if (this.props.onEmojiActive) {
      this.props.onEmojiActive(emojiId, emoji);
    }
  };

  private onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (this.props.onSearch) {
      this.props.onSearch(e.target.value);
    }
  };

  /**
   * Scrolls to a category in the list view
   */
  reveal(category: CategoryId) {
    const row = this.categoryTracker.getRow(category);
    const list = this.refs.list as VirtualList;
    list.scrollToRow(row);
  }

  scrollToBottom() {
    const list = this.refs.list as VirtualList;
    list.scrollToRow(this.virtualItems.length);
  }

  private buildVirtualItemFromGroup = (
    group: EmojiGroup,
  ): VirtualItem<any>[] => {
    const { onEmojiSelected, onEmojiDelete } = this.props;
    const items: VirtualItem<any>[] = [];

    items.push(
      new CategoryHeadingItem({
        id: group.category,
        title: group.title,
        className: categoryClassname,
      }),
    );

    let remainingEmojis = group.emojis;
    while (remainingEmojis.length > 0) {
      const rowEmojis = remainingEmojis.slice(0, sizes.emojiPerRow);
      remainingEmojis = remainingEmojis.slice(sizes.emojiPerRow);

      items.push(
        new EmojisRowItem({
          emojis: rowEmojis,
          title: group.title,
          showDelete: group.title === userCustomTitle,
          onSelected: onEmojiSelected,
          onDelete: onEmojiDelete,
          onMouseMove: this.onEmojiMouseEnter,
        }),
      );
    }

    return items;
  };

  private buildVirtualItems = (props: Props, _state: State): void => {
    const { emojis, loading, query } = props;

    let items: Items.VirtualItem<any>[] = [];

    this.categoryTracker.reset();

    if (loading) {
      items.push(new LoadingItem());
    } else {
      if (query) {
        const search = CategoryDescriptionMap.SEARCH;
        // Only a single "result" category
        items = [
          ...items,
          ...this.buildVirtualItemFromGroup({
            category: 'SEARCH',
            title: search.name,
            emojis,
            order: search.order,
          }),
        ];
      } else {
        // Group by category

        // Not searching show in categories.
        this.allEmojiGroups.forEach((group) => {
          // Optimisation - avoid re-rendering unaffected groups for the current selectedShortcut
          // by not passing it to irrelevant groups
          this.categoryTracker.add(
            group.emojis[0].category as CategoryId,
            items.length,
          );

          items = [...items, ...this.buildVirtualItemFromGroup(group)];
        });
      }
    }

    const rowCountChanged = this.virtualItems.length !== items.length;

    this.virtualItems = items;

    const list = this.refs.list as VirtualList;

    if (!rowCountChanged && list) {
      // Row count has not changed, so need to tell list to rerender.
      list.forceUpdateGrid();
    }
    if (!query && list) {
      // VirtualList can apply stale heights since it performs a shallow
      // compare to check if the list has changed. Should manually recompute
      // row heights for the case when frequent category come in later
      list.recomputeRowHeights();
    }
  };

  private addToCategoryMap = (
    categoryToGroupMap: CategoryKeyToGroup,
    emoji: EmojiDescription,
    category: CategoryGroupKey,
  ): CategoryKeyToGroup => {
    if (!categoryToGroupMap[category]) {
      const categoryDefinition = CategoryDescriptionMap[category];
      categoryToGroupMap[category] = {
        emojis: [],
        title: categoryDefinition.name,
        category,
        order: categoryDefinition.order,
      };
    }
    categoryToGroupMap[category].emojis.push(emoji);
    return categoryToGroupMap;
  };

  private groupByCategory = (currentUser?: User) => (
    categoryToGroupMap: CategoryKeyToGroup,
    emoji: EmojiDescription,
  ): CategoryKeyToGroup => {
    this.addToCategoryMap(
      categoryToGroupMap,
      emoji,
      emoji.category as CategoryId,
    );
    // separate user emojis
    if (
      emoji.category === customCategory &&
      currentUser &&
      emoji.creatorUserId === currentUser.id
    ) {
      this.addToCategoryMap(categoryToGroupMap, emoji, 'USER_CUSTOM');
    }
    return categoryToGroupMap;
  };

  private buildEmojiGroupedByCategory = (
    emojis: EmojiDescription[],
    currentUser?: User,
  ): void => {
    const categoryToGroupMap = emojis.reduce(
      this.groupByCategory(currentUser),
      {} as CategoryKeyToGroup,
    );

    this.allEmojiGroups = (Object.keys(
      categoryToGroupMap,
    ) as CategoryGroupKey[])
      .map((key: CategoryGroupKey) => categoryToGroupMap[key])
      .map((group) => {
        if (group.category !== 'FREQUENT') {
          group.emojis.sort(byOrder);
        }
        return group;
      })
      .sort(byOrder);
  };

  private repaintList = () => {
    if (this.refs.root) {
      const root = this.refs.root as HTMLDivElement;
      const display = root.style.display;
      root.style.display = 'none';

      // we need to access offset to force repaint
      // eslint-disable-next-line no-unused-expressions
      root.offsetHeight;
      root.style.display = display;
    }
  };

  /**
   * Checks if list is showing a new CategoryId
   * to inform selector to change active category
   */
  private checkCategoryIdChange = (indexes: { startIndex: number }) => {
    const { startIndex } = indexes;

    // FS-1844 Fix a rendering problem when scrolling to the top
    if (startIndex === 0) {
      this.repaintList();
    }

    if (!this.props.query) {
      // Calculate category in view - only relevant if categories shown, i.e. no query
      const list = this.refs.list as VirtualList;
      const currentCategory = this.categoryTracker.findNearestCategoryAbove(
        startIndex,
        list,
      );

      if (currentCategory && this.activeCategoryId !== currentCategory) {
        this.activeCategoryId = currentCategory;
        if (this.props.onCategoryActivated) {
          this.props.onCategoryActivated(currentCategory);
        }
      }
    }
  };

  private rowSize = ({ index }: { index: number }) =>
    this.virtualItems[index].height;
  private renderRow = (context: Items.VirtualRenderContext) =>
    virtualItemRenderer(this.virtualItems, context);

  render() {
    const { onMouseLeave, onMouseEnter, query } = this.props;
    const classes = [styles.emojiPickerList];

    return (
      <div
        ref="root"
        className={classNames(classes)}
        onMouseLeave={onMouseLeave}
        onMouseEnter={onMouseEnter}
      >
        <EmojiPickerListSearch onChange={this.onSearch} query={query} />
        <VirtualList
          ref="list"
          height={sizes.listHeight}
          overscanRowCount={5}
          rowCount={this.virtualItems.length}
          rowHeight={this.rowSize}
          rowRenderer={this.renderRow}
          scrollToAlignment="start"
          width={sizes.listWidth}
          className={styles.virtualList}
          onRowsRendered={this.checkCategoryIdChange}
        />
      </div>
    );
  }
}
