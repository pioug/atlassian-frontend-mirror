/** @jsx jsx */
import type { CSSProperties } from 'react';

import { jsx } from '@emotion/react';
import classnames from 'classnames';

import EditorFileIcon from '@atlaskit/icon/glyph/editor/file';
import { SimpleTag as Tag } from '@atlaskit/tag';

import type { LozengeData } from './Lozenge';
import {
  lozengeWrapper,
  placeholderFallback,
  placeholderFallbackParams,
} from './styles';

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
  isNodeSelected,
  showMacroInteractionDesignUpdates,
  customContainerStyles,
  isNodeHovered,
}: LozengeComponentProps) => {
  const capitalizedTitle = capitalizeFirstLetter(title);
  if (showMacroInteractionDesignUpdates && (isNodeHovered || isNodeSelected)) {
    const lozengeClassNames = classnames('extension-title', {
      'inline-extension': extensionName === 'inlineExtension',
    });
    return (
      <div
        className={lozengeClassNames}
        css={lozengeWrapper}
        data-testid="new-lozenge"
        style={customContainerStyles}
      >
        <Tag
          text={capitalizedTitle}
          color={isNodeSelected ? 'blueLight' : 'greyLight'}
        />
      </div>
    );
  } else if (!showMacroInteractionDesignUpdates) {
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
  }
  return null;
};
