import React from 'react';
import { type Actions, type State, type StorePropInput, type Store } from '../types';

/**
 * Props type for the ReactionConsumer class component
 */
export type ReactioConsumerProps<PropsFromState, PropsFromActions> = {
	/**
	 * Return a plain object containing the data that the connected component needs
	 */
	mapStateToProps?: (state: State) => PropsFromState;
	/**
	 * Specify which actions the child component might need to dispatch from its props
	 */
	mapActionsToProps?: (actions: Actions) => PropsFromActions;
	/**
	 * Component to render
	 */
	children: (props: PropsFromState & PropsFromActions) => React.ReactNode;
	/**
	 * Reference to the store.
	 * @remarks
	 * This was initially implemented with a sync and Async versions and will be replaced with just a sync Store in a future release (Please use only the sync version)
	 */
	store: StorePropInput;
};

/**
 * State type for the ReactionConsumer class component
 */
export type ReactionConsumerState = { store?: Store };

/**
 * A custom mapper class that takes the store instance and mapper functions "mapStateToProps" and "mapActionsToProps" to return the renderProps pattern as a child component
 * @deprecated please avoid using this class as it will be removed in a future release
 */
export class ReactionConsumer<PropsFromState, PropsFromActions> extends React.PureComponent<
	ReactioConsumerProps<PropsFromState, PropsFromActions>,
	ReactionConsumerState
> {
	private previousActions: Actions | undefined;
	private propsFromActions: PropsFromActions | undefined;

	constructor(props: ReactioConsumerProps<PropsFromState, PropsFromActions>) {
		super(props);
		this.state = {
			store: undefined,
		};
	}

	componentDidMount() {
		Promise.resolve(this.props.store).then((store) => {
			this.setState({ store });
			store.onChange(this.handleOnChange);
		});
	}

	async componentWillUnmount() {
		if (this.state.store) {
			this.state.store.removeOnChangeListener(this.handleOnChange);
		}
	}

	/**
	 * Get the actions the child component might need to dispatch from its props
	 */
	private getPropsFromActions = (actions: Actions) => {
		const { mapActionsToProps } = this.props;
		if (mapActionsToProps) {
			if (!this.previousActions || !this.propsFromActions || this.previousActions !== actions) {
				this.propsFromActions = mapActionsToProps(actions);
			}
		}
		this.previousActions = actions;
		return this.propsFromActions;
	};

	/**
	 *
	 * @param state Internal state data
	 * @returns object containing the data that the connected component needs
	 */
	private getPropsFromState = (state: State) => {
		const { mapStateToProps } = this.props;
		return mapStateToProps ? mapStateToProps(state) : undefined;
	};

	/**
	 *
	 */
	private handleOnChange = () => {
		this.forceUpdate();
	};

	render() {
		if (!this.state.store) {
			return null;
		}
		return this.props.children(
			Object.assign(
				{},
				this.getPropsFromState(this.state.store.getState()),
				this.getPropsFromActions(this.state.store),
			),
		);
	}
}
