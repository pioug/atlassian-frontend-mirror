import React, {
  PureComponent,
  createContext,
  ElementType,
  ReactNode,
} from 'react';
import memoizeOne from 'memoize-one';
import Portal from '@atlaskit/portal';
import { layers } from '@atlaskit/theme/constants';

import { Fade } from './Animation';
import Blanket from '../styled/Blanket';

const noop = () => {};

interface SpotlightContext {
  opened: () => void;
  closed: () => void;
  targets: {
    [key: string]: HTMLElement | undefined;
  };
}

const { Consumer: TargetConsumer, Provider: TargetProvider } = createContext<
  any
>(undefined);

const {
  Consumer: SpotlightStateConsumer,
  Provider: SpotlightStateProvider,
} = createContext<SpotlightContext>({
  opened: noop,
  closed: noop,
  targets: {},
});

export { TargetConsumer };

export { SpotlightStateConsumer as SpotlightConsumer };

interface Props {
  /** Boolean prop for toggling blanket transparency  */
  blanketIsTinted?: boolean;
  /* Typically the app, or a section of the app */
  children: ReactNode;
  /* Deprecated - Replaces the wrapping fragment with component */
  component?: ElementType;
}

const Container = ({
  component: Wrapper,
  children,
}: {
  component: ElementType;
  children: ReactNode;
}) => <Wrapper>{children}</Wrapper>;

export default class SpotlightManager extends PureComponent<
  Props,
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
    this.setState(state => ({
      targets: {
        ...state.targets,
        [name]: element || undefined,
      },
    }));
  };

  spotlightOpen = () => {
    this.setState(state => ({ spotlightCount: state.spotlightCount + 1 }));
  };

  spotlightClose = () => {
    this.setState(state => ({ spotlightCount: state.spotlightCount - 1 }));
  };

  getStateProviderValue = memoizeOne(targets => ({
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
            <Fade in={this.state.spotlightCount > 0}>
              {animationStyles => (
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
