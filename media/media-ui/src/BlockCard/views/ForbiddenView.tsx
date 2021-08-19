/** @jsx jsx */
import { jsx } from '@emotion/core';
import { FormattedMessage } from 'react-intl';
import { MouseEvent } from 'react';
import { R300 } from '@atlaskit/theme/colors';
import LockIcon from '@atlaskit/icon/glyph/lock-filled';

import { Frame } from '../components/Frame';
import { Provider } from '../components/Provider';
import { Byline } from '../components/Byline';
import { ActionList } from '../components/ActionList';
import { Content } from '../components/Content';
import { ActionProps } from '../components/Action';
import { messages } from '../../messages';
import { ContentFooter } from '../components/ContentFooter';
import { IconProps } from '../components/Icon';
import { ContentHeader } from '../components/ContentHeader';
import { handleClickCommon } from '../utils/handlers';
import { Link } from '../components/Link';
import { UnresolvedText } from '../components/UnresolvedText';
import { RequestAccessContextProps } from '../../types';

export interface PermissionDeniedProps {
  /* Actions which can be taken on the URL */
  actions?: Array<ActionProps>;
  /* Details about the provider for the link */
  context?: { icon?: React.ReactNode; text: string };
  /* Icon for the header of the link */
  icon: IconProps;
  /* URL to the link */
  link?: string;
  /* Event handler - on click of the card, to be passed down to clickable components */
  onClick?: React.EventHandler<React.MouseEvent | React.KeyboardEvent>;
  /* If selected, would be true in edit mode */
  isSelected?: boolean;
  testId?: string;
  showActions?: boolean;
  /* Describes additional metadata based on the type of access a user has to the link */
  requestAccessContext?: RequestAccessContextProps;
}

export const blockCardForbiddenViewClassName = 'block-card-forbidden-view';

export const ForbiddenView = ({
  context = { text: '' },
  isSelected = false,
  actions = [],
  testId = 'block-card-forbidden-view',
  showActions = true,
  link = '',
  onClick = () => {},
  requestAccessContext = {},
}: PermissionDeniedProps) => {
  const handleClick = (event: MouseEvent<HTMLElement>) =>
    handleClickCommon(event, onClick);

  const {
    action,
    descriptiveMessageKey = 'invalid_permissions_description',
  } = requestAccessContext;

  const items = action ? [...actions, action] : actions;

  return (
    <Frame
      isSelected={isSelected}
      testId={testId}
      className={blockCardForbiddenViewClassName}
      isFluidHeight
    >
      <Content isCompact>
        <div>
          <ContentHeader onClick={handleClick} link={link}>
            <Link url={link} testId={testId} />
          </ContentHeader>
          <Byline>
            <UnresolvedText
              icon={
                <LockIcon
                  label="forbidden-lock-icon"
                  size="small"
                  primaryColor={R300}
                  testId={`${testId}-lock-icon`}
                />
              }
              text={
                <FormattedMessage
                  {...messages[descriptiveMessageKey]}
                  values={{ context: context.text }}
                />
              }
            />
          </Byline>
        </div>
        <ContentFooter>
          <Provider name={context.text} icon={context.icon} />
          {showActions && <ActionList items={items} />}
        </ContentFooter>
      </Content>
    </Frame>
  );
};
