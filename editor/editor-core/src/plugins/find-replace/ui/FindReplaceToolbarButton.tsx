import React from 'react';
import styled from 'styled-components';
import { defineMessages, InjectedIntlProps, injectIntl } from 'react-intl';
import EditorSearchIcon from '@atlaskit/icon/glyph/editor/search';
import ToolbarButton from '../../../ui/ToolbarButton';
import Dropdown from '../../../ui/Dropdown';
import FindReplace, { FindReplaceProps } from './FindReplace';
import { TRIGGER_METHOD, DispatchAnalyticsEvent } from '../../analytics/types';
import { ToolTipContent, findKeymapByDescription } from '../../../keymaps';

const ToolbarButtonWrapper = styled.div`
  display: flex;
  flex: 1 1 auto;
  justify-content: flex-end;
  padding: 0 8px;
`;

const Wrapper = styled.div`
  padding: 0 4px;
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
}

class FindReplaceToolbarButton extends React.PureComponent<
  FindReplaceToolbarButtonProps & InjectedIntlProps
> {
  componentDidMount() {
    window.addEventListener('keydown', this.handleKeydown);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeydown);
  }

  /**
   * Prevent browser find opening if you hit cmd+f with cursor
   * inside find/replace component
   */
  handleKeydown = (event: KeyboardEvent) => {
    if (event.metaKey && event.key === 'f') {
      event.preventDefault();
    }
  };

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
      shouldFocus,
      intl: { formatMessage },
    } = this.props;

    const title = formatMessage(messages.findReplaceToolbarButton);

    return (
      <ToolbarButtonWrapper>
        <Dropdown
          mountTo={popupsMountPoint}
          boundariesElement={popupsBoundariesElement}
          scrollableElement={popupsScrollableElement}
          isOpen={isActive}
          handleEscapeKeydown={() => {
            this.props.onCancel({ triggerMethod: TRIGGER_METHOD.KEYBOARD });
          }}
          fitWidth={352}
          trigger={
            <ToolbarButton
              spacing={isReducedSpacing ? 'none' : 'default'}
              selected={isActive}
              title={
                <ToolTipContent
                  description={title}
                  keymap={findKeymapByDescription('Find')}
                />
              }
              iconBefore={<EditorSearchIcon label={title} />}
              onClick={this.toggleOpen}
            />
          }
        >
          <Wrapper>
            <FindReplace
              findText={findText}
              replaceText={replaceText}
              count={{ index, total: numMatches }}
              shouldFocus={shouldFocus}
              {...this.props}
            />
          </Wrapper>
        </Dropdown>
      </ToolbarButtonWrapper>
    );
  }
}
export default injectIntl(FindReplaceToolbarButton);
