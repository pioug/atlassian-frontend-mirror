import styled from 'styled-components';
import { HTMLAttributes, ComponentClass, ImgHTMLAttributes } from 'react';
import { fontSize, gridSize } from '@atlaskit/theme/constants';
import { themed } from '@atlaskit/theme/components';
import { borderRadius } from '@atlaskit/theme/constants';
import { N20, DN50, DN700, B200, N20A, N70 } from '@atlaskit/theme/colors';
import { relativeFontSizeToBase16 } from '@atlaskit/editor-shared-styles';

export const padding = gridSize();
export const BODIED_EXT_PADDING = padding * 2;

export const Wrapper: ComponentClass<HTMLAttributes<{}>> = styled.div`
  background: ${themed({
    light: N20,
    dark: DN50,
  })};
  border-radius: ${borderRadius()}px;
  color: ${themed({
    dark: DN700,
  })};
  position: relative;
  vertical-align: middle;
  font-size: ${relativeFontSizeToBase16(fontSize())};

  .ProseMirror-selectednode > span > & > .extension-overlay {
    box-shadow: inset 0px 0px 0px 2px ${B200};
    opacity: 1;
  }

  &.with-overlay {
    .extension-overlay {
      background: ${N20A};
      color: transparent;
    }

    &:hover .extension-overlay {
      opacity: 1;
    }
  }
`;

export const Overlay: ComponentClass<HTMLAttributes<{}>> = styled.div`
  border-radius: ${borderRadius()}px;
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s;
`;

export const PlaceholderFallback: ComponentClass<HTMLAttributes<{}>> = styled.div`
  display: inline-flex;
  align-items: center;

  & > img {
    margin: 0 4px;
  }
`;

export const PlaceholderFallbackParams: ComponentClass<HTMLAttributes<{}>> = styled.span`
  display: inline-block;
  max-width: 200px;
  margin-left: 5px;
  color: ${N70};
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

export const StyledImage: ComponentClass<ImgHTMLAttributes<{}>> = styled.img`
  max-height: 16px;
  max-width: 16px;
`;
