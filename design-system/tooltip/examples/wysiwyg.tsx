import React from 'react';
import styled from 'styled-components';

import BoldIcon from '@atlaskit/icon/glyph/editor/bold';
import ItalicIcon from '@atlaskit/icon/glyph/editor/italic';
import UnderlineIcon from '@atlaskit/icon/glyph/editor/underline';
import LinkIcon from '@atlaskit/icon/glyph/editor/link';
import BulletListIcon from '@atlaskit/icon/glyph/editor/bullet-list';
import NumberListIcon from '@atlaskit/icon/glyph/editor/number-list';
import CodeIcon from '@atlaskit/icon/glyph/editor/code';
import { borderRadius, colors } from '@atlaskit/theme';

import Tooltip from '../src';

const Toolbar = styled.div`
  background-color: ${colors.N20};
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
    background-color: ${colors.N40};
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
      {Object.keys(ACTIONS).map(a => (
        <Tooltip key={a} content={a} position="top">
          <Action>{ACTIONS[a]}</Action>
        </Tooltip>
      ))}
    </Toolbar>
  );
}
