import React, { Component, ComponentType } from 'react';
import { getDisplayName } from '../utils';

interface Mapping<Props> {
  [key: string]: (props: Props) => void;
}

export default function mapProps<Props extends Object>(
  mapping: Mapping<Props>,
) {
  return (DecoratedComponent: ComponentType<Props>) =>
    class MapProps extends Component<Props> {
      static displayName: string | void | null = getDisplayName(
        'mapProps',
        DecoratedComponent,
      );

      static DecoratedComponent = DecoratedComponent;

      component?: React.Ref<any>;

      // expose blur/focus to consumers via ref
      blur = () => {
        // @ts-ignore accessing component internals
        if (this.component && this.component.blur) this.component.blur();
      };

      focus = () => {
        // @ts-ignore accessing component internals
        if (this.component && this.component.focus) this.component.focus();
      };

      setComponent = (component?: React.Ref<any>) => {
        this.component = component;
      };

      render() {
        const mapped = {
          ...this.props,
          ...Object.keys(mapping).reduce(
            (acc, key) => ({
              ...acc,
              [key]: mapping[key](this.props),
            }),
            {},
          ),
        };

        return <DecoratedComponent ref={this.setComponent} {...mapped} />;
      }
    };
}
