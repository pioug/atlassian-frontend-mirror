import React from 'react';
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl';
import Button from '@atlaskit/button/custom-theme-button';
import SectionMessage from '@atlaskit/section-message';
import InfoIcon from '@atlaskit/icon/glyph/info';

import { commonMessages, overviewMessages } from '../../messages';
import StatefulInlineDialog from '../StatefulInlineDialog';
import UserInfo from '../UserInfo';
import { DeleteUserOverviewScreenProps } from './types';
import * as Styled from './styled';
import { DropdownList } from '../DropdownList';
import MessagesIntlProvider from '../MessagesIntlProvider';

export class DeleteUserOverviewScreen extends React.Component<
  DeleteUserOverviewScreenProps
> {
  static defaultProps: Partial<DeleteUserOverviewScreenProps> = {
    isCurrentUser: false,
  };

  selectAdminOrSelfCopy = (
    adminCopy: FormattedMessage.MessageDescriptor,
    selfCopy: FormattedMessage.MessageDescriptor,
  ) => {
    return this.props.isCurrentUser ? selfCopy : adminCopy;
  };

  displayFirstListElement = () => {
    const { accessibleSites, user, isUserDeactivated } = this.props;

    if (isUserDeactivated) {
      return null;
    }

    const hasAccessibleSites = accessibleSites && accessibleSites.length > 0;
    return (
      <li>
        {!hasAccessibleSites && (
          <FormattedHTMLMessage
            {...this.selectAdminOrSelfCopy(
              overviewMessages.paragraphLoseAccessAdminNoSites,
              overviewMessages.paragraphLoseAccessSelfNoSites,
            )}
            values={{ fullName: user.fullName }}
          />
        )}
        {hasAccessibleSites && (
          <>
            <FormattedHTMLMessage
              {...this.selectAdminOrSelfCopy(
                overviewMessages.paragraphLoseAccessAdmin,
                overviewMessages.paragraphLoseAccessSelf,
              )}
              values={{ fullName: user.fullName }}
              tagName={'p'}
            />
            <DropdownList accessibleSites={accessibleSites} />
          </>
        )}
      </li>
    );
  };

  displaySecondListElement = () => {
    return (
      <li>
        <FormattedHTMLMessage
          {...this.selectAdminOrSelfCopy(
            overviewMessages.paragraphPersonalDataWillBeDeletedAdmin,
            overviewMessages.paragraphPersonalDataWillBeDeletedSelf,
          )}
        />
        <Styled.IconHoverWrapper>
          <StatefulInlineDialog
            placement="auto-start"
            content={
              <Styled.InlineDialogContent>
                <FormattedMessage
                  {...this.selectAdminOrSelfCopy(
                    overviewMessages.inlineDialogDataWillBeDeletedP1Admin,
                    overviewMessages.inlineDialogDataWillBeDeletedP1Self,
                  )}
                  tagName="p"
                />
                <FormattedMessage
                  {...this.selectAdminOrSelfCopy(
                    overviewMessages.inlineDialogDataWillBeDeletedLi1Admin,
                    overviewMessages.inlineDialogDataWillBeDeletedLi1Self,
                  )}
                  tagName="li"
                />
                <FormattedMessage
                  {...this.selectAdminOrSelfCopy(
                    overviewMessages.inlineDialogDataWillBeDeletedLi2Admin,
                    overviewMessages.inlineDialogDataWillBeDeletedLi2Self,
                  )}
                  tagName="li"
                />
                <FormattedMessage
                  {...this.selectAdminOrSelfCopy(
                    overviewMessages.inlineDialogDataWillBeDeletedLi3Admin,
                    overviewMessages.inlineDialogDataWillBeDeletedLi3Self,
                  )}
                  tagName="li"
                />
                <FormattedMessage
                  {...this.selectAdminOrSelfCopy(
                    overviewMessages.inlineDialogDataWillBeDeletedP2Admin,
                    overviewMessages.inlineDialogDataWillBeDeletedP2Self,
                  )}
                  tagName="p"
                />
                <FormattedMessage
                  {...this.selectAdminOrSelfCopy(
                    overviewMessages.inlineDialogDataWillBeDeletedP3Admin,
                    overviewMessages.inlineDialogDataWillBeDeletedP3Self,
                  )}
                  tagName="p"
                />
              </Styled.InlineDialogContent>
            }
          >
            <InfoIcon label="" size="small" />
          </StatefulInlineDialog>
        </Styled.IconHoverWrapper>
      </li>
    );
  };

  displayThirdListElement = () => {
    return (
      <li>
        <FormattedMessage
          {...this.selectAdminOrSelfCopy(
            overviewMessages.paragraphListOfAppsWithPersonalDataAdmin,
            overviewMessages.paragraphListOfAppsWithPersonalDataSelf,
          )}
        />
        <Styled.IconHoverWrapper>
          <StatefulInlineDialog
            placement="auto-start"
            content={
              <FormattedMessage
                {...this.selectAdminOrSelfCopy(
                  overviewMessages.inlineDialogDataAppsAdmin,
                  overviewMessages.inlineDialogDataAppsSelf,
                )}
              />
            }
          >
            <InfoIcon label="" size="small" />
          </StatefulInlineDialog>
        </Styled.IconHoverWrapper>
      </li>
    );
  };
  displayFourthListElement = () => {
    return (
      <li>
        <FormattedMessage
          {...this.selectAdminOrSelfCopy(
            overviewMessages.paragraphContentCreatedAdmin,
            overviewMessages.paragraphContentCreatedSelf,
          )}
        />
        <Styled.IconHoverWrapper>
          <StatefulInlineDialog
            placement="auto-start"
            content={
              <FormattedMessage
                {...this.selectAdminOrSelfCopy(
                  overviewMessages.inlineDialogContentCreatedAdmin,
                  overviewMessages.inlineDialogContentCreatedSelf,
                )}
              />
            }
          >
            <InfoIcon label="" size="small" />
          </StatefulInlineDialog>
        </Styled.IconHoverWrapper>
      </li>
    );
  };

  render() {
    const { user, deactivateUserHandler, isUserDeactivated } = this.props;

    return (
      <MessagesIntlProvider>
        <Styled.Screen>
          <Styled.Title>
            <FormattedMessage
              {...this.selectAdminOrSelfCopy(
                overviewMessages.headingAdmin,
                overviewMessages.headingSelf,
              )}
            />
          </Styled.Title>
          <FormattedMessage
            {...this.selectAdminOrSelfCopy(
              overviewMessages.firstLineAdmin,
              overviewMessages.firstLineSelf,
            )}
            tagName="p"
          />
          <UserInfo user={user} />
          <FormattedMessage
            {...this.selectAdminOrSelfCopy(
              overviewMessages.paragraphAboutToDeleteAdmin,
              overviewMessages.paragraphAboutToDeleteSelf,
            )}
          />
          <Styled.MainInformationList>
            {this.displayFirstListElement()}
            {this.displaySecondListElement()}
            {this.displayThirdListElement()}
            {this.displayFourthListElement()}
          </Styled.MainInformationList>
          {deactivateUserHandler && (
            <Styled.SectionMessageOuter>
              <SectionMessage appearance="warning">
                <FormattedMessage
                  {...(isUserDeactivated
                    ? overviewMessages.warningSectionBodyDeactivated
                    : overviewMessages.warningSectionBody)}
                />
                {!isUserDeactivated && (
                  <p>
                    <Button
                      appearance="link"
                      spacing="none"
                      onClick={deactivateUserHandler}
                    >
                      <FormattedMessage {...commonMessages.deactivateAccount} />
                    </Button>
                  </p>
                )}
              </SectionMessage>
            </Styled.SectionMessageOuter>
          )}
        </Styled.Screen>
      </MessagesIntlProvider>
    );
  }
}

export default DeleteUserOverviewScreen;
