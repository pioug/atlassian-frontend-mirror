/** @jsx jsx */
import { css, jsx } from '@emotion/react';

import { GroupSelectProps } from './types';

const containerStyles = css({
  padding: '8px',
  border: '1px solid',
  borderRadius: '4px',
});

export default function GroupSelect({ testId, groups }: GroupSelectProps) {
  return (
    <div css={[containerStyles]} data-testid={testId}>
      Not build yet
    </div>
  );
}
