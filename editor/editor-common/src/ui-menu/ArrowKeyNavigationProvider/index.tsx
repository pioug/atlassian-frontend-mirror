import React from 'react';

import { ReactEditorViewContext } from '../../ui-react';

import { ColorPaletteArrowKeyNavigationProvider } from './ColorPaletteArrowKeyNavigationProvider';
import { MenuArrowKeyNavigationProvider } from './MenuArrowKeyNavigationProvider';
import type { ArrowKeyNavigationProviderProps } from './types';
import { ArrowKeyNavigationType } from './types';

export const ArrowKeyNavigationProvider: React.FC<
  ArrowKeyNavigationProviderProps
> = (props) => {
  const { children, type, ...restProps } = props;

  if (type === ArrowKeyNavigationType.COLOR) {
    return (
      <ReactEditorViewContext.Consumer>
        {({ editorView, editorRef }) =>
          editorRef && (
            <ColorPaletteArrowKeyNavigationProvider
              selectedRowIndex={props.selectedRowIndex}
              selectedColumnIndex={props.selectedColumnIndex}
              isOpenedByKeyboard={props.isOpenedByKeyboard}
              isPopupPositioned={props.isPopupPositioned}
              editorRef={editorRef}
              {...restProps}
            >
              {children}
            </ColorPaletteArrowKeyNavigationProvider>
          )
        }
      </ReactEditorViewContext.Consumer>
    );
  }
  return (
    <ReactEditorViewContext.Consumer>
      {({ editorView, editorRef }) =>
        editorRef && (
          <MenuArrowKeyNavigationProvider editorRef={editorRef} {...restProps}>
            {children}
          </MenuArrowKeyNavigationProvider>
        )
      }
    </ReactEditorViewContext.Consumer>
  );
};
