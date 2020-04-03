import React from 'react';
import EditorActions from '../../actions';

export interface Props {
  mountTo?: HTMLElement;
  boundariesElement?: HTMLElement;
  scrollableElement?: HTMLElement;
  isOpen?: boolean;
  onOpenChange?: (attrs: any) => void;
  onItemActivated?: (attrs: any) => void;
  onMouseEnter?: (attrs: any) => void;
  onMouseLeave?: (attrs: any) => void;
  fitWidth?: number;
  fitHeight?: number;
  offset?: Array<number>;
  zIndex?: number;
  items: Array<{
    items: MenuItem[];
  }>;
}

export interface MenuItem {
  key?: string;
  content: string | React.ReactChild | React.ReactFragment;
  value: {
    name: string;
  };
  shortcut?: string;
  elemBefore?: React.ReactElement<any>;
  elemAfter?: React.ReactElement<any>;
  tooltipDescription?: string;
  tooltipPosition?: string;
  isActive?: boolean;
  isDisabled?: boolean;
  handleRef?: any;
  className?: string;
  onClick?: (editorActions: EditorActions) => void;
}

export interface State {
  target?: HTMLElement;
  popupPlacement: [string, string];
}
