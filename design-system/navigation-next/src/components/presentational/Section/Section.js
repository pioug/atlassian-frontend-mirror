import React, { PureComponent } from 'react';

import { ClassNames, css } from '@emotion/core';
import Transition from 'react-transition-group/Transition';
import TransitionGroup from 'react-transition-group/TransitionGroup';

import { NavigationAnalyticsContext } from '@atlaskit/analytics-namespaced-context';

import { transitionDurationMs } from '../../../common/constants';

import getAnimationStyles from './getAnimationStyles';

/** The below components are exported for testing purposes only. */
export const StaticTransitionGroup = (props) => (
  <div css={{ position: 'relative' }} {...props} />
);
export const ScrollableTransitionGroup = (props) => (
  <div
    css={{
      position: 'relative',
      flex: '1 1 100%',
      overflowY: 'hidden',
    }}
    {...props}
  />
);
export const ScrollableWrapper = (props) => <div {...props} />;
export const ScrollableInner = (props) => <div {...props} />;
export const StaticWrapper = (props) => <div {...props} />;

export default class Section extends PureComponent {
  state = {
    traversalDirection: null,
  };

  _isMounted = false;

  componentDidMount() {
    this._isMounted = true;
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.parentId && nextProps.parentId === this.props.id) {
      this.setState({ traversalDirection: 'down' });
    }
    if (this.props.parentId && this.props.parentId === nextProps.id) {
      this.setState({ traversalDirection: 'up' });
    }
  }

  render() {
    const {
      alwaysShowScrollHint,
      id,
      children,
      shouldGrow,
      styles: styleReducer,
      theme,
    } = this.props;

    const { mode, context } = theme;
    const styles = styleReducer(
      mode.section({ alwaysShowScrollHint })[context],
    );

    return (
      <TransitionGroup
        component={
          shouldGrow ? ScrollableTransitionGroup : StaticTransitionGroup
        }
        appear
      >
        <Transition
          key={id}
          timeout={this._isMounted ? transitionDurationMs : 0}
        >
          {(state) => {
            const { traversalDirection } = this.state;
            const animationStyles = getAnimationStyles({
              state,
              traversalDirection,
            });

            // We provide both the styles object and the computed className.
            // This allows consumers to patch the styles if they want to, or
            // simply apply the className if they're not using a JSS parser like
            // emotion.
            return (
              <NavigationAnalyticsContext
                data={{
                  attributes: { viewSection: id },
                  componentName: 'Section',
                }}
              >
                <ClassNames>
                  {({ css: getClassName }) =>
                    shouldGrow ? (
                      <ScrollableWrapper
                        css={css`
                          ${styles.wrapper}
                          ${animationStyles}
                        `}
                      >
                        <ScrollableInner css={styles.inner}>
                          {children({
                            className: getClassName(styles.children),
                            css: styles.children,
                          })}
                        </ScrollableInner>
                      </ScrollableWrapper>
                    ) : (
                      <StaticWrapper css={animationStyles}>
                        {children({
                          className: getClassName(styles.children),
                          css: styles.children,
                        })}
                      </StaticWrapper>
                    )
                  }
                </ClassNames>
              </NavigationAnalyticsContext>
            );
          }}
        </Transition>
      </TransitionGroup>
    );
  }
}
