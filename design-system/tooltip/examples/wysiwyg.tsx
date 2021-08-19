import React from 'react';

import styled from '@emotion/styled';

import BoldIcon from '@atlaskit/icon/glyph/editor/bold';
import BulletListIcon from '@atlaskit/icon/glyph/editor/bullet-list';
import CodeIcon from '@atlaskit/icon/glyph/editor/code';
import ItalicIcon from '@atlaskit/icon/glyph/editor/italic';
import LinkIcon from '@atlaskit/icon/glyph/editor/link';
import NumberListIcon from '@atlaskit/icon/glyph/editor/number-list';
import UnderlineIcon from '@atlaskit/icon/glyph/editor/underline';
import { N20, N40 } from '@atlaskit/theme/colors';
import { borderRadius } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';

import Tooltip from '../src';

const Toolbar = styled.div`
  background-color: ${token('color.background.subtleNeutral.resting', N20)};
  border-radius: ${borderRadius}px;
  display: flex;
  padding: 5px;
`;
const Action = styled.div`
  align-items: center;
  border-radius: 3px;
  display: flex;
  height: 24px;
  justify-content: center;
  margin-right: 3px;
  width: 36px;

  &:hover {
    background-color: ${token('color.background.subtleNeutral.hover', N40)};
  }
`;

const ACTIONS: { [key: string]: React.ReactElement } = {
  Bold: <BoldIcon label="Bold" />,
  Italic: <ItalicIcon label="Italic" />,
  Underline: <UnderlineIcon label="Underline" />,
  Link: <LinkIcon label="Link" />,
  'Bullet List': <BulletListIcon label="Bullet List" />,
  'Number List': <NumberListIcon label="Number List" />,
  Source: <CodeIcon label="Source" />,
};

export default function WysiwygExample() {
  return (
    <Toolbar>
      {Object.keys(ACTIONS).map((a) => (
        <Tooltip key={a} content={a} position="top">
          <Action>{ACTIONS[a]}</Action>
        </Tooltip>
      ))}
    </Toolbar>
  );
}
