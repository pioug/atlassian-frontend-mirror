import React from 'react';
import styled from 'styled-components';

import {
  TableSharedCssClassName,
  OverflowShadowProps,
} from '@atlaskit/editor-common';
import { akEditorStickyHeaderZIndex } from '@atlaskit/editor-shared-styles';
import { TableLayout } from '@atlaskit/adf-schema';
import * as colors from '@atlaskit/theme/colors';
const { N40A } = colors;

import { findHorizontalOverflowScrollParent } from '../../../utils';
import { Table } from './table';

export type StickyMode = 'none' | 'stick' | 'pin-bottom';

export const tableStickyPadding = 8;

interface RelativeProps {
  left?: number;
  top?: number;
}

// creates a new stacking context and places the div in the same
// position as the table
const RelativeTableDiv = styled.div.attrs<RelativeProps>({
  style: ({ left, top }: RelativeProps) => ({
    left: left && left < 0 ? left : undefined,
    top,
  }),
})`
  position: relative;
`;

interface FixedProps {
  top?: number;
  wrapperWidth: number;
  mode: StickyMode;
}

export const FixedTableDiv = styled.div.attrs<FixedProps>({
  style: ({ top, wrapperWidth }: FixedProps) => ({
    top,
    width: wrapperWidth,
  }),
})`
  ${(props) => (props.mode === 'stick' ? 'position: fixed' : '')};
  ${(props) => (props.mode === 'pin-bottom' ? 'position: absolute' : '')};
  ${(props) => (props.mode === 'none' ? 'display: none' : '')};

  z-index: ${akEditorStickyHeaderZIndex};

  &
    .${TableSharedCssClassName.TABLE_CONTAINER},
    &
    .${TableSharedCssClassName.TABLE_STICKY_WRAPPER}
    > table {
    margin-top: 0;
    margin-bottom: 0;
  }

  border-top: ${tableStickyPadding}px solid white;
  background: white;
  box-shadow: 0 6px 4px -4px ${N40A};

  div[data-expanded='false'] & {
    display: none;
  }

  &
    .${TableSharedCssClassName.TABLE_CONTAINER}.right-shadow::after,
    &
    .${TableSharedCssClassName.TABLE_CONTAINER}.left-shadow::before {
    top: 0px;
    height: 100%;
  }
`;

export type StickyTableProps = {
  left?: number; // TODO: would be good to abstract this away
  top?: number;
  mode: StickyMode;
  innerRef: React.RefObject<HTMLDivElement>;
  rowHeight: number;

  wrapperWidth: number;
  tableWidth: string;
  isNumberColumnEnabled: boolean;
  children: React.ReactNode[];
  layout: TableLayout;
  columnWidths?: number[];
  renderWidth: number;
  allowDynamicTextSizing?: boolean;
} & OverflowShadowProps;

const StyledDiv = styled.div``;

export const StickyTable = ({
  top,
  left,
  mode,
  shadowClassNames,
  innerRef,
  wrapperWidth,
  tableWidth,
  isNumberColumnEnabled,
  layout,
  children,
  columnWidths,
  renderWidth,
  allowDynamicTextSizing,
  rowHeight,
}: StickyTableProps) => {
  return (
    <RelativeTableDiv left={left} top={mode === 'pin-bottom' ? top : undefined}>
      <FixedTableDiv
        top={mode === 'stick' ? top : undefined}
        mode={rowHeight > 300 ? 'none' : mode}
        wrapperWidth={wrapperWidth}
      >
        <StyledDiv
          className={`${TableSharedCssClassName.TABLE_CONTAINER} ${shadowClassNames}`}
          data-layout={layout}
          style={{
            width: tableWidth,
          }}
        >
          <StyledDiv
            innerRef={innerRef}
            className={`${TableSharedCssClassName.TABLE_STICKY_WRAPPER}`}
            style={{
              overflow: 'hidden',
            }}
          >
            <Table
              columnWidths={columnWidths}
              layout={layout}
              isNumberColumnEnabled={isNumberColumnEnabled}
              renderWidth={renderWidth}
              allowDynamicTextSizing={allowDynamicTextSizing}
            >
              {children}
            </Table>
          </StyledDiv>
        </StyledDiv>
      </FixedTableDiv>
    </RelativeTableDiv>
  );
};

export class OverflowParent {
  private constructor(private ref: HTMLElement | Window) {
    this.ref = ref;
  }

  static fromElement(el: HTMLElement | null) {
    return new OverflowParent(findHorizontalOverflowScrollParent(el) || window);
  }

  get isElement() {
    return this.ref instanceof HTMLElement;
  }

  get top() {
    if (this.ref instanceof HTMLElement) {
      return this.ref.getBoundingClientRect().top;
    }

    return 0;
  }

  public addEventListener(
    type: string,
    cb: EventListenerOrEventListenerObject,
    ...args: any[]
  ) {
    this.ref.addEventListener(type, cb, ...args);
  }

  public removeEventListener(
    type: string,
    cb: EventListenerOrEventListenerObject,
    ...args: any[]
  ) {
    this.ref.removeEventListener(type, cb, ...args);
  }
}
