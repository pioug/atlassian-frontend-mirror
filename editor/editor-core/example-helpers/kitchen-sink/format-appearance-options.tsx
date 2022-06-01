/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { relativeFontSizeToBase16 } from '@atlaskit/editor-shared-styles';

const optionStyle = css`
  display: flex;
  flex-direction: column;
`;

const description = css`
  font-size: ${relativeFontSizeToBase16(12)};
  font-style: italic;
`;

export const formatAppearanceOption = (
  option: { label: string; description?: string },
  { context }: { context: string },
) => {
  if (context === 'menu') {
    return (
      <div css={optionStyle}>
        <div>{option.label}</div>
        {option.description && (
          <div css={description}>{option.description}</div>
        )}
      </div>
    );
  }

  return option.label;
};
