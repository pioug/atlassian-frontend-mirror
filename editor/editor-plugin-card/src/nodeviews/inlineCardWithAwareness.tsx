import type { EventHandler, KeyboardEvent, MouseEvent } from 'react';
import React, { memo, useCallback, useMemo } from 'react';

import rafSchedule from 'raf-schd';

import { findOverflowScrollParent } from '@atlaskit/editor-common/ui';
import { Card as SmartCard } from '@atlaskit/smart-card';

import { registerCard } from '../pm-plugins/actions';

import type { SmartCardProps } from './genericCard';

const InlineCard = ({
  node,
  cardContext,
  showServerActions,
  useAlternativePreloader,
  view,
  getPos,
}: SmartCardProps) => {
  const scrollContainer: HTMLElement | undefined = useMemo(
    () => findOverflowScrollParent(view.dom as HTMLElement) || undefined,
    [view.dom],
  );
  const { url, data } = node.attrs;

  const onClick: EventHandler<MouseEvent | KeyboardEvent> = () => {};

  const onResolve = useCallback(
    (data: { url?: string; title?: string }) => {
      if (!getPos || typeof getPos === 'boolean') {
        return;
      }

      const { title, url } = data;
      // don't dispatch immediately since we might be in the middle of
      // rendering a nodeview
      rafSchedule(() => {
        // prosemirror-bump-fix
        const pos = getPos();

        if (typeof pos !== 'number') {
          return;
        }

        view.dispatch(
          registerCard({
            title,
            url,
            pos,
          })(view.state.tr),
        );
      })();
    },
    [view, getPos],
  );

  const onError = useCallback(
    (data: { url?: string; err?: Error }) => {
      const { url, err } = data;
      if (err) {
        throw err;
      }
      onResolve({ url });
    },
    [onResolve],
  );

  const card = (
    <span className="card">
      <SmartCard
        key={url}
        url={url}
        data={data}
        appearance="inline"
        onClick={onClick}
        container={scrollContainer}
        onResolve={onResolve}
        onError={onError}
        inlinePreloaderStyle={
          useAlternativePreloader ? 'on-right-without-skeleton' : undefined
        }
        showServerActions={showServerActions}
      />
    </span>
  );
  // [WS-2307]: we only render card wrapped into a Provider when the value is ready,
  // otherwise if we got data, we can render the card directly since it doesn't need the Provider
  return cardContext && cardContext.value ? (
    <cardContext.Provider value={cardContext.value}>
      {card}
    </cardContext.Provider>
  ) : data ? (
    card
  ) : null;
};

export const InlineCardWithAwareness = memo(InlineCard);
