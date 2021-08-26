/** @jsx jsx */
import { jsx } from '@emotion/core';

import { HORIZONTAL_GLOBAL_NAV_HEIGHT } from '@atlaskit/atlassian-navigation';
import { N40 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import GlobalNav from './global-nav';

interface AppFrameProps {
  children: React.ReactNode;
  content?: React.ReactNode;
  hideAppBar?: boolean;
  hideBorder?: boolean;
}

const AppFrame = ({
  children,
  hideAppBar,
  hideBorder,
  content,
}: AppFrameProps) => {
  return (
    <div
      onClick={(e) => e.preventDefault()}
      css={{
        height: '100%',
        minHeight: 600,
      }}
    >
      {hideAppBar || (
        <div css={{ zIndex: 10, position: 'relative' }}>
          <GlobalNav />
        </div>
      )}
      <div
        css={{
          height: hideAppBar
            ? '100%'
            : `calc(100% - ${HORIZONTAL_GLOBAL_NAV_HEIGHT}px)`,
          minHeight: 600,
          display: 'flex',
        }}
      >
        <div
          css={{
            minHeight: 600,
            borderRight: hideBorder
              ? undefined
              : `1px solid ${token('color.border.neutral', N40)}`,
          }}
        >
          {children}
        </div>

        {content}
      </div>
    </div>
  );
};

export default AppFrame;
