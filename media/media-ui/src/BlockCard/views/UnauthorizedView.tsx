/** @jsx jsx */
import { jsx } from '@emotion/core';
import { B50 } from '@atlaskit/theme/colors';

import { Frame } from '../components/Frame';
import { Thumbnail } from '../components/Thumbnail';
import { Provider } from '../components/Provider';
import { Name } from '../components/Name';
import { Byline } from '../components/Byline';
import { ActionList } from '../components/ActionList';
import { Content } from '../components/Content';
import { ActionProps } from '../components/Action';
import { containerCentredStyles, CelebrationImage } from '../utils/constants';

export interface UnauthorizedViewProps {
  actions: ActionProps[];
  context?: { icon?: string; text: string };
  isSelected?: boolean;
  testId?: string;
}

export const UnauthorizedView = ({
  context = { text: '' },
  isSelected = false,
  actions = [],
  testId,
}: UnauthorizedViewProps) => {
  return (
    <Frame isSelected={isSelected} testId={testId}>
      <Content>
        <div>
          <Name
            testId={testId ? `${testId}-name` : undefined}
            name="Get more out of your links"
            isLeftPadded={false}
          />
          <Byline
            testId={testId ? `${testId}-byline` : undefined}
            text={`Make these link previews more breathtaking by connecting ${context.text} to your Atlassian products.`}
          />
        </div>
        <div css={containerCentredStyles}>
          <Provider name={context.text} iconUrl={context.icon} />
          <ActionList items={actions} />
        </div>
      </Content>
      <Thumbnail
        src={CelebrationImage}
        color={B50}
        testId={testId ? `${testId}-thumb` : undefined}
      />
    </Frame>
  );
};
