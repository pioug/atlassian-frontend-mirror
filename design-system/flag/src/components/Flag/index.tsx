import React, { Component, MouseEventHandler } from 'react';

import {
  createAndFireEvent,
  withAnalyticsContext,
  withAnalyticsEvents,
} from '@atlaskit/analytics-next';
import ChevronDownIcon from '@atlaskit/icon/glyph/chevron-down';
import ChevronUpIcon from '@atlaskit/icon/glyph/chevron-up';
import CrossIcon from '@atlaskit/icon/glyph/cross';

import { DEFAULT_APPEARANCE } from '../../constants';
import { flagFocusRingColor } from '../../theme';
import { FlagProps } from '../../types';
import {
  name as packageName,
  version as packageVersion,
} from '../../version.json';
import Expander from '../Expander';
import Actions from '../FlagActions';

import Container, {
  Content,
  Description,
  DismissButton,
  Header,
  Icon,
  Title,
} from './styledFlag';

interface State {
  isExpanded: boolean;
}

class Flag extends Component<FlagProps, State> {
  static defaultProps = {
    actions: [],
    appearance: DEFAULT_APPEARANCE,
    isDismissAllowed: false,
  };

  state = { isExpanded: false };

  UNSAFE_componentWillReceiveProps(nextProps: FlagProps) {
    const { actions, description } = nextProps;
    if (
      this.isBold() &&
      this.state.isExpanded &&
      !description &&
      (!actions || !actions.length)
    ) {
      this.toggleExpand();
    }
  }

  dismissFlag = () => {
    if (this.props.isDismissAllowed && this.props.onDismissed) {
      this.props.onDismissed(this.props.id);
    }
  };

  isBold = () => this.props.appearance !== DEFAULT_APPEARANCE;

  toggleExpand = () => {
    this.setState({ isExpanded: !this.state.isExpanded });
  };

  renderToggleOrDismissButton = () => {
    const {
      appearance,
      description,
      actions,
      isDismissAllowed,
      onDismissed,
    } = this.props;
    const isBold = this.isBold();
    if (
      !isDismissAllowed ||
      (!isBold && !onDismissed) ||
      (isBold && !description && (!actions || !actions.length))
    ) {
      return null;
    }

    const ChevronIcon = this.state.isExpanded ? ChevronUpIcon : ChevronDownIcon;
    const ButtonIcon = isBold ? ChevronIcon : CrossIcon;
    const buttonLabel = isBold ? 'Toggle flag body' : 'Dismiss flag';
    const buttonAction = isBold ? this.toggleExpand : this.dismissFlag;
    const size = ButtonIcon === ChevronIcon ? 'large' : 'small';

    return (
      <DismissButton
        appearance={appearance}
        aria-expanded={this.state.isExpanded}
        focusRingColor={flagFocusRingColor(this.props)}
        onClick={buttonAction}
        type="button"
      >
        <ButtonIcon label={buttonLabel} size={size} />
      </DismissButton>
    );
  };

  renderBody = () => {
    const {
      actions,
      appearance,
      description,
      linkComponent,
      testId,
    } = this.props;
    const isExpanded = !this.isBold() || this.state.isExpanded;

    return (
      <Expander isExpanded={isExpanded}>
        {description && (
          <Description appearance={appearance}>{description}</Description>
        )}
        <Actions
          actions={actions}
          appearance={appearance}
          linkComponent={linkComponent}
          data-testid={testId}
        />
      </Expander>
    );
  };

  // We prevent default on mouse down to avoid focus ring when the flag is clicked,
  // while still allowing it to be focused with the keyboard.
  handleMouseDown: MouseEventHandler<HTMLElement> = e => {
    e.preventDefault();
  };

  render() {
    const {
      appearance,
      icon,
      title,
      onMouseOver,
      onFocus,
      onMouseOut,
      onBlur,
      testId,
    } = this.props;
    const autoDismissProps = { onMouseOver, onFocus, onMouseOut, onBlur };
    const OptionalDismissButton = this.renderToggleOrDismissButton;
    const Body = this.renderBody;
    return (
      <Container
        appearance={appearance}
        role="alert"
        tabIndex={0}
        onMouseDown={this.handleMouseDown}
        data-testid={testId}
        {...autoDismissProps}
      >
        <Header>
          <Icon>{icon}</Icon>
          <Title appearance={appearance}>{title}</Title>
          <OptionalDismissButton />
        </Header>
        <Content>
          <Body />
        </Content>
      </Container>
    );
  }
}

export { Flag as FlagWithoutAnalytics };
const createAndFireEventOnAtlaskit = createAndFireEvent('atlaskit');

export default withAnalyticsContext({
  componentName: 'flag',
  packageName,
  packageVersion,
})(
  withAnalyticsEvents({
    onBlur: createAndFireEventOnAtlaskit({
      action: 'blurred',
      actionSubject: 'flag',

      attributes: {
        componentName: 'flag',
        packageName,
        packageVersion,
      },
    }),

    onDismissed: createAndFireEventOnAtlaskit({
      action: 'dismissed',
      actionSubject: 'flag',

      attributes: {
        componentName: 'flag',
        packageName,
        packageVersion,
      },
    }),

    onFocus: createAndFireEventOnAtlaskit({
      action: 'focused',
      actionSubject: 'flag',

      attributes: {
        componentName: 'flag',
        packageName,
        packageVersion,
      },
    }),
  })(Flag),
);
