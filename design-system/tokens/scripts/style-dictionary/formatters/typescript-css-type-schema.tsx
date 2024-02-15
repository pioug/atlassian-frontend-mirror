import prettier from 'prettier';
import type { Format, TransformedToken } from 'style-dictionary';

import { createSignedArtifact } from '@atlassian/codegen';

import { getCSSCustomProperty } from '../../../src/utils/token-ids';

function mapToCssVar(tokens: TransformedToken[]) {
  return tokens
    .map((token) => `'var(${getCSSCustomProperty(token.path)})'`)
    .join(' | ');
}

const formatter: Format['formatter'] = ({ dictionary }) => {
  const tokens = dictionary.allTokens.filter((token) => {
    const attributes = token.attributes || {};
    const isToken = attributes.group !== 'palette';
    const isPublicToken =
      attributes.state !== 'experimental' && attributes.state !== 'deleted';

    return isToken && isPublicToken;
  });

  const backgroundColor: TransformedToken[] = [];
  const backgroundColorHovered: TransformedToken[] = [];
  const backgroundColorPressed: TransformedToken[] = [];
  const dimension: TransformedToken[] = [];
  const borderColor: TransformedToken[] = [];
  const borderWidth: TransformedToken[] = [];
  const borderRadius: TransformedToken[] = [];
  const space: TransformedToken[] = [];
  const shadow: TransformedToken[] = [];
  const textColor: TransformedToken[] = [];
  const opacity: TransformedToken[] = [];

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    if (
      token.attributes?.group === 'palette' ||
      token.attributes?.state === 'experimental' ||
      token.attributes?.state === 'deleted'
    ) {
      // Skip palette / experiemental / deleted tokens.
      continue;
    }

    if (token.path.includes('background') || token.path.includes('surface')) {
      if (token.path.includes('hovered')) {
        backgroundColorHovered.push(token);
      } else if (token.path.includes('pressed')) {
        backgroundColorPressed.push(token);
      } else {
        backgroundColor.push(token);
      }
    }

    if (token.path.includes('size') || token.path.includes('100%')) {
      dimension.push(token);
    }

    if (token.path.includes('color') && token.path.includes('border')) {
      borderColor.push(token);
    }

    if (token.path.includes('border') && token.path.includes('width')) {
      borderWidth.push(token);
    }

    if (token.path.includes('border') && token.path.includes('radius')) {
      borderRadius.push(token);
    }

    if (token.path.includes('space')) {
      space.push(token);
    }

    if (token.path.includes('shadow')) {
      shadow.push(token);
    }

    if (token.path.includes('text') || token.path.includes('link')) {
      textColor.push(token);
    }

    if (token.path.includes('opacity')) {
      opacity.push(token);
    }
  }

  const source = prettier.format(
    `export type BackgroundColor = ${mapToCssVar(backgroundColor)};

export type BackgroundColorHovered = ${mapToCssVar(backgroundColorHovered)};

export type BackgroundColorPressed = ${mapToCssVar(backgroundColorPressed)};

export type Dimension = ${mapToCssVar(dimension)};

export type BorderColor = ${mapToCssVar(borderColor)};

export type BorderWidth = ${mapToCssVar(borderWidth)};

export type BorderRadius = ${mapToCssVar(borderRadius)};

export type Space = ${mapToCssVar(space)};

export type Shadow = ${mapToCssVar(shadow)};

export type TextColor = ${mapToCssVar(textColor)};

export type Opacity = ${mapToCssVar(opacity)};

export interface TokenizedProps {
  backgroundColor: BackgroundColor;
  blockSize: Dimension;
  borderBlockColor: BorderColor;
  borderBlockEndColor: BorderColor;
  borderBlockEndWidth: BorderWidth;
  borderBlockStartColor: BorderColor;
  borderBlockStartWidth: BorderWidth;
  borderBlockWidth: BorderWidth;
  borderBottomColor: BorderColor;
  borderBottomLeftRadius: BorderRadius;
  borderBottomRightRadius: BorderRadius;
  borderBottomWidth: BorderWidth;
  borderColor: BorderColor;
  borderEndEndRadius: BorderRadius;
  borderEndStartRadius: BorderRadius;
  borderInlineColor: BorderColor;
  borderInlineEndColor: BorderColor;
  borderInlineEndWidth: BorderWidth;
  borderInlineStartColor: BorderColor;
  borderInlineStartWidth: BorderWidth;
  borderInlineWidth: BorderWidth;
  borderLeftColor: BorderColor;
  borderLeftWidth: BorderWidth;
  borderRadius: BorderRadius;
  borderRightColor: BorderColor;
  borderRightWidth: BorderWidth;
  borderStartEndRadius: BorderRadius;
  borderStartStartRadius: BorderRadius;
  borderTopColor: BorderColor;
  borderTopLeftRadius: BorderRadius;
  borderTopRightRadius: BorderRadius;
  borderTopWidth: BorderWidth;
  borderWidth: BorderWidth;
  bottom: Space;
  boxShadow: Shadow;
  color: TextColor;
  columnGap: Space;
  gap: Space;
  height: Dimension;
  inlineSize: Dimension;
  inset: Space;
  insetBlock: Space;
  insetBlockEnd: Space;
  insetBlockStart: Space;
  insetInline: Space;
  insetInlineEnd: Space;
  insetInlineStart: Space;
  left: Space;
  margin: Space;
  marginBlock: Space;
  marginBlockEnd: Space;
  marginBlockStart: Space;
  marginBottom: Space;
  marginInline: Space;
  marginInlineEnd: Space;
  marginInlineStart: Space;
  marginLeft: Space;
  marginRight: Space;
  marginTop: Space;
  maxBlockSize: Dimension;
  maxHeight: Dimension;
  maxInlineSize: Dimension;
  maxWidth: Dimension;
  minBlockSize: Dimension;
  minHeight: Dimension;
  minInlineSize: Dimension;
  minWidth: Dimension;
  opacity: Opacity;
  outlineColor: BorderColor;
  outlineOffset: Space;
  outlineWidth: BorderWidth;
  padding: Space;
  paddingBlock: Space;
  paddingBlockEnd: Space;
  paddingBlockStart: Space;
  paddingBottom: Space;
  paddingInline: Space;
  paddingInlineEnd: Space;
  paddingInlineStart: Space;
  paddingLeft: Space;
  paddingRight: Space;
  paddingTop: Space;
  right: Space;
  rowGap: Space;
  top: Space;
  width: Dimension;
  zIndex: number;
};

export interface TokenizedPropsWithHovered extends Omit<TokenizedProps, 'backgroundColor'> {
  backgroundColor: BackgroundColorHovered;
}

export interface TokenizedPropsWithPressed extends Omit<TokenizedProps, 'backgroundColor'> {
  backgroundColor: BackgroundColorPressed;
}

export interface DesignTokenStyles extends TokenizedProps {
  '&::after': TokenizedProps;
  '&::before': TokenizedProps;
  '&:active': TokenizedPropsWithPressed;
  '&:any-link': TokenizedProps;
  '&:autofill': TokenizedProps;
  '&:blank': TokenizedProps;
  '&:checked': TokenizedProps;
  '&:default': TokenizedProps;
  '&:disabled': TokenizedProps;
  '&:enabled': TokenizedProps;
  '&:focus-visible': TokenizedProps;
  '&:focus-within': TokenizedProps;
  '&:focus': TokenizedProps;
  '&:hover': TokenizedPropsWithHovered;
  '&:in-range': TokenizedProps;
  '&:indeterminate': TokenizedProps;
  '&:invalid': TokenizedProps;
  '&:link': TokenizedProps;
  '&:local-link': TokenizedProps;
  '&:optional': TokenizedProps;
  '&:out-of-range': TokenizedProps;
  '&:placeholder-shown': TokenizedProps;
  '&:read-only': TokenizedProps;
  '&:read-write': TokenizedProps;
  '&:required': TokenizedProps;
  '&:user-invalid': TokenizedProps;
  '&:user-valid': TokenizedProps;
  '&:valid': TokenizedProps;
  '&:visited': TokenizedProps;
}\n`,
    { parser: 'typescript', singleQuote: true },
  );

  return createSignedArtifact(
    source,
    `yarn build tokens`,
    `Strict design token based typedef representing a subset of safe CSS properties.`,
  );
};

export default formatter;
