/** @jsx jsx */
import { jsx } from '@emotion/core';
import { R50 } from '@atlaskit/theme/colors';

import { Frame } from '../components/Frame';
import { Thumbnail } from '../components/Thumbnail';
import { Provider } from '../components/Provider';
import { Name } from '../components/Name';
import { Byline } from '../components/Byline';
import { ActionList } from '../components/ActionList';
import { Content } from '../components/Content';
import { ActionProps } from '../components/Action';
import { LockImage } from '../utils/constants';

export interface PermissionDeniedProps {
  /* Actions which can be taken on the URL */
  actions?: Array<ActionProps>;
  /* Details about the provider for the link */
  context?: { icon?: string; text: string };
  /* Summary, description, or details about the resource */
  byline?: { text?: string };
  /* If selected, would be true in edit mode */
  isSelected?: boolean;
  testId?: string;
}

const containerStyles = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
} as const;

export const ForbiddenView = ({
  context = { text: '' },
  byline,
  isSelected = false,
  actions = [],
  testId,
}: PermissionDeniedProps) => {
  return (
    <Frame isSelected={isSelected} testId={testId}>
      <Content>
        <div>
          <Name
            name="You don't have access to this link"
            isLeftPadded={false}
            testId={testId ? `${testId}-name` : undefined}
          />
          <Byline {...byline} />
        </div>
        <div css={containerStyles}>
          <Provider name={context.text} iconUrl={context.icon} />
          <ActionList items={actions} />
        </div>
      </Content>
      <Thumbnail
        testId={testId ? `${testId}-thumb` : undefined}
        src={LockImage}
        color={R50}
      />
    </Frame>
  );
};
