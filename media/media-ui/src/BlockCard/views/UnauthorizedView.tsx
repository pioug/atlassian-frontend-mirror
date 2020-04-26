/** @jsx jsx */
import { jsx } from '@emotion/core';
import { B50 } from '@atlaskit/theme/colors';
import { FormattedMessage } from 'react-intl';

import { Frame } from '../components/Frame';
import { Thumbnail } from '../components/Thumbnail';
import { Provider } from '../components/Provider';
import { Name } from '../components/Name';
import { Byline } from '../components/Byline';
import { ActionList } from '../components/ActionList';
import { Content } from '../components/Content';
import { ActionProps } from '../components/Action';
import { messages } from '../../messages';
import { CelebrationImage } from '../utils/constants';
import { ContentFooter } from '../components/ContentFooter';
import { IconProps, Icon } from '../components/Icon';

const textNameProps = { ...messages.connect_link_account_card_name };
const textBylineProps = { ...messages.connect_link_account_card_description };

export interface UnauthorizedViewProps {
  actions: ActionProps[];
  context?: { icon?: React.ReactNode; text: string };
  isSelected?: boolean;
  testId?: string;
  showActions?: boolean;
  icon: IconProps;
  link?: string;
  onClick?: React.EventHandler<React.MouseEvent | React.KeyboardEvent>;
}

export const UnauthorizedView = ({
  context = { text: '' },
  isSelected = false,
  actions = [],
  testId,
  showActions = true,
  icon = {},
  link = '',
  onClick = () => {},
}: UnauthorizedViewProps) => {
  return (
    <Frame isSelected={isSelected} testId={testId}>
      <Content>
        <div>
          <a
            onClick={onClick}
            href={link}
            target="_blank"
            css={{ display: 'flex', alignItems: 'flex-start' }}
          >
            <Icon {...icon} />
            <Name
              testId={testId ? `${testId}-name` : undefined}
              name={
                <FormattedMessage
                  {...textNameProps}
                  values={{ context: context.text }}
                />
              }
            />
          </a>
          <Byline
            testId={testId ? `${testId}-byline` : undefined}
            text={
              <FormattedMessage
                {...textBylineProps}
                values={{ context: context.text }}
              />
            }
          />
        </div>
        <ContentFooter>
          <Provider name={context.text} icon={context.icon} />
          {showActions && <ActionList items={actions} />}
        </ContentFooter>
      </Content>
      <Thumbnail
        src={CelebrationImage}
        color={B50}
        testId={testId ? `${testId}-thumb` : undefined}
      />
    </Frame>
  );
};
