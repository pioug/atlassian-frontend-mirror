import React, {
  createContext,
  ElementType,
  PureComponent,
  ReactNode,
} from 'react';

import memoizeOne from 'memoize-one';

import Portal from '@atlaskit/portal';
import { layers } from '@atlaskit/theme/constants';

import Blanket from '../styled/blanket';

import { Fade } from './animation';

const noop = () => {};

const { Consumer: TargetConsumer, Provider: TargetProvider } = createContext<
  any
>(undefined);

const SpotlightContext = createContext<{
  opened: () => void;
  closed: () => void;
  targets: {
    [key: string]: HTMLElement | undefined;
  };
}>({
  opened: noop,
  closed: noop,
  targets: {},
});

const {
  Consumer: SpotlightStateConsumer,
  Provider: SpotlightStateProvider,
} = SpotlightContext;

export { TargetConsumer };

export { SpotlightContext, SpotlightStateConsumer as SpotlightConsumer };

interface SpotlightManagerProps {
  /**
   * Boolean prop for toggling blanket transparency
   */
  // eslint-disable-next-line @repo/internal/react/boolean-prop-naming-convention
  blanketIsTinted?: boolean;
  /**
   * Typically the app, or a section of the app
   */
  children: ReactNode;
  /**
   * @deprecated
   * Replaces the wrapping fragment with component
   */
  // eslint-disable-next-line @repo/internal/react/consistent-props-definitions
  component?: ElementType;
}

const Container = ({
  component: Wrapper,
  children,
}: {
  component: ElementType;
  children: ReactNode;
}) => <Wrapper>{children}</Wrapper>;

/**
 * __Spotlight manager__
 *
 * Wraps usage of spotlight and manages progression through multiple spotlights.
 *
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/onboarding)
 */
export default class SpotlightManager extends PureComponent<
  SpotlightManagerProps,
  {
    spotlightCount: number;
    targets: { [key: string]: HTMLElement | void };
  }
> {
  static defaultProps = {
    blanketIsTinted: true,
  };

  componentDidMount() {
    if (process.env.NODE_ENV !== 'production' && !process.env.CI) {
      if (this.props.component) {
        // eslint-disable-next-line no-console
        console.warn(
          `Atlaskit: The SpotlightManager 'component' prop is deprecated. Please wrap the SpotlightManager in the component instead.`,
        );
      }
    }
  }

  state = {
    spotlightCount: 0,
    targets: {},
  };

  targetRef = (name: string) => (element: HTMLElement | void) => {
    this.setState((state) => ({
      targets: {
        ...state.targets,
        [name]: element || undefined,
      },
    }));
  };

  spotlightOpen = () => {
    this.setState((state) => ({ spotlightCount: state.spotlightCount + 1 }));
  };

  spotlightClose = () => {
    this.setState((state) => ({ spotlightCount: state.spotlightCount - 1 }));
  };

  getStateProviderValue = memoizeOne((targets) => ({
    opened: this.spotlightOpen,
    closed: this.spotlightClose,
    targets,
  }));

  render() {
    const { blanketIsTinted, children, component: Tag } = this.props;
    return (
      <SpotlightStateProvider
        value={this.getStateProviderValue(this.state.targets)}
      >
        <TargetProvider value={this.targetRef}>
          <Container component={Tag || React.Fragment}>
            <Fade hasEntered={this.state.spotlightCount > 0}>
              {(animationStyles) => (
                <Portal zIndex={layers.spotlight()}>
                  <Blanket style={animationStyles} isTinted={blanketIsTinted} />
                </Portal>
              )}
            </Fade>
            {children}
          </Container>
        </TargetProvider>
      </SpotlightStateProvider>
    );
  }
}
