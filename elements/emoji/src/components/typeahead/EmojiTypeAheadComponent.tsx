/** @jsx jsx */
import type {
  AnalyticsEventPayload,
  CreateUIAnalyticsEvent,
} from '@atlaskit/analytics-next';
import { jsx } from '@emotion/react';
import { PureComponent } from 'react';
import { flushSync } from 'react-dom';
import uuid from 'uuid';
import type {
  EmojiProvider,
  OnEmojiProviderChange,
} from '../../api/EmojiResource';
import { EmojiCommonProvider } from '../../context/EmojiCommonProvider';
import {
  SearchSort,
  type EmojiDescription,
  type EmojiSearchResult,
  type OnEmojiEvent,
  type SearchOptions,
  type ToneSelection,
} from '../../types';
import {
  typeaheadCancelledEvent,
  typeaheadRenderedEvent,
  typeaheadSelectedEvent,
  ufoExperiences,
} from '../../util/analytics';
import { defaultListLimit } from '../../util/constants';
import debug from '../../util/logger';
import { toEmojiId } from '../../util/type-helpers';
import { createRecordSelectionDefault } from '../common/RecordSelectionDefault';

import EmojiList from './EmojiTypeAheadList';
import { emojiTypeAhead } from './styles';

export interface OnLifecycle {
  (): void;
}

export interface EmojiTypeAheadBaseProps {
  /**
   * Callback to be executed when user selects an emoji.
   */
  onSelection?: OnEmojiEvent;
  /**
   * Search query.
   */
  query?: string;
  /**
   * Number of results to be displayed in the search results list
   */
  listLimit?: number;
  /**
   * Callback to be executed when typeahead component is being shown
   */
  onOpen?: OnLifecycle;
  /**
   * Callback to be executed when typeahead component disappears
   */
  onClose?: OnLifecycle;
  createAnalyticsEvent?: CreateUIAnalyticsEvent;
}

export interface Props extends EmojiTypeAheadBaseProps {
  /**
   * EmojiResource instance that handles fetching of emoji data.
   */
  emojiProvider: EmojiProvider;
}

export interface State {
  visible: boolean;
  emojis: EmojiDescription[];
  loading: boolean;
}

const isFullShortName = (query?: string) =>
  query &&
  query.length > 1 &&
  query.charAt(0) === ':' &&
  query.charAt(query.length - 1) === ':';

const uniqueExactShortNameMatchIndex = (
  searchResult: EmojiSearchResult,
  query?: string,
): number | undefined => {
  if (!query) {
    return undefined;
  }
  query = query.toLowerCase();
  let matchIndex: number | undefined;

  let index = 0;
  for (const emoji of searchResult.emojis) {
    if (query && emoji.shortName.toLowerCase() === query) {
      if (matchIndex === undefined) {
        matchIndex = index;
      } else {
        return;
      }
    }
    index++;
  }
  return matchIndex;
};

export default class EmojiTypeAheadComponent extends PureComponent<
  Props,
  State
> {
  static defaultProps = {
    onSelection: () => {},
    onOpen: () => {},
    onClose: () => {},
    listLimit: defaultListLimit,
  };

  private emojiListRef: EmojiList | null = null;

  private openTime: number = 0;
  private renderStartTime: number = 0;
  private selectedTone: ToneSelection;
  private pressed: boolean;
  private sessionId: string;
  private selected: boolean;

  constructor(props: Props) {
    super(props);
    this.state = {
      visible: true,
      emojis: [],
      loading: true,
    };
    if (this.props.onOpen) {
      this.props.onOpen();
    }
    this.openTime = Date.now();
    this.renderStartTime = this.openTime;
    this.selectedTone = props.emojiProvider.getSelectedTone();
    this.pressed = false;
    this.sessionId = uuid();
    this.selected = false;
  }

  componentDidMount() {
    const { emojiProvider } = this.props;
    emojiProvider.subscribe(this.onProviderChange);
    this.onSearch(this.props.query);
  }

  componentWillUnmount() {
    const { emojiProvider, query } = this.props;
    const { emojis } = this.state;
    emojiProvider.unsubscribe(this.onProviderChange);
    if (!this.selected) {
      this.fireAnalyticsEvent(
        typeaheadCancelledEvent(Date.now() - this.openTime, query, emojis),
      );
    }
    ufoExperiences['emoji-searched'].abort({
      metadata: {
        source: 'EmojiTypeAheadComponent',
        reason: 'unmount',
        query,
      },
    });
    ufoExperiences['emoji-selection-recorded'].abort({
      metadata: {
        source: 'EmojiTypeAheadComponent',
        reason: 'unmount',
        query,
      },
    });
    this.sessionId = uuid();
    this.selected = false;
  }

  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    const prevEmojiProvider = this.props.emojiProvider;
    const nextEmojiProvider = nextProps.emojiProvider;
    if (prevEmojiProvider !== nextEmojiProvider) {
      prevEmojiProvider.unsubscribe(this.onProviderChange);
      nextEmojiProvider.subscribe(this.onProviderChange);
      this.onSearch(nextProps.query);
    } else if (this.props.query !== nextProps.query) {
      this.onSearch(nextProps.query);
    }
  }

  selectNext = () => {
    if (this.emojiListRef) {
      this.emojiListRef.selectNext();
    }
  };

  selectPrevious = () => {
    if (this.emojiListRef) {
      this.emojiListRef.selectPrevious();
    }
  };

  chooseCurrentSelection = () => {
    this.pressed = true;
    if (this.emojiListRef) {
      this.emojiListRef.chooseCurrentSelection();
    }
  };

  count = (): number => {
    const { emojis } = this.state;
    return (emojis && emojis.length) || 0;
  };

  getTone = (tone?: number): string | undefined => {
    return typeof tone === 'undefined'
      ? undefined
      : tone >= 0 && tone <= 5
      ? ['default', 'light', 'mediumLight', 'medium', 'mediumDark', 'dark'][
          tone
        ]
      : undefined;
  };

  private fireAnalyticsEvent(payload: AnalyticsEventPayload) {
    if (!this.props.createAnalyticsEvent) {
      return;
    }
    payload.attributes.sessionId = this.sessionId;

    this.props.createAnalyticsEvent(payload).fire('fabric-elements');
  }

  private onSearch(query?: string) {
    const { emojiProvider, listLimit } = this.props;
    const options: SearchOptions = {
      limit: listLimit || defaultListLimit,
      skinTone: this.selectedTone,
    };

    if (query && query.replace(':', '').length > 0) {
      options.sort = SearchSort.Default;
    } else {
      // if empty query (i.e. typeahead triggered only) then only sort by usage
      options.sort = SearchSort.UsageFrequency;
    }

    this.renderStartTime = Date.now();

    emojiProvider.filter(query, options);
  }

  private onSearchResult = (result: EmojiSearchResult): void => {
    const { emojis, query } = result;
    const wasVisible = this.state.visible;
    const visible = emojis.length > 0;
    this.fireAnalyticsEvent(
      typeaheadRenderedEvent(Date.now() - this.renderStartTime, query, emojis),
    );

    debug(
      'emoji-typeahead.applyPropChanges',
      emojis.length,
      wasVisible,
      visible,
    );

    // Synchronously flush state update, because there is some analytics in fireSelectionEvent
    // that relies on emojis being set to determine the position
    flushSync(() => {
      this.setState({
        emojis: emojis,
        visible,
        loading: false,
      });
    });

    if (isFullShortName(query)) {
      const matchIndex = uniqueExactShortNameMatchIndex(result, query);

      if (matchIndex !== undefined) {
        const onSelect = createRecordSelectionDefault(
          this.props.emojiProvider,
          this.props.onSelection,
          (analytic) => this.fireAnalyticsEvent(analytic('typeahead')),
        );
        this.fireSelectionEvent(result.emojis[matchIndex], true);
        onSelect(
          toEmojiId(result.emojis[matchIndex]),
          result.emojis[matchIndex],
        );
      }
    }

    if (wasVisible !== visible) {
      if (visible) {
        if (this.props.onOpen) {
          this.props.onOpen();
        }
      } else {
        if (this.props.onClose) {
          this.props.onClose();
        }
      }
    }
  };

  private fireSelectionEvent(emoji: EmojiDescription, exactMatch?: boolean) {
    const { query } = this.props;
    const { emojis } = this.state;

    this.selected = true;
    this.fireAnalyticsEvent(
      typeaheadSelectedEvent(
        exactMatch || this.pressed,
        Date.now() - this.openTime,
        emoji,
        emojis,
        query,
        exactMatch,
      ),
    );
  }

  private onProviderChange: OnEmojiProviderChange = {
    result: this.onSearchResult,
  };

  private onEmojiListRef = (ref: EmojiList | null) => {
    this.emojiListRef = ref;
  };

  render() {
    const { emojiProvider, onSelection } = this.props;
    const recordUsageOnSelection = createRecordSelectionDefault(
      emojiProvider,
      (emojiId, emoji, event) => {
        this.fireSelectionEvent(emoji as EmojiDescription);
        if (onSelection) {
          onSelection(emojiId, emoji, event);
        }
      },
      (analytic) => this.fireAnalyticsEvent(analytic('typeahead')),
    );

    const { visible, emojis, loading } = this.state;
    const style = {
      display: visible ? 'block' : 'none',
    };

    return (
      <EmojiCommonProvider emojiProvider={this.props.emojiProvider}>
        <div
// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
          style={style}
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
          className={'ak-emoji-typeahead'}
          css={emojiTypeAhead}
        >
          <EmojiList
            emojis={emojis}
            onEmojiSelected={recordUsageOnSelection}
            ref={this.onEmojiListRef}
            loading={loading}
          />
        </div>
      </EmojiCommonProvider>
    );
  }
}
