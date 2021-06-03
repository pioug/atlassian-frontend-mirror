/** @jsx jsx */
import React, { useRef } from 'react';

import { jsx } from '@emotion/core';

import {
  editButtonStyles,
  readViewContainerStyles,
  readViewWrapperStyles,
} from './styles';

const DRAG_THRESHOLD = 5;

interface ReadViewProps {
  editButtonLabel: string;
  onEditRequested: () => void;
  postReadViewClick: () => void;
  editButtonRef: React.RefObject<HTMLButtonElement>;
  readViewFitContainerWidth?: boolean;
  readView: () => React.ReactNode;
}

const ReadView = ({
  editButtonLabel,
  onEditRequested,
  postReadViewClick,
  editButtonRef,
  readViewFitContainerWidth,
  readView,
}: ReadViewProps) => {
  const startX = useRef(0);
  const startY = useRef(0);

  const mouseHasMovedAfterMouseDown = (event: {
    clientX: number;
    clientY: number;
  }) => {
    return (
      Math.abs(startX.current - event.clientX) >= DRAG_THRESHOLD ||
      Math.abs(startY.current - event.clientY) >= DRAG_THRESHOLD
    );
  };

  const onReadViewClick = (
    event: React.MouseEvent<HTMLButtonElement | HTMLDivElement>,
  ) => {
    const element = event.target as HTMLElement;
    /** If a link is clicked in the read view, default action should be taken */
    if (
      element.tagName.toLowerCase() !== 'a' &&
      !mouseHasMovedAfterMouseDown(event)
    ) {
      event.preventDefault();
      onEditRequested();
      postReadViewClick();
    }
  };

  /* eslint-disable jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions,jsx-a11y/no-noninteractive-element-interactions */
  return (
    <div css={readViewContainerStyles}>
      <button
        css={editButtonStyles}
        aria-label={editButtonLabel}
        type="button"
        onClick={onEditRequested}
        ref={editButtonRef}
      />
      <div
        css={readViewWrapperStyles}
        onClick={onReadViewClick}
        onMouseDown={(e) => {
          startX.current = e.clientX;
          startY.current = e.clientY;
        }}
        data-read-view-fit-container-width={readViewFitContainerWidth}
      >
        {readView()}
      </div>
    </div>
  );
  /* eslint-enable jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions,jsx-a11y/no-noninteractive-element-interactions */
};

export default ReadView;
