/** @jsx jsx */
import { jsx } from '@emotion/react';
import { FormattedMessage } from 'react-intl-next';
import { type MouseEvent } from 'react';

import { Frame } from '../components/Frame';
import { Provider } from '../components/Provider';
import { Byline } from '../../common/Byline';
import { ActionList } from '../components/ActionList';
import { Content } from '../components/Content';
import { type ActionProps } from '../components/Action';
import { messages } from '../../../messages';
import { ContentHeader } from '../components/ContentHeader';
import { ContentFooter } from '../components/ContentFooter';
import { type IconProps } from '../../common/Icon';
import { handleClickCommon } from '../utils/handlers';
import { Link } from '../components/Link';
import type { CardActionOptions } from '../../Card/types';

const textBylineProps = { ...messages.connect_link_account_card_description };

export interface UnauthorizedViewProps {
  actions: ActionProps[];
  context?: { icon?: React.ReactNode; text: string };
  isSelected?: boolean;
  testId?: string;
  actionOptions?: CardActionOptions;
  icon: IconProps;
  link?: string;
  onClick?: React.EventHandler<React.MouseEvent | React.KeyboardEvent>;
}

export const UnauthorizedView = ({
  context = { text: '' },
  isSelected = false,
  actions = [],
  testId = 'block-card-unauthorized-view',
  actionOptions,
  link = '',
  onClick = () => {},
}: UnauthorizedViewProps) => {
  const handleClick = (event: MouseEvent<HTMLElement>) =>
    handleClickCommon(event, onClick);

  return (
    <Frame isSelected={isSelected} testId={testId} isFluidHeight>
      <Content isCompact>
        <div>
          <ContentHeader onClick={handleClick} link={link}>
            <Link url={link} testId={testId} />
          </ContentHeader>
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
          {!actionOptions?.hide && <ActionList items={actions} />}
        </ContentFooter>
      </Content>
    </Frame>
  );
};
