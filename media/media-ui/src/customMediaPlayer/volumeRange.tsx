import React, {
  type KeyboardEvent as ReactKeyboardEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import { TimeRangeWrapper } from './styled';
import Range from '@atlaskit/range';

export type VolumeRangeProps = {
  currentVolume: number;
  onChange: (newVolume: number) => void;
  isAlwaysActive: boolean;
  onChanged?: () => void;
  ariaLabel: string;
};

const increaseVolumeKeys = new Set(['ArrowRight', 'ArrowUp']);
const decreaseVolumeKeys = new Set(['ArrowLeft', 'ArrowDown']);

const VolumeRange = (props: VolumeRangeProps) => {
  const { isAlwaysActive = false, onChange, currentVolume, onChanged, ariaLabel } = props;
  const wrapperElement = useRef<HTMLDivElement>(null);

  const mouseEventsSharedData = useRef({
    dragStartClientX: 0,
    isDragging: false,
  });
  const [wrapperElementWidth, _setWrapperElementWidth] = useState<number>(0);
  const wrapperElementWidthRef = React.useRef(wrapperElementWidth);

  const setWrapperElementWidth = (width: number) => {
    wrapperElementWidthRef.current = width;
  };

  const setWrapperWidth = useCallback(() => {
    if (!wrapperElement.current) {
      return;
    }
    setWrapperElementWidth(
      wrapperElement.current.getBoundingClientRect().width,
    );
  }, []);

  useEffect(() => {
    window.addEventListener('resize', setWrapperWidth);
    return () => {
      window.removeEventListener('resize', setWrapperWidth);
    };
  }, [setWrapperWidth]);

  const onMouseMove = (e: MouseEvent) => {
    if (!mouseEventsSharedData.current.isDragging) {
      return;
    }
    e.stopPropagation();

    const { onChange, currentVolume } = props;
    const { clientX } = e;

    let absolutePosition =
      clientX - mouseEventsSharedData.current.dragStartClientX;

    const isOutsideToRight = absolutePosition > wrapperElementWidthRef.current;
    const isOutsideToLeft = absolutePosition < 0;

    // Next to conditions take care of situation where user moves mouse very quickly out to the side
    // left or right. It's very easy to leave thumb not at the end/beginning of a volume line.
    // This will guarantee that in this case thumb will move to appropriate extreme.
    if (isOutsideToRight) {
      absolutePosition = wrapperElementWidthRef.current;
    }
    if (isOutsideToLeft) {
      absolutePosition = 0;
    }

    const newVolumeWithBoundaries =
      absolutePosition / wrapperElementWidthRef.current;
    if (currentVolume !== newVolumeWithBoundaries) {
      // If value hasn't changed we don't want to call "change"
      onChange(newVolumeWithBoundaries);
    }
  };

  const onMouseUp = () => {
    // As soon as user finished dragging, we should clean up events.
    document.removeEventListener('mouseup', onMouseUp);
    document.removeEventListener('mousemove', onMouseMove);

    if (onChanged) {
      onChanged();
    }

    mouseEventsSharedData.current.isDragging = false;
  };

  const onThumbMouseDown = (e: React.SyntheticEvent<HTMLDivElement>) => {
    e.preventDefault();

    // We need to recalculate every time, because width can change (thanks, editor ;-)
    setWrapperWidth();

    // We are implementing drag and drop here. There is no reason to start listening for mouseUp or move
    // before that. Also if we start listening for mouseup before that we could pick up someone else's event
    // For example editors resizing of a inline video player.
    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mousemove', onMouseMove);

    const event = e.nativeEvent as MouseEvent;
    let x = event.offsetX;
    let currentVolume = x / wrapperElementWidthRef.current;
    currentVolume = currentVolume > 0 ? currentVolume : 0;
    mouseEventsSharedData.current = {
      dragStartClientX: event.clientX - x,
      isDragging: true,
    };
    // As soon as user clicks timeline we want to move thumb over to that place.
    onChange(currentVolume);
  };

  const onThumbKeyDown = (e: ReactKeyboardEvent) => {
    const eventKey = e.key;
    const isShiftPressed = e.shiftKey;

    if (increaseVolumeKeys.has(eventKey) || decreaseVolumeKeys.has(eventKey)) {
      // preventDefault call is needed to keep the volume regulator focused(visible) in FireFox (Editor mode)
      e.preventDefault();

      let newVolume = currentVolume;
      if (increaseVolumeKeys.has(eventKey)) {
        newVolume += isShiftPressed ? 0.1 : 0.01;
      } else if (decreaseVolumeKeys.has(eventKey)) {
        newVolume -= isShiftPressed ? 0.1 : 0.01;
      }
      newVolume = newVolume > 1 ? 1 : newVolume;
      newVolume = newVolume < 0 ? 0 : newVolume;
      onChange(+newVolume.toPrecision(2));
      if (onChanged) {
        onChanged();
      }
    }
  };

  const onInputChange = (newVolume: number) => {
    if (newVolume) {
      onChange(newVolume / 100);
      if (onChanged) {
        onChanged();
      }
    }
  };

  const currentPosition = currentVolume * 100;
  return (
    <TimeRangeWrapper
      showAsActive={isAlwaysActive}
      onMouseDown={onThumbMouseDown}
      onKeyDown={onThumbKeyDown}
      ref={wrapperElement}
    >
      <Range
        tabIndex={0}
        step={1}
        min={0}
        max={100}
        value={currentPosition}
        onChange={onInputChange}
        aria-label={ariaLabel}
      />
    </TimeRangeWrapper>
  );
};

export default VolumeRange;
