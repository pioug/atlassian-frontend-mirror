/* eslint-disable @atlaskit/design-system/prefer-primitives */
/** @jsx jsx */
import React from 'react';

import { jsx } from '@emotion/react';

import { Popup } from '@atlaskit/editor-common/ui';

import { container } from './styles';

export type Coordinates = {
  left?: number;
  right?: number;
  top?: number;
  bottom?: number;
};

export type PositionOffset = Coordinates;

export interface Props {
  children?: React.ReactNode;
  zIndex?: number;
  className?: string;
  target?: HTMLElement;
  popupsMountPoint?: HTMLElement;
  popupsBoundariesElement?: HTMLElement;
  offset?: number[];
  fitWidth?: number;
  fitHeight?: number;
  absoluteOffset?: PositionOffset;
  alignX?: 'left' | 'center' | 'right';
  alignY?: 'bottom' | 'top';
  onPositionCalculated?: (position: Coordinates) => Coordinates;
}

export {
  handlePositionCalculatedWith,
  getOffsetParent,
  getNearestNonTextNode,
} from './utils';

export default function FloatingToolbar({
  children,
  target,
  offset,
  fitWidth,
  fitHeight = 40,
  onPositionCalculated,
  popupsMountPoint,
  popupsBoundariesElement,
  className,
  absoluteOffset,
  alignX,
  alignY,
  zIndex,
}: Props) {
  if (!target) {
    return null;
  }

  return (
    <Popup
      absoluteOffset={absoluteOffset}
      alignX={alignX}
      alignY={alignY}
      target={target}
      zIndex={zIndex}
      mountTo={popupsMountPoint}
      boundariesElement={popupsBoundariesElement}
      offset={offset}
      fitWidth={fitWidth}
      fitHeight={fitHeight}
      onPositionCalculated={onPositionCalculated}
    >
      <div
        // eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage
        css={container(fitHeight)}
        data-testid="popup-container"
        className={className}
      >
        {children}
      </div>
    </Popup>
  );
}
