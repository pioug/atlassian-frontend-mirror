/** @jsx jsx */
import React from 'react';

import { jsx } from '@emotion/react';

import Button from '@atlaskit/button/custom-theme-button';
import Select from '@atlaskit/select';

import type { EditorAppearance } from '../../src/types';
import FullWidthToggle from '../full-width-toggle';
import { formatAppearanceOption } from '../kitchen-sink/format-appearance-options';
import {
  appearanceControl,
  controls,
  kitchenSinkControl,
} from '../kitchen-sink/kitchen-sink-styles';
import { selectStyles } from '../kitchen-sink/select-styles';

export interface AppearanceOption {
  label: string;
  value: EditorAppearance;
  description?: string;
}

export interface Option<T> {
  label: string;
  value: null | string;
}

export interface EditorExampleControlsProps {
  adfEnabled?: boolean;
  appearance?: EditorAppearance;
  appearanceOptions?: Option<EditorAppearance>[];
  docOptions?: Option<string | null>[];
  editorEnabled?: boolean;
  errors?: any[];
  errorsEnabled?: boolean;
  validating?: boolean;
  vertical?: boolean;
  scrubContent?: boolean;
  sanitizePrivateContent?: boolean;
  onAppearanceChange?: (appearance: EditorAppearance) => void;
  onLoadDocument?: (opt: any) => void;
  onCopyLink?: () => void;
  onFullWidthChange?: (fullWidth: boolean) => void;
  onOrientationChange?: (vertical: boolean) => void;
  onEditorToggle?: (enabled: boolean) => void;
  onErrorToggle?: (enabled: boolean) => void;
  onAdfToggle?: (enabled: boolean) => void;
  onScrubToggle?: (enabled: boolean) => void;
  onSanitizePrivateContent?: (enabled: boolean) => void;
}

export const EditorExampleControls = React.memo(
  (props: EditorExampleControlsProps) => {
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
      () => (onOrientationChange ? onOrientationChange(!vertical) : null),
      [vertical, onOrientationChange],
    );

    const onEditorToggleCb = React.useCallback(
      () => (onEditorToggle ? onEditorToggle(!editorEnabled) : null),
      [editorEnabled, onEditorToggle],
    );

    const onScrubToggleCb = React.useCallback(
      () => (onScrubToggle ? onScrubToggle(!scrubContent) : null),
      [scrubContent, onScrubToggle],
    );

    const onErrorToggleCb = React.useCallback(
      () => (onErrorToggle ? onErrorToggle(!errorsEnabled) : null),
      [errorsEnabled, onErrorToggle],
    );

    const onAdfToggleCb = React.useCallback(
      () => (onAdfToggle ? onAdfToggle(!adfEnabled) : null),
      [adfEnabled, onAdfToggle],
    );

    const onSanitizePrivateContentCb = React.useCallback(
      () =>
        onSanitizePrivateContent
          ? onSanitizePrivateContent(!sanitizePrivateContent)
          : null,
      [sanitizePrivateContent, onSanitizePrivateContent],
    );

    return (
      <div css={controls}>
        {props.appearanceOptions && props.onAppearanceChange && (
          <Select
            formatOptionLabel={formatAppearanceOption}
            options={props.appearanceOptions}
            defaultValue={props.appearanceOptions.find(
              (opt: any) => opt.value === props.appearance,
            )}
            onChange={({ value }: any) =>
              props.onAppearanceChange ? props.onAppearanceChange(value) : null
            }
            styles={selectStyles}
          />
        )}
        <div>
          {props.docOptions && onLoadDocument && (
            <Select
              formatOptionLabel={formatAppearanceOption}
              options={props.docOptions}
              onChange={onLoadDocument}
              placeholder="Load an example document..."
              styles={selectStyles}
              css={[kitchenSinkControl, appearanceControl]}
            />
          )}
          <div css={kitchenSinkControl}>
            {props.appearance && props.onFullWidthChange && (
              <FullWidthToggle
                appearance={props.appearance}
                onFullWidthChange={props.onFullWidthChange}
              />
            )}
          </div>
          {props.onOrientationChange && (
            <Button onClick={onOrientationChangeCb} css={kitchenSinkControl}>
              Display {!props.vertical ? 'Vertical' : 'Horizontal'}
            </Button>
          )}
          {props.onEditorToggle && (
            <Button
              appearance={!editorEnabled ? 'primary' : 'default'}
              onClick={onEditorToggleCb}
              css={kitchenSinkControl}
            >
              {editorEnabled ? 'Disable' : 'Enable'} editor
            </Button>
          )}
          {props.onScrubToggle && (
            <Button
              appearance={scrubContent ? 'primary' : 'default'}
              onClick={onScrubToggleCb}
              css={kitchenSinkControl}
            >
              {scrubContent ? 'Plain' : 'Scrub'} content
            </Button>
          )}
          {props.onCopyLink && (
            <Button onClick={props.onCopyLink} css={kitchenSinkControl}>
              Copy Link
            </Button>
          )}
          {props.onErrorToggle && props.errors && (
            <Button
              appearance={props.errors.length ? 'danger' : 'subtle'}
              isSelected={props.errorsEnabled}
              onClick={onErrorToggleCb}
              isLoading={props.validating}
              css={kitchenSinkControl}
            >
              {props.errors.length} errors
            </Button>
          )}
          {props.onAdfToggle && props.adfEnabled && (
            <Button
              appearance="primary"
              isSelected={props.adfEnabled}
              onClick={onAdfToggleCb}
              css={kitchenSinkControl}
            >
              {!props.adfEnabled ? 'Show' : 'Hide'} current ADF
            </Button>
          )}
          {!!props.sanitizePrivateContent && props.onSanitizePrivateContent && (
            <Button
              appearance="primary"
              isSelected={props.sanitizePrivateContent}
              onClick={onSanitizePrivateContentCb}
              css={kitchenSinkControl}
            >
              {!props.sanitizePrivateContent ? 'Sanitize ' : 'Do not sanitize '}
              private content
            </Button>
          )}
        </div>
      </div>
    );
  },
);
