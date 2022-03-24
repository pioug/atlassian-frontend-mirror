import React from 'react';
import { Actions } from '../types';
import { StateMapperProps } from '../components/Reactions';
import { ReactionsStore, State } from './ReactionsStore';

export type ReactionStoreProp = ReactionsStore | Promise<ReactionsStore>;

export type ReactionStoreState = State;

export interface ExtendedPropsFromState extends StateMapperProps {}

export type Props<ExtendedPropsFromState, PropsFromActions extends {}> = {
  stateMapper?: (state: State) => ExtendedPropsFromState;
  actionsMapper?: (actions: Actions) => PropsFromActions;
  children: (
    props: ExtendedPropsFromState & PropsFromActions,
  ) => React.ReactNode;
  store: ReactionStoreProp;
};

type ConsumerState = { store?: ReactionsStore };

export class ReactionConsumer<
  ExtendedPropsFromState,
  PropsFromActions extends {}
> extends React.PureComponent<
  Props<ExtendedPropsFromState, PropsFromActions>,
  ConsumerState
> {
  private previousActions: Actions | undefined;
  private propsFromActions: PropsFromActions | undefined;

  constructor(props: Props<ExtendedPropsFromState, PropsFromActions>) {
    super(props);
    this.state = {};
  }

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

  private handleOnChange = () => {
    this.forceUpdate();
  };

  componentDidMount() {
    Promise.resolve(this.props.store).then((store) => {
      this.setState({ store });
      store.onChange(this.handleOnChange);
    });
  }

  componentWillUnmount() {
    if (this.state.store) {
      this.state.store.removeOnChangeListener(this.handleOnChange);
    }
  }

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
