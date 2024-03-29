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
}: LozengeComponentProps) => {
  const capitalizedTitle = capitalizeFirstLetter(title);
  if (showMacroInteractionDesignUpdates) {
    return (
      <ExtensionLabel
        text={capitalizedTitle}
        extensionName={extensionName}
        isNodeHovered={isNodeHovered}
        customContainerStyles={customContainerStyles}
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
