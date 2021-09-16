import React, { useEffect, useMemo } from 'react';
import { EditorView, DecorationSet } from 'prosemirror-view';
import styled from 'styled-components';
import { EditorState } from 'prosemirror-state';

import { akEditorFloatingDialogZIndex } from '@atlaskit/editor-shared-styles';
import { Popup } from '@atlaskit/editor-common';
import type { SelectItemMode } from '@atlaskit/editor-common/type-ahead';
import { borderRadius, gridSize } from '@atlaskit/theme/constants';
import { N0, N60A, N50A } from '@atlaskit/theme/colors';
import { ACTION, ACTION_SUBJECT, EVENT_TYPE } from '../../analytics';

import { TypeAheadList } from './TypeAheadList';
import type { TypeAheadHandler, TypeAheadItem, OnSelectItem } from '../types';
import type { FireAnalyticsCallback } from '../../analytics/fire-analytics-event';

const TypeAheadContent = styled.div`
  background: ${N0};
  border-radius: ${borderRadius()}px;
  box-shadow: 0 0 1px ${N60A}, 0 4px 8px -2px ${N50A};
  padding: ${gridSize() / 2}px 0;
  width: 320px;
  max-height: 380px; /* ~5.5 visibile items */
  overflow-y: auto;
  -ms-overflow-style: -ms-autohiding-scrollbar;
  position: relative;
`;

type TypeAheadPopupProps = {
  triggerHandler: TypeAheadHandler;
  editorView: EditorView;
  anchorElement?: HTMLElement;
  popupsMountPoint?: HTMLElement;
  popupsBoundariesElement?: HTMLElement;
  popupsScrollableElement?: HTMLElement;
  fireAnalyticsCallback: FireAnalyticsCallback;
  items: Array<TypeAheadItem>;
  selectedIndex: number;
  setSelectedItem: OnSelectItem;
  decorationSet: DecorationSet;
  isEmptyQuery: boolean;
  onItemInsert: (mode: SelectItemMode, index: number) => void;
};

type HighlightProps = {
  state: EditorState;
  triggerHandler: TypeAheadHandler;
};
const Highlight: React.FC<HighlightProps> = ({ state, triggerHandler }) => {
  if (!triggerHandler?.getHighlight) {
    return null;
  }

  const highlight = triggerHandler.getHighlight(state);

  return highlight;
};

const OFFSET = [0, 8];
export const TypeAheadPopup: React.FC<TypeAheadPopupProps> = React.memo(
  (props) => {
    const {
      editorView,
      triggerHandler,
      anchorElement,
      popupsMountPoint,
      popupsBoundariesElement,
      popupsScrollableElement,
      items,
      selectedIndex,
      setSelectedItem,
      onItemInsert,
      fireAnalyticsCallback,
      isEmptyQuery,
    } = props;

    const startTime = useMemo(
      () => performance.now(),
      // In case those props changes
      // we need to recreate the startTime
      [items, isEmptyQuery, fireAnalyticsCallback, triggerHandler], // eslint-disable-line react-hooks/exhaustive-deps
    );
    useEffect(() => {
      if (!fireAnalyticsCallback) {
        return;
      }
      const stopTime = performance.now();
      const time = stopTime - startTime;

      fireAnalyticsCallback({
        payload: {
          action: ACTION.RENDERED,
          actionSubject: ACTION_SUBJECT.TYPEAHEAD,
          eventType: EVENT_TYPE.OPERATIONAL,
          attributes: {
            time,
            items: items.length,
            initial: isEmptyQuery,
          },
        },
      });
    }, [
      startTime,
      items,
      fireAnalyticsCallback,
      isEmptyQuery,
      // In case the current triggerHandler changes
      // e.g: Inserting a mention using the quick insert
      // we need to send the event again
      // eslint-disable-next-line react-hooks/exhaustive-deps
      triggerHandler,
    ]);

    useEffect(() => {
      if (!fireAnalyticsCallback) {
        return;
      }

      fireAnalyticsCallback({
        payload: {
          action: ACTION.VIEWED,
          actionSubject: ACTION_SUBJECT.TYPEAHEAD_ITEM,
          eventType: EVENT_TYPE.OPERATIONAL,
          attributes: {
            index: selectedIndex,
            items: items.length,
          },
        },
      });
    }, [
      items,
      fireAnalyticsCallback,
      selectedIndex,
      // In case the current triggerHandler changes
      // e.g: Inserting a mention using the quick insert
      // we need to send the event again
      // eslint-disable-next-line react-hooks/exhaustive-deps
      triggerHandler,
    ]);

    return (
      <Popup
        zIndex={akEditorFloatingDialogZIndex}
        target={anchorElement}
        mountTo={popupsMountPoint}
        boundariesElement={popupsBoundariesElement}
        scrollableElement={popupsScrollableElement}
        fitHeight={300}
        fitWidth={340}
        offset={OFFSET}
      >
        <TypeAheadContent className="fabric-editor-typeahead">
          <Highlight state={editorView.state} triggerHandler={triggerHandler} />
          <TypeAheadList
            items={items}
            selectedIndex={selectedIndex}
            onItemHover={setSelectedItem}
            onItemClick={onItemInsert}
          />
        </TypeAheadContent>
      </Popup>
    );
  },
);

TypeAheadPopup.displayName = 'TypeAheadPopup';
