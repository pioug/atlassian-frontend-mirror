/** @jsx jsx */
import { jsx } from '@emotion/react';
import { gs, mq } from '../../common/utils';

export interface ContentProps {
  children: React.ReactNode;
  /* Reduces padding by half to visualize content more compactly */
  isCompact?: boolean;
}

/**
 * Class name for selecting non-flexible block card content
 *
 * @deprecated {@link https://hello.jira.atlassian.cloud/browse/ENGHEALTH-6878 Internal documentation for deprecation (no external access)}
 * Using this selctor is deprecated as once the flexible block card feature flag is removed, this class will no longer be used.
 */
export const blockCardContentClassName = 'block-card-content';

export const Content = ({ children, isCompact = false }: ContentProps) => (
  <div
    css={mq({
      // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage/preview
      padding: isCompact ? gs(1) : gs(2),
      display: 'flex',
      flexDirection: 'column',
      justifyContent: isCompact ? 'unset' : ['unset', 'space-between'],
      flexGrow: 1,
    })}
    data-trello-do-not-use-override="block-card-content"
    className={blockCardContentClassName}
  >
    {children}
  </div>
);
