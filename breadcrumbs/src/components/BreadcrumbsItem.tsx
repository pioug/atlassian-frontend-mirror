import React from 'react';
import ReactDOM from 'react-dom';
import {
  withAnalyticsEvents,
  createAndFireEvent,
  WithAnalyticsEventsProps,
} from '@atlaskit/analytics-next';
import AKTooltip from '@atlaskit/tooltip';
import {
  name as packageName,
  version as packageVersion,
} from '../version.json';
import ItemWrapper from '../styled/BreadcrumbsItem';
import Button from '../styled/Button';
import Separator from '../styled/Separator';

interface IProps extends WithAnalyticsEventsProps {
  /** Whether this item will be followed by a separator. */
  hasSeparator?: boolean;
  /** The url or path which the breadcrumb should act as a link to. */
  href?: string;
  /** An icon to display before the breadcrumb. */
  iconBefore?: React.ReactChild;
  /** An icon to display after the breadcrumb. */
  iconAfter?: React.ReactChild;
  /** Handler to be called on click. **/
  onClick?: (event: React.MouseEvent) => void;
  /** The text to appear within the breadcrumb as a link. */
  text: string;
  /** The maximum width in pixels that an item can have before it is truncated.
  If this is not set, truncation will only occur when it cannot fit alone on a
  line. If there is no truncationWidth, tooltips are not provided on truncation. */
  truncationWidth?: number;
  target?: '_blank' | '_parent' | '_self' | '_top' | '';
  /** Provide a custom component to use instead of the default button.
   *  The custom component should accept a className prop so it can be styled
   *  and possibly all action handlers */
  component?: React.ClassType<any, any, any>;
  /** A `testId` prop is provided for specified elements, which is a unique string that appears as a data attribute `data-testid` in the rendered code, serving as a hook for automated tests */
  testId?: string;
}

interface IState {
  hasOverflow: boolean;
}

class BreadcrumbsItem extends React.Component<IProps, IState> {
  // eslint-disable-line react/sort-comp
  button: any = null;

  static defaultProps = {
    hasSeparator: false,
    href: '#',
    truncationWidth: 0,
    onClick: () => {},
  };

  state = { hasOverflow: false };

  componentDidMount() {
    this.updateOverflow();
  }

  UNSAFE_componentWillReceiveProps() {
    // Reset the state
    this.setState({ hasOverflow: false });
  }

  componentDidUpdate() {
    this.updateOverflow();
  }

  updateOverflow() {
    const { truncationWidth } = this.props;
    const { button } = this;
    if (truncationWidth && button) {
      // We need to find the DOM node for the button component in order to measure its size.
      const el = ReactDOM.findDOMNode(button); // eslint-disable-line react/no-find-dom-node
      if (!el || !(el instanceof HTMLElement)) {
        // eslint-disable-next-line no-console
        console.warn(
          'Could not find button included in breadcrumb when calculating overflow',
        );
        return false;
      }
      const overflow = el.clientWidth >= truncationWidth;
      if (overflow !== this.state.hasOverflow) {
        this.setState({ hasOverflow: overflow });
      }
      return overflow;
    }
    return false;
  }

  renderButton = () => {
    const {
      href,
      iconAfter,
      iconBefore,
      onClick,
      target,
      text,
      truncationWidth,
      component,
      testId,
    } = this.props;
    const { hasOverflow } = this.state;

    return (
      // @ts-ignore - 31052019 VBZ - this shouldn't exist right?
      <Button
        truncationWidth={truncationWidth}
        appearance="subtle-link"
        iconAfter={truncationWidth && hasOverflow ? undefined : iconAfter}
        iconBefore={truncationWidth && hasOverflow ? undefined : iconBefore}
        onClick={onClick}
        spacing="none"
        href={href}
        target={target}
        ref={el => {
          this.button = el;
        }}
        component={component}
        analyticsContext={{
          componentName: 'breadcrumbsItem',
          packageName,
          packageVersion,
        }}
        testId={testId}
      >
        {text}
      </Button>
    );
  };

  renderButtonWithTooltip = () => (
    <AKTooltip content={this.props.text} position="bottom">
      {this.renderButton()}
    </AKTooltip>
  );

  render() {
    const { hasSeparator, truncationWidth } = this.props;
    const { hasOverflow } = this.state;

    return (
      <ItemWrapper>
        {hasOverflow && truncationWidth
          ? this.renderButtonWithTooltip()
          : this.renderButton()}
        {hasSeparator ? <Separator>/</Separator> : null}
      </ItemWrapper>
    );
  }
}

export { BreadcrumbsItem as BreadcrumbsItemWithoutAnalytics };
const createAndFireEventOnAtlaskit = createAndFireEvent('atlaskit');

export default withAnalyticsEvents({
  onClick: createAndFireEventOnAtlaskit({
    action: 'clicked',
    actionSubject: 'breadcrumbsItem',

    attributes: {
      componentName: 'breadcrumbsItem',
      packageName,
      packageVersion,
    },
  }),
})(BreadcrumbsItem);
