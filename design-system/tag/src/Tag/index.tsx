import React, { Component, ReactNode, ComponentType } from 'react';

import {
  withAnalyticsEvents,
  WithAnalyticsEventsProps,
  withAnalyticsContext,
  createAndFireEvent,
} from '@atlaskit/analytics-next';
import {
  name as packageName,
  version as packageVersion,
} from '../version.json';

import Chrome from '../Chrome';
import Content from '../Content';
import RemoveButton from '../RemoveButton';

import Before from './Before';
import Container from './Container';

import { AppearanceType, TagColor } from '../types';

const colorList: TagColor[] = [
  'standard',
  'green',
  'blue',
  'red',
  'purple',
  'grey',
  'teal',
  'yellow',
  'greenLight',
  'blueLight',
  'redLight',
  'purpleLight',
  'greyLight',
  'tealLight',
  'yellowLight',
];

interface Props extends WithAnalyticsEventsProps {
  /** Set whether tags should be rounded. */
  appearance?: AppearanceType;
  /** The color theme to apply, setting both background and text color. */
  color?: TagColor;
  /** Component to be rendered before the Tag. */
  elemBefore?: ReactNode;
  /** Text to be displayed in the tag. */
  text: string;
  /** uri or path. If provided, the tag will be a link.  */
  href?: string;
  /** Text display as the aria-label for remove text. Setting this makes the
   tag removable. */
  removeButtonText?: string;
  /** Handler to be called before the tag is removed. If it does not return a
   truthy value, the tag will not be removed. */
  onBeforeRemoveAction?: () => boolean;
  /** Handler to be called after tag is removed. Called with the string 'Post
   Removal Hook'. */
  onAfterRemoveAction?: (text: string) => void;
  /* A link component to be used instead of our standard anchor. The styling of
  our link item will be applied to the link that is passed in. */
  linkComponent?: ComponentType<any>;

  /** A `testId` prop is provided for specified elements, which is a unique string that appears as a data attribute `data-testid` in the rendered code, serving as a hook for automated tests */
  testId?: string;
}

interface State {
  isRemoving: boolean;
  isRemoved: boolean;
  markedForRemoval: boolean;
  isFocused: boolean;
}

class Tag extends Component<Props, State> {
  static defaultProps = {
    color: 'standard' as TagColor,
    appearance: 'default' as AppearanceType,
    elemBefore: null,
    onAfterRemoveAction: () => {},
    onBeforeRemoveAction: () => true,
  };

  state = {
    isRemoving: false,
    isRemoved: false,
    markedForRemoval: false,
    isFocused: false,
  };

  handleRemoveRequest = () => {
    if (this.props.onBeforeRemoveAction && this.props.onBeforeRemoveAction()) {
      this.setState({ isRemoving: true, isRemoved: false });
    }
  };

  handleRemoveComplete = () => {
    if (this.props.onAfterRemoveAction) {
      this.props.onAfterRemoveAction(this.props.text);
    }
    this.setState({ isRemoving: false, isRemoved: true });
  };

  handleHoverChange = (hoverState: boolean) => {
    this.setState({ markedForRemoval: hoverState });
  };

  handleFocusChange = (focusState: boolean) => {
    this.setState({ isFocused: focusState });
  };

  render() {
    const { isFocused, isRemoved, isRemoving, markedForRemoval } = this.state;
    const {
      appearance,
      elemBefore,
      href,
      removeButtonText,
      text,
      color,
      linkComponent,
      testId,
    } = this.props;

    const safeColor = colorList.includes(color) ? color : 'standard';

    const isRemovable = Boolean(removeButtonText);
    const isRounded = appearance === 'rounded';
    const styled = {
      isFocused,
      isRemovable,
      isRemoved,
      isRemoving,
      isRounded,
      markedForRemoval,
      color: safeColor,
    };
    const onAnimationEnd = () => isRemoving && this.handleRemoveComplete();

    return (
      <Container
        {...styled}
        onAnimationEnd={onAnimationEnd}
        data-testid={testId}
      >
        <Chrome {...styled} isLink={!!href} isFocused={this.state.isFocused}>
          {elemBefore ? <Before>{elemBefore}</Before> : null}
          <Content
            linkComponent={linkComponent}
            {...styled}
            href={href}
            onFocus={() => this.handleFocusChange(true)}
            onBlur={() => this.handleFocusChange(false)}
          >
            {text}
          </Content>
          {isRemovable ? (
            <RemoveButton
              {...styled}
              onHoverChange={this.handleHoverChange}
              onRemoveAction={this.handleRemoveRequest}
              removeText={removeButtonText}
            />
          ) : null}
        </Chrome>
      </Container>
    );
  }
}

export { Tag as TagWithoutAnalytics };
const createAndFireEventOnAtlaskit = createAndFireEvent('atlaskit');

export default withAnalyticsContext({
  componentName: 'tag',
  packageName,
  packageVersion,
})(
  withAnalyticsEvents({
    onAfterRemoveAction: createAndFireEventOnAtlaskit({
      action: 'removed',
      actionSubject: 'tag',

      attributes: {
        componentName: 'tag',
        packageName,
        packageVersion,
      },
    }),
  })(Tag),
);
