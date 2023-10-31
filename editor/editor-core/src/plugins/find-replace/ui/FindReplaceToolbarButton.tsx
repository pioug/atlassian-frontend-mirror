/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/react';
import type { WrappedComponentProps } from 'react-intl-next';
import { defineMessages, injectIntl } from 'react-intl-next';
import {
  akEditorFloatingPanelZIndex,
  akEditorMobileMaxWidth,
} from '@atlaskit/editor-shared-styles';
import ToolbarButton, { TOOLBAR_BUTTON } from '../../../ui/ToolbarButton';
import {
  Dropdown,
  ArrowKeyNavigationType,
} from '@atlaskit/editor-common/ui-menu';
import EditorSearchIcon from '@atlaskit/icon/glyph/editor/search';
import { token } from '@atlaskit/tokens';
import type { FindReplaceProps } from './FindReplace';
import FindReplace from './FindReplace';
import type { DispatchAnalyticsEvent } from '@atlaskit/editor-common/analytics';
import { TRIGGER_METHOD } from '@atlaskit/editor-common/analytics';
import {
  ToolTipContent,
  findKeymapByDescription,
  tooltip,
} from '../../../keymaps';
import { getAriaKeyshortcuts } from '@atlaskit/editor-common/keymaps';

const toolbarButtonWrapper = css`
  display: flex;
  flex: 1 1 auto;
  flex-grow: 0;
  justify-content: flex-end;
  align-items: center;
  padding: 0 ${token('space.100', '8px')};
  @media (max-width: ${akEditorMobileMaxWidth}px) {
    justify-content: center;
    padding: 0;
  }
`;

const toolbarButtonWrapperFullWith = css`
  flex-grow: 1;
`;

const wrapper = css`
  display: flex;
  flex-direction: column;
`;

const messages = defineMessages({
  findReplaceToolbarButton: {
    id: 'fabric.editor.findReplaceToolbarButton',
    defaultMessage: 'Find and replace',
    description:
      '"Find" highlights all instances of a word or phrase on the document, and "Replace" changes one or all of those instances to something else',
  },
});

export interface FindReplaceToolbarButtonProps
  extends Omit<FindReplaceProps, 'count'> {
  index: number;
  numMatches: number;
  isActive: boolean;
  onActivate: () => void;
  isReducedSpacing?: boolean;
  popupsMountPoint?: HTMLElement;
  popupsBoundariesElement?: HTMLElement;
  popupsScrollableElement?: HTMLElement;
  dispatchAnalyticsEvent?: DispatchAnalyticsEvent;
  takeFullWidth: boolean;
}

class FindReplaceToolbarButton extends React.PureComponent<
  FindReplaceToolbarButtonProps & WrappedComponentProps
> {
  toggleOpen = () => {
    if (this.props.isActive) {
      this.props.onCancel({ triggerMethod: TRIGGER_METHOD.TOOLBAR });
    } else {
      this.props.onActivate();
    }
  };

  render() {
    const {
      popupsMountPoint,
      popupsBoundariesElement,
      popupsScrollableElement,
      isReducedSpacing,
      findText,
      replaceText,
      isActive,
      index,
      numMatches,
      intl: { formatMessage },
      takeFullWidth,
    } = this.props;

    const title = formatMessage(messages.findReplaceToolbarButton);
    const stackBelowOtherEditorFloatingPanels = akEditorFloatingPanelZIndex - 1;

    const keymap = findKeymapByDescription('Find');
    return (
      <div
        css={[
          toolbarButtonWrapper,
          takeFullWidth && toolbarButtonWrapperFullWith,
        ]}
      >
        <Dropdown
          mountTo={popupsMountPoint}
          boundariesElement={popupsBoundariesElement}
          scrollableElement={popupsScrollableElement}
          isOpen={isActive}
          handleEscapeKeydown={() => {
            if (isActive) {
              this.props.onCancel({ triggerMethod: TRIGGER_METHOD.KEYBOARD });
            }
          }}
          fitWidth={352}
          zIndex={stackBelowOtherEditorFloatingPanels}
          arrowKeyNavigationProviderOptions={{
            type: ArrowKeyNavigationType.MENU,
            disableArrowKeyNavigation: true,
          }}
          trigger={
            <ToolbarButton
              buttonId={TOOLBAR_BUTTON.FIND_REPLACE}
              spacing={isReducedSpacing ? 'none' : 'default'}
              selected={isActive}
              title={<ToolTipContent description={title} keymap={keymap} />}
              iconBefore={<EditorSearchIcon label={title} />}
              onClick={this.toggleOpen}
              aria-expanded={isActive}
              aria-haspopup
              aria-label={keymap ? tooltip(keymap, title) : title}
              aria-keyshortcuts={getAriaKeyshortcuts(keymap)}
            />
          }
        >
          <div css={wrapper}>
            <FindReplace
              findText={findText}
              replaceText={replaceText}
              count={{ index, total: numMatches }}
              {...this.props}
            />
          </div>
        </Dropdown>
      </div>
    );
  }
}
export default injectIntl(FindReplaceToolbarButton);
