import React from 'react';
import ReactDOM from 'react-dom';
import uuid from 'uuid';
import { Transaction, TextSelection, Selection } from 'prosemirror-state';
import { EditorView, DecorationSet, Decoration } from 'prosemirror-view';
import { B400 } from '@atlaskit/theme/colors';
import { keyName as keyNameNormalized } from 'w3c-keyname';
import { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
import { IntlProvider, InjectedIntl } from 'react-intl';
import { redo, undo } from 'prosemirror-history';

import {
  TYPE_AHEAD_DECORATION_KEY,
  TYPE_AHEAD_DECORATION_DATA_ATTRIBUTE,
} from '../constants';
import { WrapperTypeAhead } from '../ui/WrapperTypeAhead';
import type {
  CreateTypeAheadDecorations,
  RemoveTypeAheadDecorations,
  PopupMountPointReference,
} from '../types';
import { StatsModifier } from '../stats-modifier';
import { getTypeAheadQuery } from '../utils';
import { closeTypeAhead } from '../transforms/close-type-ahead';

type FactoryProps = {
  intl: InjectedIntl;
  popupMountRef: PopupMountPointReference;
  createAnalyticsEvent?: CreateUIAnalyticsEvent;
};

type FactoryReturn = {
  createDecorations: CreateTypeAheadDecorations;
  removeDecorations: RemoveTypeAheadDecorations;
};

export const factoryDecorations = ({
  intl,
  popupMountRef,
  createAnalyticsEvent,
}: FactoryProps): FactoryReturn => {
  const createDecorations: CreateTypeAheadDecorations = (
    tr: Transaction,
    { triggerHandler, inputMethod, reopenQuery },
  ) => {
    const { selection } = tr;

    if (!(selection instanceof TextSelection) || !selection.$cursor) {
      return {
        decorationSet: DecorationSet.empty,
        stats: null,
        decorationElement: null,
      };
    }

    const decorationId = `decoration_id_${TYPE_AHEAD_DECORATION_KEY}_${uuid()}`;
    const { $cursor } = selection;

    const typeaheadComponent = document.createElement('mark');
    const stats = new StatsModifier();

    let shouldFocusCursorInsideQuery = true;
    const deco = Decoration.widget(
      $cursor.pos,
      (editorView: EditorView, getDecorationPosition: () => number) => {
        typeaheadComponent.setAttribute('id', decorationId);
        typeaheadComponent.setAttribute('role', 'search');
        typeaheadComponent.setAttribute(
          'aria-label',
          `On ${triggerHandler.id}`,
        );

        typeaheadComponent.dataset.typeAheadQuery = 'true';
        typeaheadComponent.dataset.trigger = triggerHandler.trigger;

        // This line below seems weird,
        // we need that cuz the clickAreaHelper
        // will try to hijack any click event coming
        // from the inside of the Editor
        // packages/editor/editor-core/src/ui/Addon/click-area-helper.ts
        typeaheadComponent.dataset.editorPopup = 'true';
        typeaheadComponent.dataset.typeAhead = TYPE_AHEAD_DECORATION_DATA_ATTRIBUTE;

        typeaheadComponent.style.color = B400;
        typeaheadComponent.style.backgroundColor = 'transparent';

        const onUndoRedo = (
          inputType: 'historyUndo' | 'historyRedo',
        ): boolean => {
          if (!['historyUndo', 'historyRedo'].includes(inputType)) {
            return false;
          }

          const hasReopenQuery =
            typeof reopenQuery === 'string' && reopenQuery.trim().length > 0;
          const currentQuery = getTypeAheadQuery(editorView.state);

          if (hasReopenQuery || currentQuery.length === 0) {
            const command = inputType === 'historyUndo' ? undo : redo;
            let tr = editorView.state.tr;
            const fakeDispatch = (customTr: Transaction) => {
              tr = customTr;
            };

            const result = command(editorView.state, fakeDispatch);

            if (result) {
              closeTypeAhead(tr);
              editorView.dispatch(tr);
              editorView.focus();
            }

            return result;
          }

          return false;
        };

        ReactDOM.render(
          <IntlProvider
            locale={intl.locale || 'en'}
            messages={intl.messages}
            formats={intl.formats}
          >
            <WrapperTypeAhead
              triggerHandler={triggerHandler}
              editorView={editorView}
              anchorElement={typeaheadComponent}
              createAnalyticsEvent={createAnalyticsEvent}
              inputMethod={inputMethod}
              getDecorationPosition={getDecorationPosition}
              shouldFocusCursorInsideQuery={shouldFocusCursorInsideQuery}
              popupsMountPoint={popupMountRef.current?.popupsMountPoint}
              popupsBoundariesElement={
                popupMountRef.current?.popupsBoundariesElement
              }
              popupsScrollableElement={
                popupMountRef.current?.popupsScrollableElement
              }
              onUndoRedo={onUndoRedo}
              reopenQuery={reopenQuery}
            />
          </IntlProvider>,
          typeaheadComponent,
        );
        shouldFocusCursorInsideQuery = false;
        return typeaheadComponent;
      },
      {
        isTypeAheadDecoration: true,
        key: decorationId,
        side: 0,
        stopEvent: (e) => {
          const key = keyNameNormalized(e);
          const sel = document.getSelection();
          if ('ArrowLeft' === key && sel?.anchorOffset === 0) {
            return false;
          }

          return true;
        },
        ignoreSelection: false,
      },
    );

    return {
      decorationSet: DecorationSet.create(tr.doc, [deco]),
      decorationElement: typeaheadComponent,
      stats,
    };
  };

  const removeDecorations: RemoveTypeAheadDecorations = (
    decorationSet?: DecorationSet,
  ) => {
    if (!decorationSet || decorationSet === DecorationSet.empty) {
      return false;
    }

    const typeAheadDecorations = decorationSet.find(
      undefined,
      undefined,
      (spec) => {
        return spec.isTypeAheadDecoration;
      },
    );

    if (!typeAheadDecorations || typeAheadDecorations.length === 0) {
      return false;
    }

    typeAheadDecorations.forEach(({ spec }: Decoration) => {
      if (!spec.key) {
        return;
      }
      const decoElement = document.querySelector(`#${spec.key}`);

      if (!decoElement) {
        return;
      }

      ReactDOM.unmountComponentAtNode(decoElement);
    });

    return true;
  };

  return {
    createDecorations,
    removeDecorations,
  };
};

export const isSelectionInsideTypeAhead = ({
  decorationSet,
  selection,
}: {
  decorationSet?: DecorationSet;
  selection: Selection;
}): boolean => {
  if (!decorationSet || decorationSet === DecorationSet.empty) {
    return false;
  }

  const typeAheadDecorations = decorationSet.find(
    undefined,
    undefined,
    (spec) => {
      return spec.isTypeAheadDecoration;
    },
  );

  if (!typeAheadDecorations || typeAheadDecorations.length === 0) {
    return false;
  }

  return typeAheadDecorations.some((dec) => {
    return dec.from === selection.from && dec.to === selection.to;
  });
};

export const findDecorationElement = ({
  selection,
  decorationSet,
}: {
  selection: Selection;
  decorationSet?: DecorationSet;
}): HTMLElement | null => {
  if (
    !decorationSet ||
    decorationSet === DecorationSet.empty ||
    !(selection instanceof TextSelection) ||
    !selection.$cursor
  ) {
    return null;
  }

  const {
    $cursor: { pos },
  } = selection;
  const decoration = decorationSet.find(
    pos,
    pos,
    (spec: Record<string, any>) => spec?.isTypeAheadDecoration,
  );

  if (!decoration || decoration.length !== 1) {
    return null;
  }

  return document.querySelector(`#${decoration[0].spec.key}`);
};
