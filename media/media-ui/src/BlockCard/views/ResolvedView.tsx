/** @jsx jsx */
import { jsx } from '@emotion/core';
import { AvatarClickType } from '@atlaskit/avatar';
import Lozenge from '@atlaskit/lozenge';

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
import { containerCentredStyles } from '../utils/constants';
import { MetadataProps } from '../components/Metadata';
import { MetadataList } from '../components/MetadataList';
import { LozengeProps } from '../../common';
import { LozengeWrapper } from '../../InlineCard/IconAndTitleLayout/styled';

export interface ResolvedViewProps {
  /* Details about the provider for the link */
  context?: { icon?: string; text: string };
  /* URL to the link */
  link: string;
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
  title: string;
  /* Summary - either this or the byline will be rendered, we prefer the byline */
  description?: string;
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
}

export const ResolvedView = ({
  icon = {},
  actions = [],
  thumbnail,
  context = { text: '' },
  title = '',
  isSelected = false,
  description = '',
  users = [],
  handleAvatarClick = () => {},
  handleMoreAvatarsClick = () => {},
  onClick = () => {},
  link,
  byline,
  lozenge,
  details = [],
  testId,
}: ResolvedViewProps) => {
  const resolvedMetadata = details.length && (
    <MetadataList
      testId={testId ? `${testId}-meta` : undefined}
      items={details}
    />
  );
  const resolvedByline = byline ? (
    <Byline testId={testId ? `${testId}-by` : undefined}>{byline}</Byline>
  ) : (
    <Byline testId={testId ? `${testId}-by` : undefined} text={description} />
  );

  return (
    <Frame isSelected={isSelected} testId={testId}>
      <Content>
        <div>
          <div css={containerCentredStyles}>
            <a
              onClick={onClick}
              href={link}
              target="_blank"
              css={{ display: 'flex', alignItems: 'center' }}
            >
              <Icon {...icon} />
              <Name name={title} />
              {lozenge && (
                <LozengeWrapper>
                  <Lozenge {...lozenge}>{lozenge.text}</Lozenge>
                </LozengeWrapper>
              )}
            </a>
            <CollaboratorList
              items={users}
              handleAvatarClick={handleAvatarClick}
              handleMoreAvatarsClick={handleMoreAvatarsClick}
            />
          </div>
          {resolvedMetadata || resolvedByline}
        </div>
        <div css={containerCentredStyles}>
          <Provider name={context.text} iconUrl={context.icon} />
          <ActionList items={actions} />
        </div>
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
