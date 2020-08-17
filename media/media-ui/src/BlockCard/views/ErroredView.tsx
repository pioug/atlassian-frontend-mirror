/** @jsx jsx */
import { jsx } from '@emotion/core';
import { FormattedMessage } from 'react-intl';
import { MouseEvent, useMemo } from 'react';
import { R300 } from '@atlaskit/theme/colors';
import WarningIcon from '@atlaskit/icon/glyph/warning';

import { Frame } from '../components/Frame';
import { Byline } from '../components/Byline';
import { ActionList } from '../components/ActionList';
import { Content } from '../components/Content';
import { messages } from '../../messages';
import { ContentFooter } from '../components/ContentFooter';
import { ContentHeader } from '../components/ContentHeader';
import { handleClickCommon } from '../utils/handlers';
import { Link } from '../components/Link';
import { UnresolvedText } from '../components/UnresolvedText';
import { ActionProps } from '../components/Action';
import { RetryAction } from '../actions/RetryAction';

const textDescriptionProps = { ...messages.could_not_load_link };

export interface ErroredViewProps {
  /* URL to the link */
  link?: string;
  /* Event handler - on click of the card, to be passed down to clickable components */
  onClick?: React.EventHandler<React.MouseEvent | React.KeyboardEvent>;
  /* If selected, would be true in edit mode */
  isSelected?: boolean;
  /* If there is a way to recover from the current error, this handler is used 
     to trigger a re-resolve */
  onRetry?: () => void;
  message?: string;
  testId?: string;
  inheritDimensions?: boolean;
}

export const ErroredView = ({
  isSelected = false,
  testId = 'block-card-errored-view',
  link = '',
  onClick = () => {},
  onRetry,
  inheritDimensions = false,
}: ErroredViewProps) => {
  const handleClick = (event: MouseEvent<HTMLElement>) =>
    handleClickCommon(event, onClick);

  const actions = useMemo<ActionProps[]>(
    () => (onRetry ? [RetryAction(onRetry)] : []),
    [onRetry],
  );

  return (
    <Frame
      isSelected={isSelected}
      testId={testId}
      isFluidHeight
      inheritDimensions={inheritDimensions}
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
                  label="errored-warning-icon"
                  size="small"
                  primaryColor={R300}
                  testId={`${testId}-warning-icon`}
                />
              }
              text={<FormattedMessage {...textDescriptionProps} />}
            />
          </Byline>
        </div>
        <ContentFooter>
          <ActionList items={actions} />
        </ContentFooter>
      </Content>
    </Frame>
  );
};
