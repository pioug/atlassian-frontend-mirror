import React from 'react';
import {
  MentionProvider,
  isResolvingMentionProvider,
} from '../../api/MentionResource';
import {
  MentionEventHandler,
  isPromise,
  MentionNameDetails,
  MentionNameStatus,
} from '../../types';
import Mention, { UNKNOWN_USER_ID } from './';

export interface Props {
  id: string;
  text: string;
  accessLevel?: string;
  mentionProvider?: Promise<MentionProvider>;
  onClick?: MentionEventHandler;
  onMouseEnter?: MentionEventHandler;
  onMouseLeave?: MentionEventHandler;
}

export interface State {
  isHighlighted: boolean;
  resolvedMentionName?: string;
}

export default class ResourcedMention extends React.PureComponent<
  Props,
  State
> {
  constructor(props: Props) {
    super(props);

    this.state = {
      isHighlighted: false,
    };
  }

  componentDidMount() {
    this.handleMentionProvider(this.props);
  }

  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    const { props } = this;
    if (
      props.id !== nextProps.id ||
      props.mentionProvider !== nextProps.mentionProvider
    ) {
      this.handleMentionProvider(nextProps);
    }
  }

  private processName(name: MentionNameDetails): string {
    let mentionName;
    switch (name.status) {
      case MentionNameStatus.OK:
        mentionName = name.name || '';
        break;
      case MentionNameStatus.SERVICE_ERROR:
      case MentionNameStatus.UNKNOWN:
      default:
        mentionName = UNKNOWN_USER_ID;
        break;
    }
    return `@${mentionName}`;
  }

  private handleMentionProvider = (props: Props) => {
    const { id, mentionProvider, text } = props;
    if (mentionProvider) {
      mentionProvider
        .then(provider => {
          const newState: State = {
            isHighlighted: provider.shouldHighlightMention({ id }),
          };
          if (!text && isResolvingMentionProvider(provider)) {
            const nameDetail = provider.resolveMentionName(id);
            if (isPromise(nameDetail)) {
              nameDetail.then(nameDetailResult => {
                this.setState({
                  resolvedMentionName: this.processName(nameDetailResult),
                });
              });
            } else {
              newState.resolvedMentionName = this.processName(nameDetail);
            }
          }
          this.setState(newState);
        })
        .catch(() => {
          this.setState({
            isHighlighted: false,
          });
        });
    } else {
      this.setState({
        isHighlighted: false,
      });
    }
  };

  render() {
    const { props, state } = this;

    return (
      <Mention
        id={props.id}
        text={state.resolvedMentionName || props.text}
        isHighlighted={state.isHighlighted}
        accessLevel={props.accessLevel}
        onClick={props.onClick}
        onMouseEnter={props.onMouseEnter}
        onMouseLeave={props.onMouseLeave}
      />
    );
  }
}
