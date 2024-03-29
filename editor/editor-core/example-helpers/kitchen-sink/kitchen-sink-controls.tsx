/** @jsx jsx */
import React from 'react';

import { jsx } from '@emotion/react';

import Button from '@atlaskit/button/custom-theme-button';
import Select from '@atlaskit/select';

import type { EditorAppearance } from '../../src/types';
import FullWidthToggle from '../full-width-toggle';

import { formatAppearanceOption } from './format-appearance-options';
import {
  appearanceControl,
  controls,
  kitchenSinkControl,
} from './kitchen-sink-styles';
import { selectStyles } from './select-styles';

export interface AppearanceOption {
  label: string;
  value: EditorAppearance;
  description?: string;
}

export interface Option<T> {
  label: string;
  value: null | string;
}

export interface KitchenSinkControlsProps {
  adfEnabled: boolean;
  appearance: EditorAppearance;
  appearanceOptions: Option<EditorAppearance>[];
  docOptions: Option<string | null>[];
  editorEnabled: boolean;
  errors: any[];
  errorsEnabled: boolean;
  validating: boolean;
  vertical: boolean;
  scrubContent: boolean;
  sanitizePrivateContent: boolean;
  onAppearanceChange(appearance: EditorAppearance): void;
  onLoadDocument(opt: any): void;
  onCopyLink(): void;
  onFullWidthChange(fullWidth: boolean): void;
  onOrientationChange(vertical: boolean): void;
  onEditorToggle(enabled: boolean): void;
  onErrorToggle(enabled: boolean): void;
  onAdfToggle(enabled: boolean): void;
  onScrubToggle(enabled: boolean): void;
  onSanitizePrivateContent(enabled: boolean): void;
}

export const KitchenSinkControls = React.memo(
  (props: KitchenSinkControlsProps) => {
    const {
      adfEnabled,
      editorEnabled,
      errorsEnabled,
      sanitizePrivateContent,
      onAdfToggle,
      onEditorToggle,
      onErrorToggle,
      onLoadDocument,
      onOrientationChange,
      onScrubToggle,
      onSanitizePrivateContent,
      scrubContent,
      vertical,
    } = props;

    const onOrientationChangeCb = React.useCallback(
      () => onOrientationChange(!vertical),
      [vertical, onOrientationChange],
    );

    const onEditorToggleCb = React.useCallback(
      () => onEditorToggle(!editorEnabled),
      [editorEnabled, onEditorToggle],
    );

    const onScrubToggleCb = React.useCallback(
      () => onScrubToggle(!scrubContent),
      [scrubContent, onScrubToggle],
    );

    const onErrorToggleCb = React.useCallback(
      () => onErrorToggle(!errorsEnabled),
      [errorsEnabled, onErrorToggle],
    );

    const onAdfToggleCb = React.useCallback(
      () => onAdfToggle(!adfEnabled),
      [adfEnabled, onAdfToggle],
    );

    const onSanitizePrivateContentCb = React.useCallback(
      () => onSanitizePrivateContent(!sanitizePrivateContent),
      [sanitizePrivateContent, onSanitizePrivateContent],
    );

    return (
      <div css={controls}>
        <Select
          formatOptionLabel={formatAppearanceOption}
          options={props.appearanceOptions}
          defaultValue={props.appearanceOptions.find(
            (opt: any) => opt.value === props.appearance,
          )}
          onChange={({ value }: any) => props.onAppearanceChange(value)}
          styles={selectStyles}
        />
        <div>
          <Select
            formatOptionLabel={formatAppearanceOption}
            options={props.docOptions}
            onChange={onLoadDocument}
            placeholder="Load an example document..."
            styles={selectStyles}
            css={[kitchenSinkControl, appearanceControl]}
          />
          <div css={kitchenSinkControl}>
            <FullWidthToggle
              appearance={props.appearance}
              onFullWidthChange={props.onFullWidthChange}
            />
          </div>
          <Button onClick={onOrientationChangeCb} css={kitchenSinkControl}>
            Display {!props.vertical ? 'Vertical' : 'Horizontal'}
          </Button>
          <Button
            appearance={!editorEnabled ? 'primary' : 'default'}
            onClick={onEditorToggleCb}
            css={kitchenSinkControl}
          >
            {editorEnabled ? 'Disable' : 'Enable'} editor
          </Button>
          <Button
            appearance={scrubContent ? 'primary' : 'default'}
            onClick={onScrubToggleCb}
            css={kitchenSinkControl}
          >
            {scrubContent ? 'Plain' : 'Scrub'} content
          </Button>
          <Button onClick={props.onCopyLink} css={kitchenSinkControl}>
            Copy Link
          </Button>
          <Button
            appearance={props.errors.length ? 'danger' : 'subtle'}
            isSelected={props.errorsEnabled}
            onClick={onErrorToggleCb}
            isLoading={props.validating}
            css={kitchenSinkControl}
          >
            {props.errors.length} errors
          </Button>
          <Button
            appearance="primary"
            isSelected={props.adfEnabled}
            onClick={onAdfToggleCb}
            css={kitchenSinkControl}
          >
            {!props.adfEnabled ? 'Show' : 'Hide'} current ADF
          </Button>
          <Button
            appearance="primary"
            isSelected={props.sanitizePrivateContent}
            onClick={onSanitizePrivateContentCb}
            css={kitchenSinkControl}
          >
            {!props.sanitizePrivateContent ? 'Sanitize ' : 'Do not sanitize '}
            private content
          </Button>
        </div>
      </div>
    );
  },
);
