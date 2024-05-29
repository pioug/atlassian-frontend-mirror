/** @jsx jsx */
import { jsx, css } from '@emotion/react';
import { type AvatarClickEventHandler } from '@atlaskit/avatar';
import Lozenge from '@atlaskit/lozenge';
import { type MouseEvent } from 'react';

import { Frame } from '../components/Frame';
import { Thumbnail } from '../components/Thumbnail';
import { Provider } from '../components/Provider';
import { Name } from '../components/Name';
import { Byline } from '../../common/Byline';
import { ActionList } from '../components/ActionList';
import { CollaboratorList, type Collaborator } from '../components/CollaboratorList';
import { Emoji } from '../components/Emoji';
import { Icon, type IconProps } from '../../common/Icon';
import { Content } from '../components/Content';
import { type ActionProps } from '../components/Action';
import { type MetadataProps } from '../../common/Metadata';
import { MetadataList } from '../../common/MetadataList';
import { LozengeBlockWrapper } from './styled';
import { ContentHeader } from '../components/ContentHeader';
import { ContentFooter } from '../components/ContentFooter';
import { type ContextViewModel } from '../../types';
import { gs } from '../../common/utils';
import { handleClickCommon } from '../utils/handlers';
import { type LozengeProps } from '../../../types';

const styles = css({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
});
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
  /* Color of title text */
  titleTextColor?: string;
  /* Collaborators of the link */
  users?: Collaborator[];
  /* Actions which can be taken on the URL */
  actions?: Array<ActionProps>;
  /* Event handler - on avatar item */
  handleAvatarClick?: AvatarClickEventHandler;
  /* Event handler - on avatar dropdown items */
  handleMoreAvatarsClick?: React.MouseEventHandler;
  /* Event handler - on click of the card, to be passed down to clickable components */
  onClick?: React.EventHandler<React.MouseEvent | React.KeyboardEvent>;
  /* If selected, would be true in edit mode */
  isSelected?: boolean;
  testId?: string;
  /* The Emoji prefix component that was added to the title text via Add emoji button */
  titlePrefix?: React.ReactNode;
  /* A flag that determines whether link source can be trusted in iframe */
  isTrusted?: boolean;
  /** It determines whether a link source supports different design theme modes */
  isSupportTheming?: boolean;
}

/**
 * Class name for selecting non-flexible resolved block card
 *
 * @deprecated {@link https://hello.jira.atlassian.cloud/browse/ENGHEALTH-6878 Internal documentation for deprecation (no external access)}
 * Using this selctor is deprecated as once the flexible block card feature flag is removed, this class will no longer be used.
 */
export const blockCardResolvedViewClassName = 'block-card-resolved-view';
/**
 * Class name for selecting non-flexible resolved byline
 *
 * @deprecated {@link https://hello.jira.atlassian.cloud/browse/ENGHEALTH-6878 Internal documentation for deprecation (no external access)}
 * Using this selctor is deprecated as once the flexible block card feature flag is removed, this class will no longer be used.
 */
export const blockCardResolvedViewByClassName = 'block-card-resolved-view-by';

export const ResolvedView = ({
  icon = {},
  actions = [],
  thumbnail,
  context = { text: '' },
  title = '',
  titleTextColor,
  titlePrefix,
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
}: ResolvedViewProps) => {
  const resolvedMetadata =
    details.length > 0 ? (
      <MetadataList
        testId={testId ? `${testId}-meta` : undefined}
        items={details}
      />
    ) : undefined;
  const resolvedByline = (
    <Byline
      testId={testId ? `${testId}-by` : undefined}
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
      className={blockCardResolvedViewByClassName}
    >
      {byline}
    </Byline>
  );

  const handleClick = (event: MouseEvent) => handleClickCommon(event, onClick);

  const hasActions = actions.length > 0;

  return (
    <Frame
      isSelected={isSelected}
      testId={testId}
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
      className={blockCardResolvedViewClassName}
    >
      <Content>
        <div>
          <div css={styles}>
            <ContentHeader onClick={handleClick} link={link}>
              {titlePrefix ? <Emoji emoji={titlePrefix} /> : <Icon {...icon} />}
              <Name name={title} textColor={titleTextColor} />
              {lozenge && (
                <LozengeBlockWrapper
                  css={{
                    height: gs(2.5),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
                  <Lozenge style={lozenge.style} {...lozenge}>
                    {lozenge.text}
                  </Lozenge>
                </LozengeBlockWrapper>
              )}
            </ContentHeader>
            <CollaboratorList
              items={users}
              handleAvatarClick={handleAvatarClick}
              handleMoreAvatarsClick={handleMoreAvatarsClick}
              testId={testId ? `${testId}-collaborator-list` : undefined}
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
