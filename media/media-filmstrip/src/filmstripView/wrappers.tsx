/** @jsx jsx */
import { jsx } from '@emotion/react';
import React, { ReactNode, MouseEvent, forwardRef } from 'react';
import ArrowLeft from '@atlaskit/icon/glyph/arrow-left';
import ArrowRight from '@atlaskit/icon/glyph/arrow-right';
import { MediaFilmStripListItemSelector } from '.';
import {
  arrowLeftWrapperStyles,
  arrowRightWrapperStyles,
  filmStripListItemStyles,
  filmStripListStyles,
  filmStripListWrapperStyles,
  filmStripViewStyles,
  shadowLeftStyles,
  shadowRightStyles,
} from './styles';

export const ShadowLeft = ({ children }: { children: ReactNode }) => (
  <div css={shadowLeftStyles}>{children}</div>
);

type OnClick = {
  onClick: (event: MouseEvent<HTMLDivElement>) => void;
};

export const ArrowLeftWrapper = ({
  children,
  onClick,
}: {
  children: ReactNode;
} & OnClick) => (
  <div css={arrowLeftWrapperStyles} className="arrow" onClick={onClick}>
    {children}
  </div>
);

export const ShadowRight = ({ children }: { children: ReactNode }) => (
  <div css={shadowRightStyles}>{children}</div>
);

export const ArrowRightWrapper = ({
  children,
  onClick,
}: {
  children: ReactNode;
} & OnClick) => (
  <div css={arrowRightWrapperStyles} className="arrow" onClick={onClick}>
    {children}
  </div>
);

export const LeftArrow: React.SFC<OnClick> = ({ onClick }: OnClick) => (
  <ShadowLeft>
    <ArrowLeftWrapper onClick={onClick}>
      <ArrowLeft label="left" />
    </ArrowLeftWrapper>
  </ShadowLeft>
);

export const RightArrow: React.SFC<OnClick> = ({ onClick }: OnClick) => (
  <ShadowRight>
    <ArrowRightWrapper onClick={onClick}>
      <ArrowRight label="right" />
    </ArrowRightWrapper>
  </ShadowRight>
);
export const FilmStripViewWrapper = ({
  children,
  'data-testid': dataTestId,
}: {
  children: ReactNode;
  'data-testid': string | undefined;
}) => (
  <div css={filmStripViewStyles} data-testid={dataTestId}>
    {children}
  </div>
);

type FilmStripListWrapperProps = {
  children: ReactNode;
  onWheel: (event: React.WheelEvent<HTMLDivElement>) => void;
  onTouchStart: (event: React.TouchEvent<Element>) => void;
  onTouchMove: (event: React.TouchEvent<Element>) => void;
  onTouchEnd: (event: React.TouchEvent<Element>) => void;
  'data-testid': string | undefined;
};
export const FilmStripListWrapper = forwardRef(
  (
    {
      children,
      onWheel,
      onTouchStart,
      onTouchMove,
      onTouchEnd,
      'data-testid': dataTestId,
    }: FilmStripListWrapperProps,
    ref,
  ) => (
    <div
      css={filmStripListWrapperStyles}
      ref={ref as React.RefObject<HTMLDivElement>}
      onWheel={onWheel}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      data-testid={dataTestId}
    >
      {children}
    </div>
  ),
);

type FilmStripListProps = {
  children: ReactNode;
  style: {
    transform: string;
    transitionProperty: string;
    transitionDuration: string;
  };
};

export const FilmStripList = React.forwardRef(
  ({ children, style }: FilmStripListProps, ref) => (
    <ul
      css={filmStripListStyles}
      ref={ref as React.RefObject<HTMLUListElement>}
      style={style}
    >
      {children}
    </ul>
  ),
);

export const FilmStripListItem = ({
  children,
  index,
}: {
  children: ReactNode;
  index: React.Key;
}) => (
  <li
    css={filmStripListItemStyles}
    className={MediaFilmStripListItemSelector}
    data-testid="media-filmstrip-list-item"
    key={index}
  >
    {children}
  </li>
);
