import { css } from '@emotion/react';
import { N50A } from '@atlaskit/theme/colors';

export interface MutableCardContainerProps {
  mutable: boolean;
}

export const filmstripContainerStyles = css`
  border: 1px dotted ${N50A};
  margin-top: 10px;
  margin-bottom: 10px;
`;

export const filmstripWrapperStyles = css`
  border: 1px solid #ccc;
  width: 800px;
  margin-bottom: 20px;
`;

// 0-editable styles
export const storyWrapperStyles = css`
  padding: 1em;
`;

export const separatorStyles = css`
  margin: 1em 0;
  border: 1px solid #ccc;
`;

export const controlLabelStyles = css`
  display: block;
  margin-top: 1em;
  font-weight: bold;
`;

export const flexStyles = css`
  display: flex;
  align-items: center;
  justify-content: center;
`;

type BoxProps = {
  grow?: number;
};

export const editableBoxStyles = ({ grow }: BoxProps) => css`
  padding: 4px;
  ${grow ? `flex-grow: ${grow};` : ''}
`;

// 3-pure-component styles
export const pureComponentBoxStyles = css`
  width: 250px;
  height: 100px;
  background-color: lightgreen;
`;
