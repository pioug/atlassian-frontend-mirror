import React from 'react';
import { FormattedMessage, type MessageDescriptor } from 'react-intl-next';
import Avatar from '@atlaskit/avatar';

import { contentPreviewMessages } from '../../messages';
import * as Styled from './styled';
import MessagesIntlProvider from '../MessagesIntlProvider';
import {
  type DeleteUserContentPreviewScreenProps,
  type DeleteUserContentPreviewScreenState,
} from './types';

export class DeleteUserContentPreviewScreen extends React.Component<
  DeleteUserContentPreviewScreenProps,
  DeleteUserContentPreviewScreenState
> {
  state: DeleteUserContentPreviewScreenState = {
    currentActive: -1,
  };

  componentDidMount() {
    this.props.preferenceSelection('');
  }

  handleClickSection = (userName: string, position: number) => () => {
    this.props.preferenceSelection(userName);
    this.setState({ currentActive: position });
  };

  isCardSelected = (position: number): boolean => {
    return position === this.state.currentActive;
  };

  selectAdminOrSelfCopy = (
    adminCopy: MessageDescriptor,
    selfCopy: MessageDescriptor,
  ) => {
    return this.props.isCurrentUser ? selfCopy : adminCopy;
  };

  render() {
    const { user } = this.props;
    return (
      <MessagesIntlProvider>
        <Styled.Screen>
          <Styled.Title>
            <FormattedMessage
              {...this.selectAdminOrSelfCopy(
                contentPreviewMessages.headingAdmin,
                contentPreviewMessages.headingSelf,
              )}
            />
          </Styled.Title>
          <FormattedMessage
            {...this.selectAdminOrSelfCopy(
              contentPreviewMessages.paragraphSurveyAdmin,
              contentPreviewMessages.paragraphSurveySelf,
            )}
            tagName="p"
          />
          <FormattedMessage
            {...this.selectAdminOrSelfCopy(
              contentPreviewMessages.lineSurveyAdmin,
              contentPreviewMessages.lineSurveySelf,
            )}
            tagName="p"
          />
          <Styled.SectionCard
            className="nameSectionCard"
            onClick={this.handleClickSection('Name', 1)}
            isSelected={1 === this.state.currentActive}
          >
            <Styled.Avatar>
              <Avatar size="large" src="" />
            </Styled.Avatar>
            <Styled.UserDetails>{user.fullName}</Styled.UserDetails>
          </Styled.SectionCard>
          <Styled.SectionCard
            className="formerUserSectionCard"
            onClick={this.handleClickSection('Former User', 0)}
            isSelected={0 === this.state.currentActive}
          >
            <Styled.Avatar>
              <Avatar size="large" src="" />
            </Styled.Avatar>
            <Styled.UserDetails>
              <FormattedMessage {...contentPreviewMessages.formerUser} />
            </Styled.UserDetails>
          </Styled.SectionCard>
          <FormattedMessage
            {...this.selectAdminOrSelfCopy(
              contentPreviewMessages.footnoteAdmin,
              contentPreviewMessages.footnoteSelf,
            )}
            tagName="p"
          />
        </Styled.Screen>
      </MessagesIntlProvider>
    );
  }
}

export default DeleteUserContentPreviewScreen;
