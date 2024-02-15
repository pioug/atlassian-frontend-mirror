/** @jsx jsx */
import { jsx } from '@emotion/react';
import React from 'react';
import { FormattedMessage } from 'react-intl-next';
import { MouseEvent } from 'react';
import { R300 } from '@atlaskit/theme/colors';
import WarningIcon from '@atlaskit/icon/glyph/warning';

import { Frame } from '../components/Frame';
import { Provider } from '../components/Provider';
import { Byline } from '../../common/Byline';
import { Content } from '../components/Content';
import { messages } from '../../../messages';
import { ContentFooter } from '../components/ContentFooter';
import { IconProps } from '../../common/Icon';
import { ContentHeader } from '../components/ContentHeader';
import { Link } from '../components/Link';
import { UnresolvedText } from '../components/UnresolvedText';
import { handleClickCommon } from '../utils/handlers';
import { token } from '@atlaskit/tokens';

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

/**
 * Class name for selecting non-flexible not-found block card
 *
 * @deprecated {@link https://hello.jira.atlassian.cloud/browse/ENGHEALTH-6878 Internal documentation for deprecation (no external access)}
 * Using this selctor is deprecated as once the flexible block card feature flag is removed, this class will no longer be used.
 */
export const blockCardNotFoundViewClassName = 'block-card-not-found-view';

export const NotFoundView = ({
  context = { text: '' },
  isSelected = false,
  testId = 'block-card-not-found-view',
  link = '',
  onClick = () => {},
}: NotFoundProps) => {
  const handleClick = (event: MouseEvent) => handleClickCommon(event, onClick);
  return (
    <Frame
      isSelected={isSelected}
      testId={testId}
      className={blockCardNotFoundViewClassName}
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
                <WarningIcon
                  label="not-found-warning-icon"
                  size="small"
                  primaryColor={token('color.icon.warning', R300)}
                  testId={`${testId}-warning-icon`}
                />
              }
              text={<FormattedMessage {...textDescriptionProps} />}
            />
          </Byline>
        </div>
        <ContentFooter>
          <Provider name={context.text} icon={context.icon} />
        </ContentFooter>
      </Content>
    </Frame>
  );
};
