import React from 'react';
import Button from '@atlaskit/button/custom-theme-button';
import Select from '@atlaskit/select';

import { EditorAppearance } from '../../src/types';
import FullWidthToggle from '../full-width-toggle';
import { Controls, Container, Column } from './kitchen-sink-styles';
import { formatAppearanceOption } from './format-appearance-options';
import { selectStyles } from './select-styles';

export type Theme = 'light' | 'dark';

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
  theme: Theme;
  themeOptions: Option<Theme>[];
  validating: boolean;
  vertical: boolean;
  scrubContent: boolean;
  onAppearanceChange(appearance: EditorAppearance): void;
  onLoadDocument(opt: any): void;
  onCopyLink(): void;
  onFullWidthChange(fullWidth: boolean): void;
  onThemeChange(theme: Theme): void;
  onOrientationChange(vertical: boolean): void;
  onEditorToggle(enabled: boolean): void;
  onErrorToggle(enabled: boolean): void;
  onAdfToggle(enabled: boolean): void;
  onScrubToggle(enabled: boolean): void;
}

export const KitchenSinkControls: React.FunctionComponent<KitchenSinkControlsProps> = React.memo(
  (props) => {
    const {
      adfEnabled,
      editorEnabled,
      errorsEnabled,
      onAdfToggle,
      onEditorToggle,
      onErrorToggle,
      onLoadDocument,
      onOrientationChange,
      onScrubToggle,
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

    const onAdfToggleCb = React.useCallback(() => onAdfToggle(!adfEnabled), [
      adfEnabled,
      onAdfToggle,
    ]);

    return (
      <Controls>
        <Select
          formatOptionLabel={formatAppearanceOption}
          options={props.appearanceOptions}
          defaultValue={props.appearanceOptions.find(
            (opt: any) => opt.value === props.appearance,
          )}
          onChange={({ value }: any) => props.onAppearanceChange(value)}
          styles={selectStyles}
        />
        <Container>
          <Column>
            <Select
              formatOptionLabel={formatAppearanceOption}
              options={props.docOptions}
              onChange={onLoadDocument}
              placeholder="Load an example document..."
              styles={selectStyles}
            />
          </Column>
          <Column
            style={{
              flex: 0,
              alignItems: 'center',
              display: 'flex',
            }}
          >
            <FullWidthToggle
              appearance={props.appearance}
              onFullWidthChange={props.onFullWidthChange}
            />

            <Select
              formatOptionLabel={formatAppearanceOption}
              options={props.themeOptions}
              onChange={(opt: any) => props.onThemeChange(opt.value)}
              spacing="compact"
              defaultValue={props.themeOptions.find(
                (opt) => opt.value === props.theme,
              )}
              className="theme-select"
              styles={selectStyles}
            />
            <Button onClick={onOrientationChangeCb}>
              Display {!props.vertical ? 'Vertical' : 'Horizontal'}
            </Button>

            <Button
              appearance={!editorEnabled ? 'primary' : 'default'}
              onClick={onEditorToggleCb}
            >
              {editorEnabled ? 'Disable' : 'Enable'} editor
            </Button>
            <Button
              appearance={scrubContent ? 'primary' : 'default'}
              onClick={onScrubToggleCb}
            >
              {scrubContent ? 'Plain' : 'Scrub'} content
            </Button>
            <Button onClick={props.onCopyLink}>Copy Link</Button>
            <Button
              appearance={props.errors.length ? 'danger' : 'subtle'}
              isSelected={props.errorsEnabled}
              onClick={onErrorToggleCb}
              isLoading={props.validating}
            >
              {props.errors.length} errors
            </Button>
            <Button
              appearance="primary"
              isSelected={props.adfEnabled}
              onClick={onAdfToggleCb}
            >
              {!props.adfEnabled ? 'Show' : 'Hide'} current ADF
            </Button>
          </Column>
        </Container>
      </Controls>
    );
  },
);
