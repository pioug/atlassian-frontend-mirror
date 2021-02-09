import React from 'react';

import { EditorView } from 'prosemirror-view';
import styled from 'styled-components';

import { Popup } from '@atlaskit/editor-common';
import { akEditorFloatingDialogZIndex } from '@atlaskit/editor-shared-styles';
import { borderRadius, gridSize } from '@atlaskit/theme/constants';
import { N0, N60A, N50A } from '@atlaskit/theme/colors';
import { divide } from '@atlaskit/theme/math';
import { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';

import { selectByIndex } from '../commands/select-item';
import { setCurrentIndex } from '../commands/set-current-index';
import { TypeAheadItem } from '../types';

import { TypeAheadItemsList } from './TypeAheadItemsList';
import {
  fireAnalyticsEvent,
  ACTION,
  ACTION_SUBJECT,
  EVENT_TYPE,
} from '../../analytics';
import { editorAnalyticsChannel } from '../../analytics/consts';
import {
  TypeAheadItemViewedAEP,
  TypeAheadRenderedAEP,
} from '../../analytics/types/general-events';

export const TypeAheadContent = styled.div`
  background: ${N0};
  border-radius: ${borderRadius()}px;
  box-shadow: 0 0 1px ${N60A}, 0 4px 8px -2px ${N50A};
  padding: ${divide(gridSize, 2)}px 0;
  width: 320px;
  max-height: 380px; /* ~5.5 visibile items */
  overflow-y: auto;
  -ms-overflow-style: -ms-autohiding-scrollbar;
  position: relative;
`;

export type TypeAheadProps = {
  active: boolean;
  items?: Array<TypeAheadItem>;
  isLoading?: boolean;
  currentIndex: number;
  editorView: EditorView;
  anchorElement?: HTMLElement;
  popupsMountPoint?: HTMLElement;
  popupsBoundariesElement?: HTMLElement;
  popupsScrollableElement?: HTMLElement;
  highlight?: JSX.Element | null;
  createAnalyticsEvent?: CreateUIAnalyticsEvent;
  query?: string | null;
};
export class TypeAhead extends React.Component<TypeAheadProps> {
  static displayName = 'TypeAhead';

  private composing: boolean = false;
  private renderStart?: number;
  private shouldFireRendered = false;
  private sentIndex?: number;

  handleKeyPress = () => {
    // When user starts typing, they are not using their mouse
    // Marks as composing, to prevent false positive mouse events
    this.composing = true;
  };

  handleMouseMove = () => {
    // User is actively moving mouse, hence can enable mouse events again
    this.composing = false;
  };

  private fireRendered = () => {
    if (this.shouldFireRendered) {
      const payload: TypeAheadRenderedAEP = {
        action: ACTION.RENDERED,
        actionSubject: ACTION_SUBJECT.TYPEAHEAD,
        eventType: EVENT_TYPE.OPERATIONAL,
        attributes: {
          time: this.renderStart
            ? performance.now() - this.renderStart
            : undefined,
          items: this.props.items?.length,
          initial: this.props.query === '',
        },
      };

      fireAnalyticsEvent(this.props.createAnalyticsEvent)({
        channel: editorAnalyticsChannel,
        payload,
      });

      this.renderStart = undefined;
      this.shouldFireRendered = false;
    }
  };

  private fireItemViewed = () => {
    if (this.props.currentIndex !== this.sentIndex) {
      const itemPayload: TypeAheadItemViewedAEP = {
        action: ACTION.VIEWED,
        actionSubject: ACTION_SUBJECT.TYPEAHEAD_ITEM,
        eventType: EVENT_TYPE.OPERATIONAL,
        attributes: {
          index: this.props.currentIndex,
          items: this.props.items?.length,
        },
      };

      fireAnalyticsEvent(this.props.createAnalyticsEvent)({
        channel: editorAnalyticsChannel,
        payload: itemPayload,
      });

      this.sentIndex = this.props.currentIndex;
    }
  };

  componentWillReceiveProps(nextProps: TypeAheadProps) {
    const prev = this.props.items?.map(({ title }) => title).join('-') ?? '';
    const next = nextProps.items?.map(({ title }) => title).join('-') ?? '';

    if (prev !== next) {
      this.renderStart = performance.now();
      this.shouldFireRendered = true;
    }
  }

  componentDidMount = () => {
    window.addEventListener('keypress', this.handleKeyPress);
    window.addEventListener('mousemove', this.handleMouseMove);
    this.fireRendered();
    this.fireItemViewed();
  };

  componentWillUnmount = () => {
    window.removeEventListener('keypress', this.handleKeyPress);
    window.removeEventListener('mousemove', this.handleMouseMove);
  };

  componentDidUpdate = () => {
    this.fireRendered();
    this.fireItemViewed();
  };

  insertByIndex = (index: number) => {
    selectByIndex(index)(
      this.props.editorView.state,
      this.props.editorView.dispatch,
    );
  };

  setCurrentIndex = (index: number) => {
    if (this.composing) {
      // User is typing, mouse events are false positives
      return;
    }

    if (index !== this.props.currentIndex) {
      setCurrentIndex(index)(
        this.props.editorView.state,
        this.props.editorView.dispatch,
      );
    }
  };

  render() {
    const {
      active,
      items,
      isLoading,
      anchorElement,
      currentIndex,
      popupsMountPoint,
      popupsBoundariesElement,
      popupsScrollableElement,
      highlight,
    } = this.props;

    if (!active || !anchorElement || !items || !items.length) {
      return null;
    }
    return (
      <Popup
        zIndex={akEditorFloatingDialogZIndex}
        target={anchorElement}
        mountTo={popupsMountPoint}
        boundariesElement={popupsBoundariesElement}
        scrollableElement={popupsScrollableElement}
        fitHeight={300}
        fitWidth={340}
        offset={[0, 8]}
      >
        <TypeAheadContent className="fabric-editor-typeahead">
          {highlight}
          {Array.isArray(items) ? (
            <TypeAheadItemsList
              insertByIndex={this.insertByIndex}
              setCurrentIndex={this.setCurrentIndex}
              items={items}
              currentIndex={currentIndex}
            />
          ) : !items && isLoading ? (
            'loading...'
          ) : (
            'no items'
          )}
        </TypeAheadContent>
      </Popup>
    );
  }
}
