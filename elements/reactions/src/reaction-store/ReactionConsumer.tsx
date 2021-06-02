import React from 'react';
import { ReactionAction } from '../types';
import { ReactionsStore, State } from './ReactionsStore';

export type ReactionStoreProp = ReactionsStore | Promise<ReactionsStore>;

export type ReactionStoreState = State;

export type Actions = {
  getReactions: (containerId: string, aris: string) => void;
  toggleReaction: ReactionAction;
  addReaction: ReactionAction;
  getDetailedReaction: ReactionAction;
};

export type Props<PropsFromState extends {}, PropsFromActions extends {}> = {
  stateMapper?: (state: State) => PropsFromState;
  actionsMapper?: (actions: Actions) => PropsFromActions;
  children: (props: PropsFromState & PropsFromActions) => React.ReactNode;
  store: ReactionStoreProp;
};

type ConsumerState = { store?: ReactionsStore };

export class ReactionConsumer<
  PropsFromState extends {},
  PropsFromActions extends {}
> extends React.PureComponent<
  Props<PropsFromState, PropsFromActions>,
  ConsumerState
> {
  private previousActions: Actions | undefined;
  private propsFromActions: PropsFromActions | undefined;

  constructor(props: Props<PropsFromState, PropsFromActions>) {
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
