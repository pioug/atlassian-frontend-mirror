/* eslint-disable import/dynamic-import-chunkname */
/** @jsx jsx */
import { Fragment, useEffect, useRef, useState } from 'react';

import { css, jsx } from '@emotion/react';

import { token } from '@atlaskit/tokens';
import {
  importForInteraction,
  waitForAllResources,
} from '@atlassian/react-async';

import { fallbackColor } from './util/fallback';
import { GlobalStyles } from './util/global-styles';

type FileUpload = {
  name: string;
};

const fileStyles = css({
  display: 'flex',
  padding: 'calc(var(--grid) * 6) calc(var(--grid) * 4)',
  alignItems: 'center',
  justifyContent: 'center',
  background: token('elevation.surface.sunken', fallbackColor),
  borderRadius: 'var(--border-radius)',
  color: token('color.text.disabled', fallbackColor),
  fontSize: '1.4rem',
});

const overStyles = css({
  background: token('color.background.selected.hovered', fallbackColor),
  color: token('color.text.selected', fallbackColor),
});

const potentialStyles = css({
  background: token('color.background.discovery', fallbackColor),
});

const appStyles = css({
  display: 'flex',
  padding: 'var(--grid)',
  alignItems: 'center',
  gap: 'calc(var(--grid) * 2)',
  flexDirection: 'column',
});

function FileList({ uploads }: { uploads: FileUpload[] }) {
  if (!uploads.length) {
    return null;
  }
  return (
    <ul>
      {uploads.map((upload, index) => (
        <li key={index}>{upload.name}</li>
      ))}
    </ul>
  );
}

function Uploader() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [state, setState] = useState<'loading' | 'idle' | 'potential' | 'over'>(
    'loading',
  );
  const [uploads, setUploads] = useState<FileUpload[]>([]);

  useEffect(() => {
    let cleanupDragAndDrop: null | (() => void) = null;
    const disposeResource = waitForAllResources([
      importForInteraction(
        () =>
          import(
            /* webpackChunkName: "@atlaskit/pragmatic-drag-and-drop/util/combine" */ '@atlaskit/pragmatic-drag-and-drop/util/combine'
          ),
        {
          moduleId: '@atlaskit/pragmatic-drag-and-drop/util/combine',
        },
      ),
      importForInteraction(
        () =>
          import(
            /* webpackChunkName: "@atlaskit/pragmatic-drag-and-drop/adapter/file" */ '@atlaskit/pragmatic-drag-and-drop/adapter/file'
          ),
        {
          moduleId: '@atlaskit/pragmatic-drag-and-drop/adapter/file',
        },
      ),
      importForInteraction(
        () =>
          import(
            /* webpackChunkName: "@atlaskit/pragmatic-drag-and-drop/addon/cancel-unhandled" */ '@atlaskit/pragmatic-drag-and-drop/addon/cancel-unhandled'
          ),
        {
          moduleId: '@atlaskit/pragmatic-drag-and-drop/addon/cancel-unhandled',
        },
      ),
    ]).onComplete(
      ([
        { combine },
        { dropTargetForFiles, monitorForFiles },
        { cancelUnhandled },
      ]) => {
        const el = ref.current;
        if (!el) {
          return;
        }
        setState('idle');

        cleanupDragAndDrop = combine(
          dropTargetForFiles({
            element: el,
            onDragEnter: () => setState('over'),
            onDragLeave: () => setState('potential'),
            onDrop: ({ source }) => {
              if (!source.items) {
                return;
              }
              const files: FileUpload[] = [...source.items]
                .filter(item => item.kind === 'file')
                .map(item => item.getAsFile())
                .filter((file: File | null): file is File => file != null)
                .map(file => ({ name: file.name }));
              setUploads(current => [...files, ...current]);
            },
          }),
          monitorForFiles({
            onDragStart: () => {
              setState('potential');
              cancelUnhandled.start();
            },
            onDrop: () => {
              cancelUnhandled.stop();
              setState('idle');
            },
          }),
        );
      },
      err => {
        console.log('error', err);
      },
    );

    return () => {
      disposeResource();
      cleanupDragAndDrop?.();
    };
  });
  return (
    <div css={appStyles}>
      <div
        ref={ref}
        data-testid="drop-target"
        css={[
          fileStyles,
          state === 'over'
            ? overStyles
            : state === 'potential'
            ? potentialStyles
            : undefined,
        ]}
      >
        <strong>Drop some files on me! {state}</strong>
      </div>
      <FileList uploads={uploads} />
    </div>
  );
}

export default function Example() {
  return (
    <Fragment>
      <GlobalStyles />
      <Uploader />
    </Fragment>
  );
}
