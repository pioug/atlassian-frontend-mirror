import React, { RefObject } from 'react';
import {
  withAnalyticsEvents,
  WithAnalyticsEventsProps,
  CreateUIAnalyticsEvent,
} from '@atlaskit/analytics-next';
import Button from '@atlaskit/button/custom-theme-button';
import EditorCloseIcon from '@atlaskit/icon/glyph/editor/close';
import Tooltip from '@atlaskit/tooltip';
import TeamMentionHighlightController from './TeamMentionHighlightController';

import {
  fireAnalyticsTeamMentionHighlightEvent,
  ComponentNames,
  Actions,
} from '../../util/analytics';

import {
  TeamMentionHighlightTitle,
  TeamMentionHighlightCloseTooltip,
  TeamMentionHighlightDescription,
  TeamMentionHighlightDescriptionLink,
} from '../../util/i18n';
import * as Styled from './styles';

export interface OwnProps {
  createTeamLink?: string;
  /** Callback to track the event where user click on x icon */
  onClose: () => void;
  onCreateTeamLinkClick?: () => void;
  onViewed?: () => void;
}

export interface State {
  isHighlightHidden: boolean;
}

export type Props = OwnProps & WithAnalyticsEventsProps;

const ICON_URL =
  'data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIHdpZHRoPSIxMjgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48Y2lyY2xlIGN4PSI2NCIgY3k9IjY0IiBmaWxsPSIjNTI0M2FhIiBmaWxsLXJ1bGU9Im5vbnplcm8iIHI9IjY0Ii8+PHBhdGggZD0ibTgwIDY0Yy02LjYyNzQxNyAwLTEyLTUuMzcyNTgzLTEyLTEyczUuMzcyNTgzLTEyIDEyLTEyIDEyIDUuMzcyNTgzIDEyIDEyLTUuMzcyNTgzIDEyLTEyIDEyem0tMzItMTJjLTYuNjI3NDE3IDAtMTItNS4zNzI1ODMtMTItMTJzNS4zNzI1ODMtMTIgMTItMTIgMTIgNS4zNzI1ODMgMTIgMTItNS4zNzI1ODMgMTItMTIgMTJ6bTEyIDI0YzAtNC40MiAzLjU0OC04IDgtOGgyNGM0LjQyIDAgOCAzLjU0IDggOHYxNC45MmMwIDEyLjEwOC00MCAxMi4xMDgtNDAgMHptOC0xMmgtLjAxMmMtMy4xODQzNTM3LjAwNDI0LTYuMjM2NTQxIDEuMjczNTYxNS04LjQ4NDg0MjcgMy41Mjg2MTQ5LTIuMjQ4MzAxOCAyLjI1NTA1MzQtMy41MDg0NjU2IDUuMzExMDMzLTMuNTAzMTU3MyA4LjQ5NTM4NTF2MTEuMjI4Yy0xMS43ODQgMi4xMzYtMjgtLjI1Mi0yOC03LjkzNnYtMTUuMzA0YzAtNC40MjQgMy41NDgtOC4wMTIgOC04LjAxMmgyNGMyLjEyMjcwODYtLjAwMzE5MTIgNC4xNTkzOTQ2LjgzODYzODYgNS42NjAzNzggMi4zMzk2MjJzMi4zNDI4MTMyIDMuNTM3NjY5NCAyLjMzOTYyMiA1LjY2MDM3OHoiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjk1Ii8+PC9nPjwvc3ZnPg==';

export class TeamMentionHighlightInternal extends React.Component<
  Props,
  State
> {
  // Wrap whole dialog so we can catch events, see preventClickOnCard
  elWrapper: RefObject<HTMLDivElement>;
  // Wrap the close button, so we can still manually invoke onClose()
  elCloseWrapper: RefObject<HTMLDivElement>;
  // Wrap the create team link, so we can still manually invoke the analytics
  elCreateTeamWrapper: RefObject<HTMLDivElement>;

  static defaultProps = {
    createTeamLink: '/people/search#createTeam',
  };

  constructor(props: Props) {
    super(props);
    this.elWrapper = React.createRef();
    this.elCloseWrapper = React.createRef();
    this.elCreateTeamWrapper = React.createRef();
    this.state = {
      isHighlightHidden: false,
    };
  }

  componentDidMount() {
    const { onViewed } = this.props;
    this.addEventHandler();

    // Highlight hiding logic was moved to Mount method because if Highlight is re-rendered after updating the
    // counts at MentionHighlightController, Highlight will appear for sometime and then disappear. As of the time
    // of writing this code, this was only happening in Fabric Editor ( See TEAMS-623 )
    if (!TeamMentionHighlightController.isHighlightEnabled()) {
      this.setState({ isHighlightHidden: true });
    } else {
      TeamMentionHighlightController.registerRender();
      if (onViewed) {
        onViewed();
      }
    }
  }

  componentWillUnmount() {
    this.removeEventHandler();
  }

  onCreateTeamLinkClick = () => {
    this.setState({ isHighlightHidden: true });
    const { onCreateTeamLinkClick } = this.props;
    TeamMentionHighlightController.registerCreateLinkClick();
    if (onCreateTeamLinkClick) {
      onCreateTeamLinkClick();
    }
  };

  // This is to stop overly aggressive behaviour in tinyMCe editor where clicking anywhere in the Highlight would immediate close the entire
  // dropdown dialog. See TEAMS-611
  private preventClickOnCard = (event: any) => {
    // event is a MouseEvent

    // We stop the event from propagating, so we need to manually close
    const isClickOnCloseButton =
      this.elCloseWrapper.current &&
      this.elCloseWrapper.current.contains(event.target);
    if (isClickOnCloseButton) {
      this.onCloseClick();
    }

    // Manually perform on-click for the link, if the link was clicked.
    const isClickCreateTeamLink =
      this.elCreateTeamWrapper.current &&
      this.elCreateTeamWrapper.current.contains(event.target);
    if (isClickCreateTeamLink) {
      this.onCreateTeamLinkClick();
    }

    // Allow default so the link to create team still works, but prevent the rest
    event.stopPropagation();
    event.stopImmediatePropagation();
  };

  private addEventHandler(): void {
    this.elWrapper.current &&
      this.elWrapper.current.addEventListener('click', this.preventClickOnCard);
  }

  private removeEventHandler(): void {
    this.elWrapper.current &&
      this.elWrapper.current.removeEventListener(
        'click',
        this.preventClickOnCard,
      );
  }

  onCloseClick = () => {
    this.setState({ isHighlightHidden: true });
    this.props.onClose();
  };

  render() {
    const { createTeamLink } = this.props;
    const { isHighlightHidden } = this.state;

    if (isHighlightHidden) {
      return null;
    }

    return (
      <div ref={this.elWrapper}>
        <Styled.Card>
          <Styled.Content>
            <Styled.Aside>
              <img src={ICON_URL} height={32} />
            </Styled.Aside>
            <Styled.Section>
              <Styled.Heading>
                <Styled.Title>
                  <TeamMentionHighlightTitle />
                </Styled.Title>
              </Styled.Heading>
              <Styled.Body>
                <TeamMentionHighlightDescription>
                  {(description) => (
                    <div>
                      {description}
                      <span ref={this.elCreateTeamWrapper}>
                        <TeamMentionHighlightDescriptionLink>
                          {(linkText) => (
                            <a href={createTeamLink} target="_blank">
                              {' '}
                              {linkText}
                            </a>
                            // on click fired by preventClickOnCard, not here
                          )}
                        </TeamMentionHighlightDescriptionLink>
                      </span>
                    </div>
                  )}
                </TeamMentionHighlightDescription>
              </Styled.Body>
            </Styled.Section>
            <Styled.Actions>
              <div ref={this.elCloseWrapper}>
                <TeamMentionHighlightCloseTooltip>
                  {(tooltip) => (
                    <Tooltip content={tooltip} position="bottom">
                      <Button
                        appearance="subtle"
                        iconBefore={
                          <EditorCloseIcon label="Close" size="medium" />
                        }
                        spacing="none"
                        // on click fired by preventClickOnCard, not here
                      />
                    </Tooltip>
                  )}
                </TeamMentionHighlightCloseTooltip>
              </div>
            </Styled.Actions>
          </Styled.Content>
        </Styled.Card>
      </div>
    );
  }
}

const TeamMentionHighlightWithAnalytics = withAnalyticsEvents({
  onClose: (createEvent: CreateUIAnalyticsEvent) => {
    fireAnalyticsTeamMentionHighlightEvent(createEvent)(
      ComponentNames.TEAM_MENTION_HIGHLIGHT,
      Actions.CLOSED,
      ComponentNames.MENTION,
      'closeButton',
    );
  },

  onCreateTeamLinkClick: (createEvent: CreateUIAnalyticsEvent) => {
    fireAnalyticsTeamMentionHighlightEvent(createEvent)(
      ComponentNames.TEAM_MENTION_HIGHLIGHT,
      Actions.CLICKED,
      ComponentNames.MENTION,
      'createTeamLink',
    );
  },

  onViewed: (createEvent: CreateUIAnalyticsEvent) => {
    fireAnalyticsTeamMentionHighlightEvent(createEvent)(
      ComponentNames.TEAM_MENTION_HIGHLIGHT,
      Actions.VIEWED,
      ComponentNames.MENTION,
      undefined,
      TeamMentionHighlightController.getSeenCount(),
    );
  },
})(TeamMentionHighlightInternal);

const TeamMentionHighlight = TeamMentionHighlightWithAnalytics;
type TeamMentionHighlight = TeamMentionHighlightInternal;

export default TeamMentionHighlight;
