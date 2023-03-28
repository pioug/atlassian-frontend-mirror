/** @jsx jsx */
import { useState } from 'react';

import { css, jsx } from '@emotion/react';

import { Label } from '@atlaskit/form';
import Toggle from '@atlaskit/toggle';
import { token } from '@atlaskit/tokens';

import Heading from '../../src';

const stackStyles = css({
  display: 'flex',
  rowGap: token('space.100', '8px'),
  flexDirection: 'column',
});

const toggleContainerStyles = css({
  padding: token('space.100', '8px'),
  alignItems: 'center',
});

const headingContainerStyles = css({
  padding: token('space.100', '8px'),
  backgroundColor: token('color.background.neutral.bold', '#42526E'),
});

export default () => {
  const [isInverse, setIsInverse] = useState(true);
  const color = isInverse ? 'inverse' : undefined;

  return (
    <div css={stackStyles}>
      <div css={toggleContainerStyles}>
        <Label htmlFor="colorToggle">Is inverse</Label>
        <Toggle
          id="colorToggle"
          onChange={() => setIsInverse(!isInverse)}
          isChecked={isInverse}
        />
      </div>
      <div css={headingContainerStyles}>
        <Heading color={color} level="h900">
          H900
        </Heading>
      </div>
    </div>
  );
};
