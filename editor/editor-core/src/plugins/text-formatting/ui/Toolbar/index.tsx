import React, { useMemo } from 'react';

import { EditorView } from 'prosemirror-view';
import { EditorState } from 'prosemirror-state';
import { injectIntl, InjectedIntlProps } from 'react-intl';

import { Separator, Wrapper, ButtonGroup } from '../../../../ui/styles';
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

export type ToolbarFormattingProps = {
  editorView: EditorView;
  isToolbarDisabled: boolean;
  toolbarSize: ToolbarSize;
  isReducedSpacing: boolean;
  shouldUseResponsiveToolbar: boolean;
  popupsMountPoint?: HTMLElement;
  popupsBoundariesElement?: HTMLElement;
  popupsScrollableElement?: HTMLElement;
};
const ToolbarFormatting: React.FC<
  ToolbarFormattingProps & InjectedIntlProps
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
}) => {
  const editorState = useMemo(() => editorView.state, [editorView.state]);

  const defaultIcons = useFormattingIcons({
    editorState,
    intl,
    isToolbarDisabled,
  });
  const clearIcon = useClearIcon({
    editorState,
    intl,
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

  const items: Array<MenuIconItem> = useMemo(() => {
    if (!clearIcon) {
      return dropdownItems;
    }

    return [...dropdownItems, clearIcon];
  }, [clearIcon, dropdownItems]);

  const moreFormattingButtonLabel = intl.formatMessage(
    toolbarMessages.moreFormatting,
  );

  return (
    <ButtonGroup width={isReducedSpacing ? 'small' : 'large'}>
      <SingleToolbarButtons
        items={singleItems}
        editorView={editorView}
        isReducedSpacing={isReducedSpacing}
      />

      <Wrapper>
        {isToolbarDisabled ? (
          <div>
            <MoreButton
              label={moreFormattingButtonLabel}
              isReducedSpacing={isReducedSpacing}
              isDisabled={true}
              isSelected={false}
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
        <Separator />
      </Wrapper>
    </ButtonGroup>
  );
};

class Toolbar extends React.PureComponent<
  ToolbarFormattingProps & InjectedIntlProps & { editorState: EditorState }
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
      />
    );
  }
}

export default injectIntl(Toolbar);
