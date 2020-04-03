import React from 'react';
import Button from '@atlaskit/button';
import { baseAppearanceObj } from '../theme';
import { Appearance } from '../types';

import {
  Container,
  ContentContainer,
  Title,
  Description,
  Actions,
  Action,
  IconWrapper,
} from './styled';

interface ActionType {
  text: React.ReactNode;
  onClick?: () => void;
  href?: string;
  key: string;
  testId?: string;
}

interface Props {
  /* The appearance styling to use for the section message. */
  appearance?: Appearance;
  /*
    The main content of the section message. This accepts a react node, although
    we recommend that this should be a paragraph.
  */
  children: React.ReactNode;
  /*
    The heading of the section message.
  */
  title?: string;
  /*
    Actions to be taken from the section message. These accept an object which
    are applied to @atlaskit/button components. Middots are automatically added
    between the items. We generally recommend using no more than two actions.
  */
  actions?: Array<ActionType>;
  /*
    An Icon component to be rendered instead of the default icon for the component.
    This should only be an `@atlaskit/icon` icon. You can check out [this example](/packages/core/section-message/example/custom-icon)
    to see how to provide this icon.
  */
  icon?: React.ElementType;
  /*
    A custom link component. This prop is designed to allow a custom link
    component to be passed to the link button being rendered by actions. The
    intended use-case is for when a custom router component such as react router
    is being used within the application.

    This component will only be used if a href is passed to the action.

    All actions provided will automatically have the linkcomponent passed to them.
  */
  linkComponent?: React.ComponentType<any>;
  /**
   * A `testId` prop is provided for specified elements, which is a unique
   * string that appears as a data attribute `data-testid` in the rendered code,
   * serving as a hook for automated tests */
  testId?: string;
}

export default class SectionMessage extends React.Component<Props, any> {
  static defaultProps = {
    appearance: 'info',
  };

  renderAction = (
    action: ActionType,
    linkComponent?: React.ComponentType<any>,
  ) => {
    const { href, key, onClick, text, testId } = action;

    return (
      <Action key={key} data-testid={testId}>
        {onClick || href ? (
          <Button
            appearance="link"
            spacing="none"
            onClick={onClick}
            href={href}
            component={linkComponent}
          >
            {text}
          </Button>
        ) : (
          text
        )}
      </Action>
    );
  };

  render() {
    const {
      children,
      title,
      actions,
      appearance,
      icon,
      linkComponent,
      testId,
    } = this.props;
    //needs typecasting because TS is not recognising default props :(
    const appearanceObj =
      baseAppearanceObj[appearance as Appearance] || baseAppearanceObj.info;
    const Icon = icon || appearanceObj.Icon;

    return (
      <Container
        backgroundColor={appearanceObj.backgroundColor}
        data-testid={testId}
      >
        <IconWrapper>
          <Icon
            primaryColor={appearanceObj.primaryIconColor}
            secondaryColor={appearanceObj.backgroundColor}
          />
        </IconWrapper>
        <ContentContainer>
          {title ? <Title>{title}</Title> : null}
          {children ? <Description>{children}</Description> : null}
          {actions && actions.length ? (
            <Actions>
              {actions.map(action => this.renderAction(action, linkComponent))}
            </Actions>
          ) : null}
        </ContentContainer>
      </Container>
    );
  }
}
