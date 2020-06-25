/** @jsx jsx */
import { jsx } from '@emotion/core';
import { FormattedMessage } from 'react-intl';
import { R50 } from '@atlaskit/theme/colors';
import { MouseEvent } from 'react';

import { Frame } from '../components/Frame';
import { Thumbnail } from '../components/Thumbnail';
import { Provider } from '../components/Provider';
import { Name } from '../components/Name';
import { Byline } from '../components/Byline';
import { ActionList } from '../components/ActionList';
import { Content } from '../components/Content';
import { ActionProps } from '../components/Action';
import { LockImage } from '../utils/constants';
import { messages } from '../../messages';
import { ContentFooter } from '../components/ContentFooter';
import { IconProps, Icon } from '../components/Icon';
import { ContentHeader } from '../components/ContentHeader';
import { handleClickCommon } from '../utils/handlers';

const textTitleProps = { ...messages.invalid_permissions };
const textDescriptionProps = { ...messages.invalid_permissions_description };

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
}

export const ForbiddenView = ({
  context = { text: '' },
  isSelected = false,
  actions = [],
  testId = 'block-card-forbidden-view',
  showActions = true,
  link = '',
  onClick = () => {},
  icon,
}: PermissionDeniedProps) => {
  const handleClick = (event: MouseEvent<HTMLElement>) =>
    handleClickCommon(event, onClick);

  return (
    <Frame isSelected={isSelected} testId={testId}>
      <Content>
        <div>
          <ContentHeader onClick={handleClick} link={link}>
            <Icon {...icon} />
            <Name
              name={<FormattedMessage {...textTitleProps} />}
              testId={testId ? `${testId}-name` : undefined}
            />
          </ContentHeader>
          <Byline text={<FormattedMessage {...textDescriptionProps} />} />
        </div>
        <ContentFooter>
          <Provider name={context.text} icon={context.icon} />
          {showActions && <ActionList items={actions} />}
        </ContentFooter>
      </Content>
      <Thumbnail
        testId={testId ? `${testId}-thumb` : undefined}
        src={LockImage}
        color={R50}
      />
    </Frame>
  );
};
