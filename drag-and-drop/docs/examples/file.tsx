/** @jsx jsx */
import { Fragment, memo, useEffect, useRef, useState } from 'react';

import { css, jsx } from '@emotion/react';
import { bind } from 'bind-event-listener';
import invariant from 'tiny-invariant';

import {
  dropTargetForFiles,
  monitorForFiles,
} from '@atlaskit/drag-and-drop/adapter/file';
import { cancelUnhandled } from '@atlaskit/drag-and-drop/util/cancel-unhandled';
import { combine } from '@atlaskit/drag-and-drop/util/combine';
import ImageIcon from '@atlaskit/icon/glyph/image';
import { easeInOut } from '@atlaskit/motion/curves';
import { largeDurationMs, mediumDurationMs } from '@atlaskit/motion/durations';
import { token } from '@atlaskit/tokens';

import { fallbackColor } from './util/fallback';
import { GlobalStyles } from './util/global-styles';

const galleryStyles = css({
  display: 'flex',
  width: '70vw',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 'var(--grid)',
  flexWrap: 'wrap',
});
const imageStyles = css({
  display: 'block',
  // borrowing values from pinterest
  // ratio: 0.6378378378
  width: '216px',
  height: '340px',
  objectFit: 'cover',
});
const uploadStyles = css({
  // overflow: 'hidden',
  position: 'relative',
  // using these to hide the details
  borderRadius: 'calc(var(--grid) * 2)',
  overflow: 'hidden',
  transition: `opacity ${largeDurationMs}ms ${easeInOut}, filter ${largeDurationMs}ms ${easeInOut}`,
});
const loadingStyles = css({
  opacity: '0',
  filter: 'blur(1.5rem)',
});
const readyStyles = css({
  opacity: '1',
  filter: 'blur(0)',
});

const uploadDetailStyles = css({
  display: 'flex',
  boxSizing: 'border-box',
  width: '100%',
  padding: 'var(--grid)',
  position: 'absolute',
  bottom: 0,
  gap: 'var(--grid)',
  flexDirection: 'row',
  // background: token('color.background.sunken', fallbackColor),
  // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
  backgroundColor: 'rgba(255,255,255,0.5)',
});

const uploadFilenameStyles = css({
  flexGrow: '1',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

type UserUpload = {
  type: 'image';
  dataUrl: string;
  name: string;
  size: number;
};

const Upload = memo(function Upload({ upload }: { upload: UserUpload }) {
  const [state, setState] = useState<'loading' | 'ready'>('loading');
  const clearTimeout = useRef<() => void>(() => {});

  useEffect(function mount() {
    return function unmount() {
      clearTimeout.current();
    };
  }, []);

  return (
    <div
      css={[uploadStyles, state === 'loading' ? loadingStyles : readyStyles]}
    >
      <img
        src={upload.dataUrl}
        css={imageStyles}
        onLoad={() => {
          // this is the _only_ way I could find to get the animation to run
          // correctly every time in all browsers
          // setTimeout(fn, 0) -> sometimes wouldn't work in chrome (event nesting two)
          // requestAnimationFrame -> nope (event nesting two)
          // requestIdleCallback -> nope (doesn't work in safari)
          // I can find no reliable hook for applying the `ready` state,
          // this is the best I could manage 😩
          const timerId = setTimeout(() => setState('ready'), 100);
          clearTimeout.current = () => window.clearTimeout(timerId);
        }}
      />
      <div css={uploadDetailStyles}>
        <em css={uploadFilenameStyles}>{upload.name}</em>
        <code>{Math.round(upload.size / 1000)}kB</code>
      </div>
    </div>
  );
});

const Gallery = memo(function Gallery({
  uploads: uploads,
}: {
  uploads: UserUpload[];
}) {
  if (!uploads.length) {
    return null;
  }

  return (
    <div css={galleryStyles}>
      {uploads.map((upload, index) => (
        <Upload upload={upload} key={index} />
      ))}
    </div>
  );
});

const fileStyles = css({
  display: 'flex',
  padding: 'calc(var(--grid) * 6) calc(var(--grid) * 4)',
  boxSizing: 'border-box',
  alignItems: 'center',
  justifyContent: 'center',
  background: token('elevation.surface.sunken', fallbackColor),
  borderRadius: 'var(--border-radius)',
  color: token('color.text.disabled', fallbackColor),
  fontSize: '1.4rem',
  transition: `all ${mediumDurationMs}ms ${easeInOut}`,
  border: '2px dashed transparent',
});

const overStyles = css({
  background: token('color.background.selected.hovered', fallbackColor),
  color: token('color.text.selected', fallbackColor),
  borderColor: token('color.border.brand', fallbackColor),
});

const potentialStyles = css({
  borderColor: token('color.border.brand', fallbackColor),
});

const appStyles = css({
  display: 'flex',
  padding: 'var(--grid)',
  alignItems: 'center',
  gap: 'calc(var(--grid) * 2)',
  flexDirection: 'column',
});

function Uploader() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [state, setState] = useState<'idle' | 'potential' | 'over'>('idle');
  const [uploads, setUploads] = useState<UserUpload[]>([]);

  useEffect(() => {
    const el = ref.current;
    invariant(el);
    return combine(
      dropTargetForFiles({
        element: el,
        onDragEnter: () => setState('over'),
        onDragLeave: () => setState('potential'),
        onDrop: ({ source }) => {
          if (!source.items) {
            return;
          }
          [...source.items]
            .filter(item => item.kind === 'file')
            .map(item => item.getAsFile())
            .forEach(file => {
              if (file == null) {
                return;
              }

              if (!file.type.startsWith('image/')) {
                return;
              }

              const reader = new FileReader();
              reader.readAsDataURL(file);

              // for simplicity:
              // - not handling errors
              // - not aborting the
              // - not unbinding the event listener when the effect is removed
              bind(reader, {
                type: 'load',
                listener(event) {
                  const result = reader.result;
                  if (typeof result === 'string') {
                    const upload: UserUpload = {
                      type: 'image',
                      dataUrl: result,
                      name: file.name,
                      size: file.size,
                    };
                    setUploads(current => [...current, upload]);
                  }
                },
              });
            });
        },
      }),
      monitorForFiles({
        onDragStart: () => {
          setState('potential');
          cancelUnhandled.start();
        },
        onDrop: () => {
          setState('idle');
          cancelUnhandled.stop();
        },
      }),
    );
  });
  return (
    <div css={appStyles}>
      <div
        ref={ref}
        css={[
          fileStyles,
          state === 'over'
            ? overStyles
            : state === 'potential'
            ? potentialStyles
            : undefined,
        ]}
      >
        <strong>
          Drop some images on me! <ImageIcon label="image icon" />
        </strong>
      </div>
      <Gallery uploads={uploads} />
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
