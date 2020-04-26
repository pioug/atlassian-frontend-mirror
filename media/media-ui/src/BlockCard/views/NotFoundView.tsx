/** @jsx jsx */
import { jsx } from '@emotion/core';
import { FormattedMessage } from 'react-intl';
import { R50 } from '@atlaskit/theme/colors';

import { Frame } from '../components/Frame';
import { Thumbnail } from '../components/Thumbnail';
import { Provider } from '../components/Provider';
import { Name } from '../components/Name';
import { Byline } from '../components/Byline';
import { Content } from '../components/Content';
import { NotFoundImage } from '../utils/constants';
import { messages } from '../../messages';
import { ContentFooter } from '../components/ContentFooter';
import { IconProps, Icon } from '../components/Icon';

const textTitleProps = { ...messages.not_found_title };
const textDescriptionProps = { ...messages.not_found_description };

export interface NotFoundProps {
  /* Details about the provider for the link */
  context?: { icon?: React.ReactNode; text: string };
  /* URL to the link */
  link?: string;
  /* Event handler - on click of the card, to be passed down to clickable components */
  onClick?: React.EventHandler<React.MouseEvent | React.KeyboardEvent>;
  /* If selected, would be true in edit mode */
  isSelected?: boolean;
  /* Icon for the header of the link */
  icon: IconProps;
  /* Used for testing */
  testId?: string;
}

export const NotFoundView = ({
  context = { text: '' },
  isSelected = false,
  testId,
  icon,
  link = '',
  onClick = () => {},
}: NotFoundProps) => {
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
              name={<FormattedMessage {...textTitleProps} />}
              testId={testId ? `${testId}-name` : undefined}
            />
          </a>
          <Byline text={<FormattedMessage {...textDescriptionProps} />} />
        </div>
        <ContentFooter>
          <Provider name={context.text} icon={context.icon} />
        </ContentFooter>
      </Content>
      <Thumbnail
        testId={testId ? `${testId}-thumb` : undefined}
        src={NotFoundImage}
        color={R50}
      />
    </Frame>
  );
};
