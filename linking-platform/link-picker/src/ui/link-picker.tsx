/** @jsx jsx */
import React, { RefObject, KeyboardEvent, PureComponent } from 'react';
import { jsx } from '@emotion/core';
import { WrappedComponentProps, injectIntl } from 'react-intl-next';

import { messages } from '../messages';
import PanelTextInput from './PanelTextInput';
import LinkSearchList from './LinkSearchList';
import { normalizeUrl, isSafeUrl } from '../url';
import {
  LinkSearchListItemData,
  LinkInputType,
  LinkPickerPlugin,
} from '../types';
import {
  recentListStyles,
  Container,
  SearchIconWrapper,
  ListTitleStyles,
} from '../styles';
import { browser } from '../browser';
import { transformTimeStamp } from '../transformTimeStamp';
import Announcer from './announcer';

import Button, { ButtonGroup } from '@atlaskit/button';
import { FormFooter } from '@atlaskit/form';
import EditorSearchIcon from '@atlaskit/icon/glyph/editor/search';
import VisuallyHidden from '@atlaskit/visually-hidden';

export const RECENT_SEARCH_LIST_SIZE = 5;

interface Meta {
  /** Indicates how the link was picked. */
  inputMethod: LinkInputType;
}

interface OnSubmitParameter {
  /** The `url` of the linked resource. */
  url: string;
  /** The desired text to be displayed alternatively to the title of the linked resource. */
  displayText: string | null;
  /** The resolved `title` of the resource at the time of link picking (if applicable, null if not known). */
  title: string | null;
  /** Meta data about the link picking submission. */
  meta: Meta;
  /**
   * The input value of the `url` field at time of submission if inserted "manually".
   * This can useful if the `url` was manually inserted with a value that is different from the normalised value returned as `url`.
   * @example
   * { url: 'https://google.com', rawUrl: 'google.com' }
   */
  rawUrl?: string;
}

export interface LinkPickerProps {
  /** Callback to fire on form submission. */
  onSubmit: (arg: OnSubmitParameter) => void;
  /** Callback to fire when the cancel button is clicked. */
  onCancel: () => void;
  /** The url of the linked resource for editing. */
  url?: string;
  /** The desired text to be displayed alternatively to the title of the linked resource for editing. */
  displayText?: string | null;
  /** Plugins that provide link suggestions / search capabilities. */
  plugins?: LinkPickerPlugin[];
}

export interface State {
  items: LinkSearchListItemData[];
  selectedIndex: number;
  activeIndex: number;
  url: string;
  isLoading: boolean;
  displayText: string;
  invalidUrl: string | null;
}

class LinkPicker extends PureComponent<
  WrappedComponentProps & LinkPickerProps,
  State
> {
  private wrapperRef: RefObject<HTMLDivElement> = React.createRef();
  private handleClearUrl: () => void;
  private handleClearDisplayText: () => void;
  private queryVersion: number = 0;

  constructor(props: WrappedComponentProps & LinkPickerProps) {
    super(props);

    this.state = {
      selectedIndex: -1,
      activeIndex: -1,
      isLoading: false,
      url: normalizeUrl(props.url) || '',
      displayText: props.displayText || '',
      items: [],
      invalidUrl: null,
    };

    /* Cache functions */
    this.handleClearUrl = this.createClearHandler('url');
    this.handleClearDisplayText = this.createClearHandler('displayText');
  }

  componentDidMount() {
    this.loadInitialLinkSearchResult();
  }

  private loadInitialLinkSearchResult() {
    const { url } = this.state;

    if (!url) {
      this.updateResults();
    }
  }

  private getActivePlugin() {
    if (!this.props.plugins || this.props.plugins.length === 0) {
      return null;
    }

    return this.props.plugins[0];
  }

  /**
   * Interface between link picker and plugins to update results
   */
  private async updateResults() {
    const queryVersion = ++this.queryVersion;
    const activePlugin = this.getActivePlugin();
    if (!activePlugin) {
      return;
    }

    const updates = activePlugin.resolve({
      query: this.state.url,
    });

    this.setState({
      isLoading: true,
      items: [],
    });

    try {
      while (queryVersion === this.queryVersion) {
        const { done, value } = await updates.next();
        if (queryVersion !== this.queryVersion) {
          return;
        }

        this.setState({
          items: limit(value),
          isLoading: !done,
        });

        if (done) {
          return;
        }
      }
    } catch {
      this.setState({
        isLoading: false,
      });
    }
  }

  private updateInput = async (input: string) => {
    // If input is a valid URL, do not search or display link suggestions
    if (input.length && isSafeUrl(input)) {
      return this.setState({
        url: input,
        selectedIndex: -1,
        items: [],
        isLoading: false,
        invalidUrl: null,
      });
    }

    return this.setState(
      {
        url: input,
        // Unset selection on any input change
        selectedIndex: -1,
        invalidUrl: null,
      },
      () => {
        this.updateResults();
      },
    );
  };

  private createClearHandler = (field: 'url' | 'displayText') => {
    return () => {
      switch (field) {
        case 'url': {
          this.updateInput('');
          break;
        }
        case 'displayText': {
          this.setState({
            [field]: '',
          });
        }
      }
    };
  };

  private getScreenReaderText = () => {
    const { intl } = this.props;
    const { items, selectedIndex } = this.state;

    if (items.length && selectedIndex > -1) {
      const { name, container, lastUpdatedDate, lastViewedDate } = items[
        selectedIndex
      ];

      const date = transformTimeStamp(intl, lastViewedDate, lastUpdatedDate);
      const formattedDate = [
        date?.pageAction,
        date?.dateString,
        date?.timeSince,
      ]
        .filter(Boolean)
        .join(' ');
      return [name, container, formattedDate].filter(Boolean).join(', ');
    }
  };

  render() {
    const {
      items,
      isLoading,
      activeIndex,
      selectedIndex,
      url,
      displayText,
    } = this.state;
    const {
      intl: { formatMessage },
    } = this.props;
    const activePlugin = this.getActivePlugin();

    const linkPlaceHolder = formatMessage(
      activePlugin ? messages.placeholder : messages.linkPlaceholder,
    );

    const linkLabel = formatMessage(messages.linkLabel);
    const linkTextLabel = formatMessage(messages.linkTextLabel);
    const linkTextPlaceHolder = formatMessage(messages.linkTextPlaceholder);

    const screenReaderDescriptionId = 'search-recent-links-field-description';
    const linkSearchListId = 'link-picker-search-list';
    const ariaActiveDescendant =
      selectedIndex > -1 ? `link-search-list-item-${selectedIndex}` : '';

    // Added workaround with a screen reader Announcer specifically for VoiceOver + Safari
    // as the Aria design pattern for combobox does not work in this case
    // for details: https://a11y-internal.atlassian.net/browse/AK-740
    const screenReaderText = browser.safari && this.getScreenReaderText();

    const searchIcon = activePlugin && (
      <SearchIconWrapper data-testid="link-picker-search-icon">
        <EditorSearchIcon size="medium" label={''} />
      </SearchIconWrapper>
    );

    return (
      <div
        data-testid="link-picker"
        className="recent-list"
        css={recentListStyles}
      >
        <Container innerRef={this.wrapperRef}>
          {screenReaderText && (
            <Announcer
              ariaLive="assertive"
              text={screenReaderText}
              ariaRelevant="additions"
              delay={250}
            />
          )}
          <VisuallyHidden>
            <span aria-hidden="true" id={screenReaderDescriptionId}>
              {formatMessage(messages.searchLinkAriaDescription)}
            </span>
          </VisuallyHidden>
          <PanelTextInput
            name="link"
            testId="link-url"
            role="combobox"
            label={linkLabel}
            placeholder={linkPlaceHolder}
            value={url}
            autoFocus
            autoComplete="off"
            elemBeforeInput={searchIcon}
            onSubmit={this.handleSubmit}
            onChange={this.updateInput}
            onKeyDown={this.handleKeyDown}
            onClear={this.handleClearUrl}
            error={this.state.invalidUrl}
            clearLabel={formatMessage(messages.clearLink)}
            aria-controls={linkSearchListId}
            aria-autocomplete="list"
            aria-activedescendant={ariaActiveDescendant}
            aria-describedby={screenReaderDescriptionId}
            aria-expanded
          />
          <PanelTextInput
            name="link-text"
            testId="link-text"
            autoComplete="off"
            label={linkTextLabel}
            placeholder={linkTextPlaceHolder}
            aria-label={formatMessage(messages.linkAriaLabel)}
            value={displayText}
            onSubmit={this.handleSubmit}
            onKeyDown={this.handleKeyDown}
            onChange={this.updateTextInput}
            onClear={this.handleClearDisplayText}
            clearLabel={formatMessage(messages.clearText)}
          />
          {!!items.length && (
            <div
              css={ListTitleStyles}
              id="link-picker-list-title"
              data-testid="link-picker-list-title"
            >
              {formatMessage(
                this.state.url
                  ? messages.titleResults
                  : messages.titleRecentlyViewed,
              )}
            </div>
          )}
          <VisuallyHidden>
            <span
              aria-live="polite"
              aria-atomic="true"
              id="fabric.smartcard.linkpicker.suggested.results"
            >
              {url &&
                formatMessage(messages.searchLinkResults, {
                  count: items.length,
                })}
            </span>
          </VisuallyHidden>
          <LinkSearchList
            ariaLabelledBy="link-picker-list-title"
            ariaControls="fabric.smartcard.linkpicker.suggested.results"
            id={linkSearchListId}
            role="listbox"
            items={items}
            isLoading={isLoading}
            selectedIndex={selectedIndex}
            activeIndex={activeIndex}
            onSelect={this.handleSelected}
            onMouseEnter={this.handleMouseEnterResultItem}
            onMouseLeave={this.handleMouseLeaveResultItem}
          />
          <FormFooter align="end">
            <ButtonGroup>
              <Button
                appearance="default"
                onClick={this.handleCancel}
                testId="link-picker-cancel-button"
              >
                {formatMessage(messages.cancelButton)}
              </Button>
              <Button
                type="submit"
                appearance="primary"
                onClick={this.handleSubmit}
                testId="link-picker-insert-button"
              >
                {formatMessage(messages.insertButton)}
              </Button>
            </ButtonGroup>
          </FormFooter>
        </Container>
      </div>
    );
  }

  private isUrlPopulatedWithSelectedItem = () => {
    /**
     * When we use ArrowKey to navigate through result items,
     * the URL field will be populated with the content of
     * selected item.
     * This function will check if the URL field is populated
     * with selected item.
     * It can be useful to detect whether we want to insert a
     * smartlink or a hyperlink with customized title
     */
    const { items, selectedIndex, url } = this.state;

    const selectedItem: LinkSearchListItemData | undefined =
      items[selectedIndex];

    if (selectedItem && selectedItem.url === url) {
      return true;
    }

    return false;
  };

  private handleSelected = (objectId: string) => {
    const { items } = this.state;

    const selectedItem = items.find(item => item.objectId === objectId);

    if (selectedItem) {
      const { url, name } = selectedItem;
      this.handleInsert(url, name, 'typeAhead');
    }
  };

  private handleInsert = (
    url: string,
    title: string | null,
    inputType: LinkInputType,
  ) => {
    const { onSubmit } = this.props;
    const { url: rawUrl, displayText } = this.state;

    if (onSubmit) {
      onSubmit({
        url,
        displayText: displayText || null,
        title: title || null,
        meta: { inputMethod: inputType },
        ...(inputType === 'manual' ? { rawUrl } : {}),
      });
    }
  };

  private handleMouseEnterResultItem = (objectId: string) => {
    const { items } = this.state;

    const index = findIndex(items, item => item.objectId === objectId);
    this.setState({
      activeIndex: index,
    });
  };

  private handleMouseLeaveResultItem = (objectId: string) => {
    const { items, activeIndex } = this.state;

    const index = findIndex(items, item => item.objectId === objectId);
    // This is to avoid updating index that was set by other mouseenter event
    if (activeIndex === index) {
      this.setState({
        activeIndex: -1,
      });
    }
  };

  private handleSubmit = () => {
    const { url, selectedIndex, items } = this.state;

    const selectedItem: LinkSearchListItemData | undefined =
      items[selectedIndex];

    if (this.isUrlPopulatedWithSelectedItem()) {
      this.handleInsert(selectedItem.url, selectedItem.name, 'typeAhead');
    } else if (url.length > 0) {
      const normalized = normalizeUrl(url);
      if (normalized) {
        this.handleInsert(normalized, null, 'manual');
      } else {
        const { intl } = this.props;
        const linkInvalid = intl.formatMessage(messages.linkInvalid);
        this.setState({
          invalidUrl: linkInvalid,
        });
      }
    }
  };

  private handleKeyDown = (event: KeyboardEvent<any>) => {
    const { items, activeIndex } = this.state;
    const { keyCode } = event;
    const KEY_CODE_ARROW_DOWN = 40;
    const KEY_CODE_ARROW_UP = 38;

    if (!items || !items.length) {
      return;
    }

    let updatedIndex = activeIndex;
    switch (keyCode) {
      case KEY_CODE_ARROW_DOWN: // down
        event.preventDefault();
        updatedIndex = (activeIndex + 1) % items.length;
        break;

      case KEY_CODE_ARROW_UP: // up
        event.preventDefault();
        updatedIndex = activeIndex > 0 ? activeIndex - 1 : items.length - 1;
        break;
    }

    if (
      [KEY_CODE_ARROW_DOWN, KEY_CODE_ARROW_UP].includes(keyCode) &&
      items[updatedIndex]
    ) {
      this.setState({
        activeIndex: updatedIndex,
        selectedIndex: updatedIndex,
        url: items[updatedIndex].url,
        invalidUrl: null,
      });
    }
  };

  private handleCancel = () => {
    const { onCancel } = this.props;
    if (onCancel) {
      onCancel();
    }
  };

  private updateTextInput = (displayText: string) => {
    this.setState({
      displayText: displayText,
    });
  };
}

function findIndex<T>(array: T[], predicate: (item: T) => boolean): number {
  let index = -1;
  array.some((item, i) => {
    if (predicate(item)) {
      index = i;
      return true;
    }
    return false;
  });

  return index;
}

function limit<T>(items: Array<T>) {
  return items.slice(0, RECENT_SEARCH_LIST_SIZE);
}

export const LinkPickerWithIntl = injectIntl(LinkPicker);
