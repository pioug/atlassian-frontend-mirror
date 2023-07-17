/** @jsx jsx */
import React, { useMemo, useState, useEffect } from 'react';
import { jsx } from '@emotion/react';

import { EditorView } from 'prosemirror-view';
import { EditorState } from 'prosemirror-state';
import { injectIntl, WrappedComponentProps } from 'react-intl-next';

import {
  separatorStyles,
  wrapperStyle,
  buttonGroupStyle,
} from '../../../../ui/styles';
import { ToolbarSize } from '../../../../ui/Toolbar/types';

import {
  useFormattingIcons,
  useHasFormattingActived,
} from './hooks/formatting-icons';

import { useClearIcon } from './hooks/clear-formatting-icon';
import {
  useResponsiveToolbarButtons,
  useResponsiveIconTypeMenu,
} from './hooks/responsive-toolbar-buttons';
import { MenuIconItem } from './types';
import { SingleToolbarButtons } from './single-toolbar-buttons';
import { MoreButton } from './more-button';
import { FormattingTextDropdownMenu } from './dropdown-menu';
import { toolbarMessages } from './toolbar-messages';
import { compareItemsArrays, isArrayContainsContent } from '../../utils';
import { Announcer } from '@atlaskit/editor-common/ui';
import { usePreviousState } from '@atlaskit/editor-common/hooks';
import { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';

export type ToolbarFormattingProps = {
  editorView: EditorView;
  isToolbarDisabled: boolean;
  toolbarSize: ToolbarSize;
  isReducedSpacing: boolean;
  shouldUseResponsiveToolbar: boolean;
  popupsMountPoint?: HTMLElement;
  popupsBoundariesElement?: HTMLElement;
  popupsScrollableElement?: HTMLElement;
  editorAnalyticsAPI?: EditorAnalyticsAPI;
};
const ToolbarFormatting: React.FC<
  ToolbarFormattingProps & WrappedComponentProps
> = ({
  shouldUseResponsiveToolbar,
  popupsMountPoint,
  popupsBoundariesElement,
  popupsScrollableElement,
  editorView,
  toolbarSize,
  isReducedSpacing,
  isToolbarDisabled,
  intl,
  editorAnalyticsAPI,
}) => {
  const editorState = useMemo(() => editorView.state, [editorView.state]);
  const [message, setMessage] = useState('');

  const defaultIcons = useFormattingIcons({
    editorState,
    intl,
    isToolbarDisabled,
  });
  const clearIcon = useClearIcon({
    editorState,
    intl,
    editorAnalyticsAPI,
  });

  const menuIconTypeList = useResponsiveIconTypeMenu({
    toolbarSize,
    responsivenessEnabled: shouldUseResponsiveToolbar,
  });
  const hasFormattingActive = useHasFormattingActived({
    editorState: editorView.state,
    iconTypeList: menuIconTypeList,
  });

  const { dropdownItems, singleItems } = useResponsiveToolbarButtons({
    icons: defaultIcons,
    toolbarSize,
    responsivenessEnabled: shouldUseResponsiveToolbar,
  });

  const clearFormattingStatus = intl.formatMessage(
    toolbarMessages.textFormattingOff,
  );
  const superscriptOffSubscriptOnStatus = intl.formatMessage(
    toolbarMessages.superscriptOffSubscriptOn,
  );
  const subscriptOffSuperscriptOnStatus = intl.formatMessage(
    toolbarMessages.subscriptOffSuperscriptOn,
  );

  const activeItems = [...dropdownItems, ...singleItems].filter(
    (item) => item.isActive,
  );
  const prevActiveItems = usePreviousState(activeItems) ?? [];

  const fromSuperscriptToSubscript =
    isArrayContainsContent(activeItems, 'Subscript') &&
    isArrayContainsContent(prevActiveItems, 'Superscript');

  const fromSubscriptToSuperscript =
    isArrayContainsContent(activeItems, 'Superscript') &&
    isArrayContainsContent(prevActiveItems, 'Subscript');

  let comparedItems: Array<MenuIconItem>;
  let screenReaderMessage: string = '';

  if (prevActiveItems && activeItems.length > prevActiveItems.length) {
    comparedItems = compareItemsArrays(activeItems, prevActiveItems);
    screenReaderMessage = intl.formatMessage(toolbarMessages.on, {
      formattingType: comparedItems[0].content,
    }) as string;
  } else {
    comparedItems = compareItemsArrays(prevActiveItems, activeItems);
    if (comparedItems && comparedItems.length) {
      screenReaderMessage = intl.formatMessage(toolbarMessages.off, {
        formattingType: comparedItems[0].content,
      }) as string;
      if (activeItems[0]?.content === 'Code') {
        screenReaderMessage = intl.formatMessage(toolbarMessages.codeOn, {
          textFormattingOff:
            prevActiveItems?.length > 1
              ? clearFormattingStatus
              : screenReaderMessage,
        });
      }
      if (fromSuperscriptToSubscript) {
        screenReaderMessage = superscriptOffSubscriptOnStatus;
      }
      if (fromSubscriptToSuperscript) {
        screenReaderMessage = subscriptOffSuperscriptOnStatus;
      }
    }
  }

  // handle 'Clear formatting' status for screen readers
  if (!activeItems?.length && prevActiveItems?.length > 1) {
    screenReaderMessage = clearFormattingStatus;
  }

  const items: Array<MenuIconItem> = useMemo(() => {
    if (!clearIcon) {
      return dropdownItems;
    }

    return [...dropdownItems, clearIcon];
  }, [clearIcon, dropdownItems]);

  const moreFormattingButtonLabel = intl.formatMessage(
    toolbarMessages.moreFormatting,
  );

  useEffect(() => {
    if (screenReaderMessage) {
      setMessage(screenReaderMessage);
    }
  }, [screenReaderMessage]);

  return (
    <span css={buttonGroupStyle}>
      {message && (
        <Announcer
          ariaLive="assertive"
          text={message}
          ariaRelevant="additions"
          delay={250}
        />
      )}
      <SingleToolbarButtons
        items={singleItems}
        editorView={editorView}
        isReducedSpacing={isReducedSpacing}
      />

      <span css={wrapperStyle}>
        {isToolbarDisabled ? (
          <div>
            <MoreButton
              label={moreFormattingButtonLabel}
              isReducedSpacing={isReducedSpacing}
              isDisabled={true}
              isSelected={false}
              aria-expanded={undefined}
              aria-pressed={undefined}
            />
          </div>
        ) : (
          <FormattingTextDropdownMenu
            popupsMountPoint={popupsMountPoint}
            popupsBoundariesElement={popupsBoundariesElement}
            popupsScrollableElement={popupsScrollableElement}
            editorView={editorView}
            isReducedSpacing={isReducedSpacing}
            moreButtonLabel={moreFormattingButtonLabel}
            hasFormattingActive={hasFormattingActive}
            items={items}
          />
        )}
        <span css={separatorStyles} />
      </span>
    </span>
  );
};

class Toolbar extends React.PureComponent<
  ToolbarFormattingProps & WrappedComponentProps & { editorState: EditorState }
> {
  render() {
    const {
      popupsMountPoint,
      popupsScrollableElement,
      toolbarSize,
      isReducedSpacing,
      editorView,
      isToolbarDisabled,
      shouldUseResponsiveToolbar,
      intl,
      editorAnalyticsAPI,
    } = this.props;

    return (
      <ToolbarFormatting
        popupsMountPoint={popupsMountPoint}
        popupsScrollableElement={popupsScrollableElement}
        toolbarSize={toolbarSize}
        isReducedSpacing={isReducedSpacing}
        editorView={editorView}
        isToolbarDisabled={isToolbarDisabled}
        shouldUseResponsiveToolbar={shouldUseResponsiveToolbar}
        intl={intl}
        editorAnalyticsAPI={editorAnalyticsAPI}
      />
    );
  }
}

export default injectIntl(Toolbar);
