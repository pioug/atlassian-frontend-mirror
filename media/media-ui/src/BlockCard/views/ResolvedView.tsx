/** @jsx jsx */
import { jsx } from '@emotion/core';
import { AvatarClickType } from '@atlaskit/avatar';
import Lozenge from '@atlaskit/lozenge';
import { MouseEvent } from 'react';

import { Frame } from '../components/Frame';
import { Thumbnail } from '../components/Thumbnail';
import { Provider } from '../components/Provider';
import { Name } from '../components/Name';
import { Byline } from '../components/Byline';
import { ActionList } from '../components/ActionList';
import { CollaboratorList, Collaborator } from '../components/CollaboratorList';
import { Icon, IconProps } from '../components/Icon';
import { Content } from '../components/Content';
import { ActionProps } from '../components/Action';
import { MetadataProps } from '../components/Metadata';
import { MetadataList } from '../components/MetadataList';
import { LozengeProps } from '../../common';
import { LozengeBlockWrapper } from '../../InlineCard/IconAndTitleLayout/styled';
import { ContentHeader } from '../components/ContentHeader';
import { ContentFooter } from '../components/ContentFooter';
import { ContextViewModel } from '../../types';
import { gs } from '../utils';
import { handleClickCommon } from '../utils/handlers';

export interface ResolvedViewProps {
  /* Details about the provider for the link */
  context?: ContextViewModel;
  /* URL to the link */
  link?: string;
  /* Icon for the header of the link */
  icon: IconProps;
  /* Metadata items for the link */
  details?: Array<MetadataProps>;
  /* Summary, description, or details about the resource */
  byline?: React.ReactNode;
  /* Summary, description, or details about the resource */
  lozenge?: LozengeProps;
  /* Image for the link */
  thumbnail?: string;
  /* Name or title */
  title?: string;
  /* Collaborators of the link */
  users?: Collaborator[];
  /* Actions which can be taken on the URL */
  actions?: Array<ActionProps>;
  /* Event handler - on avatar item */
  handleAvatarClick?: AvatarClickType;
  /* Event handler - on avatar dropdown items */
  handleMoreAvatarsClick?: React.MouseEventHandler;
  /* Event handler - on click of the card, to be passed down to clickable components */
  onClick?: React.EventHandler<React.MouseEvent | React.KeyboardEvent>;
  /* If selected, would be true in edit mode */
  isSelected?: boolean;
  testId?: string;
  showActions?: boolean;
}

export const ResolvedView = ({
  icon = {},
  actions = [],
  thumbnail,
  context = { text: '' },
  title = '',
  isSelected = false,
  users = [],
  handleAvatarClick = () => {},
  handleMoreAvatarsClick = () => {},
  onClick = () => {},
  link = '',
  byline = '',
  lozenge,
  details = [],
  testId = 'block-card-resolved-view',
  showActions = true,
}: ResolvedViewProps) => {
  const resolvedMetadata =
    details.length > 0 ? (
      <MetadataList
        testId={testId ? `${testId}-meta` : undefined}
        items={details}
      />
    ) : (
      undefined
    );
  const resolvedByline = (
    <Byline testId={testId ? `${testId}-by` : undefined}>{byline}</Byline>
  );

  const handleClick = (event: MouseEvent) => handleClickCommon(event, onClick);

  const hasActions = showActions && actions.length > 0;

  return (
    <Frame isSelected={isSelected} testId={testId}>
      <Content>
        <div>
          <div
            css={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
            }}
          >
            <ContentHeader onClick={handleClick} link={link}>
              <Icon {...icon} />
              <Name name={title} />
              {lozenge && (
                <LozengeBlockWrapper
                  css={{
                    height: gs(2.5),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Lozenge {...lozenge}>{lozenge.text}</Lozenge>
                </LozengeBlockWrapper>
              )}
            </ContentHeader>
            <CollaboratorList
              items={users}
              handleAvatarClick={handleAvatarClick}
              handleMoreAvatarsClick={handleMoreAvatarsClick}
            />
          </div>
          {resolvedByline}
          {resolvedMetadata}
        </div>
        <ContentFooter hasSpaceBetween={hasActions}>
          <Provider name={context.text} icon={context.icon} />
          {hasActions && <ActionList items={actions} />}
        </ContentFooter>
      </Content>
      {thumbnail ? (
        <Thumbnail
          src={thumbnail}
          testId={testId ? `${testId}-thumb` : undefined}
        />
      ) : null}
    </Frame>
  );
};
