import React, { Children, cloneElement, Component } from 'react';

import { Transition } from 'react-transition-group';

import Portal from '@atlaskit/portal';
import { layers } from '@atlaskit/theme/constants';

import Wrapper, { flagAnimationTime } from '../../styled/Wrapper';
import { ChildrenType, FunctionType } from '../../types';

import Group, { Inner, SROnly } from './styledFlagGroup';

type Props = {
  /** Describes the specific role of this FlagGroup for users viewing the page with a screen reader (defaults to `Flag notifications`). */
  label: string;
  /** Describes the specific tag on which the screen reader text will be rendered (defaults to `h2`). */
  labelTag: string;
  /** Flag elements to be displayed. */
  children?: ChildrenType;
  /** Handler which will be called when a Flag's dismiss button is clicked.
   * Receives the id of the dismissed Flag as a parameter.
   */
  onDismissed?: FunctionType;
};

export default class FlagGroup extends Component<Props, {}> {
  static defaultProps = {
    label: 'Flag notifications',
    labelTag: 'h2',
  };

  private animationTimeoutId: number | undefined;

  componentWillUnmount() {
    window.clearTimeout(this.animationTimeoutId);
  }

  renderChildren = () => {
    const { children, onDismissed } = this.props;

    return Children.map(children, (flag: React.ReactElement, index: number) => {
      const isDismissAllowed: boolean = index === 0;
      const { id } = flag.props;

      return (
        // @ts-ignore: Bug in types - 'timeout' prop should not be required when addEndListener is provided
        <Transition
          key={id}
          addEndListener={(node, done: (a?: any) => void) => {
            if (index > 0) {
              done();
              return;
            }
            node.addEventListener('animationstart', (...args) => {
              this.animationTimeoutId = window.setTimeout(
                () => done(...args),
                flagAnimationTime,
              );
            });
            node.addEventListener('animationend', done);
          }}
        >
          {(transitionState: string) => (
            <Wrapper transitionState={transitionState}>
              {cloneElement(flag, { onDismissed, isDismissAllowed })}
            </Wrapper>
          )}
        </Transition>
      );
    });
  };

  render() {
    const { children, label, labelTag } = this.props;
    const shouldRenderScreenReaderText = !(
      !children ||
      (children && children.length === 0)
    );

    return (
      <Portal zIndex={layers.flag()}>
        <Group>
          {shouldRenderScreenReaderText ? (
            <SROnly tag={labelTag}>{label}</SROnly>
          ) : null}
          <Inner component="div">{this.renderChildren()}</Inner>
        </Group>
      </Portal>
    );
  }
}
