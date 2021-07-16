import React, { PureComponent } from 'react';

import Transition from 'react-transition-group/Transition';

const DURATION = 300;

function camelToKebab(str) {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

function getTransition(keys) {
  return {
    transition: keys
      .map((k) => `${camelToKebab(k)} ${DURATION}ms cubic-bezier(0.2, 0, 0, 1)`)
      .join(','),
  };
}
function getStyle({ keys, values }) {
  const style = {};
  keys.forEach((k, i) => {
    style[k] = values[i];
  });
  return style;
}
function getChanges(keys) {
  const props = keys.map((k) => camelToKebab(k));
  return { willChange: props.join(',') };
}
export function isTransitioning(state) {
  return ['entering', 'exiting'].includes(state);
}

function NOOP() {}

export default class ResizeTransition extends PureComponent {
  target;

  static defaultProps = {
    onExpandStart: NOOP,
    onExpandEnd: NOOP,
    onCollapseStart: NOOP,
    onCollapseEnd: NOOP,
  };

  _isMounted = false;

  componentDidMount() {
    this._isMounted = true;
  }

  getTarget = (ref) => {
    this.target = ref;

    const { innerRef } = this.props;
    if (innerRef) innerRef(ref);
  };

  render() {
    const {
      from,
      onExpandStart,
      onExpandEnd,
      onCollapseStart,
      onCollapseEnd,
      properties,
      to,
      userIsDragging,
      in: inProp,
    } = this.props;

    return (
      <Transition
        onEntering={onExpandStart}
        onEntered={onExpandEnd}
        onExiting={onCollapseStart}
        onExited={onCollapseEnd}
        in={inProp}
        timeout={this._isMounted ? DURATION : 0}
      >
        {(transitionState) => {
          // transitions interupt manual resize behaviour
          const cssTransition =
            !userIsDragging && this._isMounted ? getTransition(properties) : {};

          // `from` and `to` styles tweened by the transition
          const dynamicProperties = {
            exiting: getStyle({ keys: properties, values: from }),
            exited: getStyle({ keys: properties, values: from }),
            entering: getStyle({ keys: properties, values: to }),
            entered: getStyle({ keys: properties, values: to }),
          };

          // let the browser know what we're up to
          const willChange = getChanges(properties);

          // put it all together
          const transitionStyle = {
            ...willChange,
            ...cssTransition,
            ...dynamicProperties[transitionState],
          };

          return this.props.children({
            transitionStyle, // consumers must apply `transitionStyle`
            transitionState, // lets consumers react to the current state
          });
        }}
      </Transition>
    );
  }
}
