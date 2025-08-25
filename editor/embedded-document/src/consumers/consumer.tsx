import React, { PureComponent } from 'react';
import { type Actions, Context, type State } from '../context/context';

export interface Props<
	PropsFromState extends Object,
	PropsFromActions extends Object,
	RenderProps extends Object,
> {
	actionsMapper?: (actions: Actions) => PropsFromActions;
	children: (props: PropsFromState & PropsFromActions & RenderProps) => React.ReactNode;
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	renderPropsMapper?: (renderProps: any) => RenderProps;
	stateMapper?: (state: State) => PropsFromState;
}

export interface ConsumerProps<A, V, R> {
	actions: A;
	renderProps: R;
	value: V;
}

// Ignored via go/ees005
// eslint-disable-next-line @repo/internal/react/no-class-components
export class Consumer<
	PropsFromState extends Object,
	PropsFromActions extends Object,
	RenderProps extends Object,
> extends PureComponent<Props<PropsFromState, PropsFromActions, RenderProps>> {
	private previousActions: Actions | undefined;
	private propsFromActions: PropsFromActions | undefined;

	private getPropsFromActions = (actions: Actions) => {
		const { actionsMapper } = this.props;
		if (actionsMapper) {
			if (!this.previousActions || !this.propsFromActions || this.previousActions !== actions) {
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
