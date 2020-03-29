import React from 'react';
import Button from '@atlaskit/button';
import InlineDialog from '@atlaskit/inline-dialog';
import IconForType from '../IconForType';
import { IconType, InlineDialogPlacement } from '../../types';
import { Root, ButtonContents, Text, Title } from './styledInlineMessage';

interface Props {
  /** The elements to be displayed by the inline dialog. */
  children: React.ReactNode;
  /** The placement to be passed to the inline dialog. Determines where around
   the text the dialog is displayed. */
  placement: InlineDialogPlacement;
  /** Text to display second. */
  secondaryText: React.ReactNode;
  /** Text to display first, bolded for emphasis. */
  title: React.ReactNode;
  /** Set the icon to be used before the title. Options are: connectivity,
   confirmation, info, warning, and error. */
  type: IconType;
  /**
   * A `testId` prop is provided for specified elements, which is a unique
   * string that appears as a data attribute `data-testid` in the rendered code,
   * serving as a hook for automated tests.
   As inline message is composed of different components, we passed down the testId to the sub component you want to test:
   - testId to identify the inline message component.
   - testId--inline-dialog to get the content of the actual component.
   - testId--button to click on the actual component.
   - testId--title to get the title of the actual component.
   - testId--text to get the text of the actual component.
    */
  testId?: string;
}

interface State {
  isOpen: boolean;
  isHovered: boolean;
}

export default class InlineMessage extends React.Component<Props, State> {
  static defaultProps = {
    children: null,
    placement: 'bottom-start',
    secondaryText: '',
    title: '',
    type: 'connectivity',
  };

  state = {
    isOpen: false,
    isHovered: false,
  };

  onMouseEnter = () => {
    this.setState({ isHovered: true });
  };

  onMouseLeave = () => {
    this.setState({ isHovered: false });
  };

  toggleDialog = () => {
    this.setState({ isOpen: !this.state.isOpen });
  };

  render() {
    const {
      children,
      placement,
      secondaryText,
      title,
      type,
      testId,
    } = this.props;
    const { isHovered, isOpen } = this.state;
    return (
      <Root
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
        appearance={type}
        data-testid={testId}
      >
        <InlineDialog
          onClose={() => {
            this.setState({ isOpen: false });
          }}
          content={children}
          isOpen={isOpen}
          placement={placement}
          testId={testId && `${testId}--inline-dialog`}
        >
          <Button
            appearance="subtle-link"
            onClick={this.toggleDialog}
            spacing="none"
            testId={testId && `${testId}--button`}
          >
            <ButtonContents isHovered={isHovered}>
              <IconForType type={type} isHovered={isHovered} isOpen={isOpen} />
              {title ? (
                <Title
                  data-testid={testId && `${testId}--title`}
                  isHovered={isHovered}
                >
                  {title}
                </Title>
              ) : null}
              {secondaryText ? (
                <Text
                  data-testid={testId && `${testId}--text`}
                  isHovered={isHovered}
                >
                  {secondaryText}
                </Text>
              ) : null}
            </ButtonContents>
          </Button>
        </InlineDialog>
      </Root>
    );
  }
}
