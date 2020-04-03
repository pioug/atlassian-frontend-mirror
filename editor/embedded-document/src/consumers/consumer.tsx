import React from 'react';
import { PureComponent } from 'react';
import { Actions, Context, State } from '../context/context';

export interface Props<
  PropsFromState extends {},
  PropsFromActions extends {},
  RenderProps extends {}
> {
  stateMapper?: (state: State) => PropsFromState;
  actionsMapper?: (actions: Actions) => PropsFromActions;
  renderPropsMapper?: (renderProps: any) => RenderProps;
  children: (
    props: PropsFromState & PropsFromActions & RenderProps,
  ) => React.ReactNode;
}

export interface ConsumerProps<A, V, R> {
  actions: A;
  value: V;
  renderProps: R;
}

export class Consumer<
  PropsFromState extends {},
  PropsFromActions extends {},
  RenderProps extends {}
> extends PureComponent<Props<PropsFromState, PropsFromActions, RenderProps>> {
  private previousActions: Actions | undefined;
  private propsFromActions: PropsFromActions | undefined;

  private getPropsFromActions = (actions: Actions) => {
    const { actionsMapper } = this.props;
    if (actionsMapper) {
      if (
        !this.previousActions ||
        !this.propsFromActions ||
        this.previousActions !== actions
      ) {
        this.propsFromActions = actionsMapper(actions);
      }
    }
    this.previousActions = actions;
    return this.propsFromActions;
  };

  private getPropsFromState = (state: State) => {
    const { stateMapper } = this.props;
    if (stateMapper) {
      return stateMapper(state);
    }
    return undefined;
  };

  private getRenderProps = (renderProps: RenderProps) => {
    const { renderPropsMapper } = this.props;
    if (renderPropsMapper) {
      return renderPropsMapper(renderProps);
    }
    return undefined;
  };

  private renderChildren = ({
    actions,
    value,
    renderProps,
  }: ConsumerProps<Actions, State, RenderProps>) => {
    const props = Object.assign(
      {},
      this.getPropsFromState(value),
      this.getPropsFromActions(actions),
      this.getRenderProps(renderProps),
    );

    return this.props.children(props);
  };

  render() {
    return <Context.Consumer>{this.renderChildren}</Context.Consumer>;
  }
}
