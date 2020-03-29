import React, { Component } from 'react';

const DefaultBaseComponent = props => <div {...props} />;

const withContextFromProps = (
  propTypes,
  BaseComponent = DefaultBaseComponent,
) => {
  class ContextProps extends Component {
    getChildContext() {
      const props = Object.keys(propTypes).reduce((result, key) => {
        // eslint-disable-next-line no-param-reassign
        if (key !== 'children') result[key] = this.props[key];

        return result;
      }, {});

      return props;
    }

    render() {
      const { children, ...props } = this.props;
      if (BaseComponent !== null) {
        return <BaseComponent>{this.props.children}</BaseComponent>;
      }
      if (React.Children.count(children) === 1) {
        const onlyChild = children;
        // Hacky fix to work with TransitionGroup in withRenderTarget
        return React.Children.only(React.cloneElement(onlyChild, props));
      }
      throw Error('Only one child should exist when base component is null');
    }
  }

  ContextProps.displayName = 'withContextFromProps';
  ContextProps.childContextTypes = propTypes;

  return ContextProps;
};

export default withContextFromProps;
