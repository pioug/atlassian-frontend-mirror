/** @jsx jsx */
import type { CSSProperties } from 'react';

import { jsx } from '@emotion/react';

import EditorFileIcon from '@atlaskit/icon/glyph/editor/file';

import { placeholderFallback, placeholderFallbackParams } from '../styles';

import { ExtensionLabel } from './ExtensionLabel';

import type { LozengeData } from './index';

export const ICON_SIZE = 24;
const capitalizeFirstLetter = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

type LozengeComponentProps = {
  lozengeData?: LozengeData;
  extensionName: string;
  title: string;
  params: any;
  renderImage: (lozengeData: LozengeData) => void;
  isNodeSelected?: boolean;
  showMacroInteractionDesignUpdates?: boolean;
  customContainerStyles?: CSSProperties;
  isNodeHovered?: boolean;
  isNodeNested?: boolean;
  setIsNodeHovered?: (isHovered: boolean) => void;
  isBodiedMacro?: boolean;
};

export const LozengeComponent = ({
  lozengeData,
  extensionName,
  title,
  params,
  renderImage,
  showMacroInteractionDesignUpdates,
  customContainerStyles,
  isNodeHovered,
  isNodeNested,
  setIsNodeHovered,
  isBodiedMacro,
}: LozengeComponentProps) => {
  const capitalizedTitle = capitalizeFirstLetter(title);
  if (showMacroInteractionDesignUpdates) {
    return (
      <ExtensionLabel
        text={capitalizedTitle}
        extensionName={extensionName}
        isNodeHovered={isNodeHovered}
        isNodeNested={isNodeNested}
        customContainerStyles={customContainerStyles}
        setIsNodeHovered={setIsNodeHovered}
        isBodiedMacro={isBodiedMacro}
      />
    );
  }
  const isBlockExtension = extensionName === 'extension';
  return (
    <div data-testid="lozenge-fallback" css={placeholderFallback}>
      {lozengeData && !isBlockExtension ? (
        renderImage({
          height: ICON_SIZE,
          width: ICON_SIZE,
          ...lozengeData,
        })
      ) : (
        <EditorFileIcon label={title} />
      )}
{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766  */}
      <span className="extension-title">{capitalizedTitle}</span>
      {params && !isBlockExtension && (
        <span css={placeholderFallbackParams}>
          {Object.keys(params).map(
            (key) => key && ` | ${key} = ${params[key].value}`,
          )}
        </span>
      )}
    </div>
  );
};
