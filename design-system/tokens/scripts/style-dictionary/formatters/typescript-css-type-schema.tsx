import type { Format, TransformedToken } from 'style-dictionary';

import format from '@af/formatting/sync';
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
  const borderColor: TransformedToken[] = [];
  const borderWidth: TransformedToken[] = [];
  const borderRadius: TransformedToken[] = [];
  const space: TransformedToken[] = [];
  const shadow: TransformedToken[] = [];
  const textColor: TransformedToken[] = [];
  const textColorPressed: TransformedToken[] = [];
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

    if (
      token.path.includes('background') ||
      token.path.includes('surface') ||
      token.path.includes('skeleton')
    ) {
      if (token.path.includes('hovered')) {
        backgroundColorHovered.push(token);
      } else if (token.path.includes('pressed')) {
        backgroundColorPressed.push(token);
      } else {
        backgroundColor.push(token);
      }
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
      if (token.path.includes('pressed')) {
        textColorPressed.push(token);
      } else {
        textColor.push(token);
      }
    }

    if (token.path.includes('opacity')) {
      opacity.push(token);
    }
  }

  const source = format(
    `export type BackgroundColor = ${mapToCssVar(backgroundColor)};

export type BackgroundColorHovered = ${mapToCssVar(backgroundColorHovered)};

export type BackgroundColorPressed = ${mapToCssVar(backgroundColorPressed)};

export type BorderColor = ${mapToCssVar(borderColor)};

export type BorderWidth = ${mapToCssVar(borderWidth)};

export type BorderRadius = ${mapToCssVar(borderRadius)};

export type SizeIntrinsic = \`\${number}px\` | \`\${number}rem\` | '100%';

export type Space = ${mapToCssVar(space)};

export type SpaceMargin = Space | 'auto' | '0 auto' | '0';

export type Shadow = ${mapToCssVar(shadow)};

export type TextColor = ${mapToCssVar(textColor)};

export type TextColorPressed = ${mapToCssVar(textColorPressed)};

export type Opacity = ${mapToCssVar(opacity)};

export interface CSSPropertiesHovered {
  backgroundColor: BackgroundColorHovered;
}

export interface CSSPropertiesActive {
  backgroundColor: BackgroundColorPressed;
  color: TextColorPressed;
}

export interface DesignTokenStyles {
  '&:active': CSSPropertiesActive;
  '&:hover': CSSPropertiesHovered;
  appearance: 'none' | 'auto';
  backgroundColor: BackgroundColor;
  blockSize: SizeIntrinsic;
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
  boxSizing: 'border-box';
  clear: never;
  clip: never;
  color: TextColor;
  columnGap: Space;
  container: never;
  containerName: never;
  containerType: never;
  float: never;
  font: never;
  fontFamily: never;
  fontSize: never;
  fontSizeAdjust: never;
  fontWeight: never;
  gap: Space;
  height: SizeIntrinsic;
  inlineSize: SizeIntrinsic;
  inset: Space;
  insetBlock: Space;
  insetBlockEnd: Space;
  insetBlockStart: Space;
  insetInline: Space;
  insetInlineEnd: Space;
  insetInlineStart: Space;
  left: Space;
  letterSpacing: never;
  lineHeight: never;
  lineHeightStep: never;
  margin: SpaceMargin;
  marginBlock: SpaceMargin;
  marginBlockEnd: SpaceMargin;
  marginBlockStart: SpaceMargin;
  marginBottom: SpaceMargin;
  marginInline: SpaceMargin;
  marginInlineEnd: SpaceMargin;
  marginInlineStart: SpaceMargin;
  marginLeft: SpaceMargin;
  marginRight: SpaceMargin;
  marginTop: SpaceMargin;
  maxBlockSize: SizeIntrinsic;
  maxHeight: SizeIntrinsic;
  maxInlineSize: SizeIntrinsic;
  maxWidth: SizeIntrinsic;
  minBlockSize: SizeIntrinsic;
  minHeight: SizeIntrinsic;
  minInlineSize: SizeIntrinsic;
  minWidth: SizeIntrinsic;
  opacity: Opacity;
  outlineColor: BorderColor;
  outlineOffset: Space;
  outlineWidth: BorderWidth;
  overlay: never;
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
  userModify: never;
  width: SizeIntrinsic;
  zIndex: 100 | 200 | 300 | 400 | 500 | 510 | 600 | 700 | 800;
}\n`,
  'typescript'
  );

  return createSignedArtifact(
    source,
    `yarn build tokens`,
    `Strict design token based typedef representing a subset of safe CSS properties.`,
  );
};

export default formatter;
