/** @jsx jsx */
import { jsx } from '@emotion/react';

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
  isBlockExtension: boolean;
  title: string;
  params: any;
  renderImage: (lozengeData: LozengeData) => void;
  isNodeSelected?: boolean;
  showMacroInteractionDesignUpdates?: boolean;
};

export const LozengeComponent = ({
  lozengeData,
  isBlockExtension,
  title,
  params,
  renderImage,
  isNodeSelected,
  showMacroInteractionDesignUpdates,
}: LozengeComponentProps) => {
  const capitalizedTitle = capitalizeFirstLetter(title);
  // TODO: only show on lozenge on hover: https://product-fabric.atlassian.net/browse/PGXT-4945
  if (showMacroInteractionDesignUpdates) {
    return (
      <div
        className="extension-title"
        css={lozengeWrapper}
        data-testid="new-lozenge"
      >
        <Tag
          text={capitalizedTitle}
          color={isNodeSelected ? 'blueLight' : 'greyLight'}
        />
      </div>
    );
  }

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
