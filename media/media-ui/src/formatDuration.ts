const pad = (n: number) => {
  return n < 10 ? `0${n}` : n;
};

export const isInvalidInput = (seconds: number) => {
  return isNaN(seconds) || seconds === Infinity || seconds < 0;
};

export const secondsToTime = (
  seconds: number,
): { seconds: number; minutes: number; hours: number } => {
  if (isInvalidInput(seconds)) {
    return { seconds: 0, minutes: 0, hours: 0 };
  }

  const totalSeconds = parseInt(`${seconds}`, 10);
  const hours = Math.floor(totalSeconds / 3600);

  let remainingSeconds = totalSeconds % 3600;
  const minutes = Math.floor(remainingSeconds / 60);
  remainingSeconds %= 60;

  return {
    seconds: remainingSeconds,
    minutes,
    hours,
  };
};

export const formatDuration = (seconds: number) => {
  if (isInvalidInput(seconds)) {
    return '0:00';
  }

  const { hours, minutes, seconds: remainingSeconds } = secondsToTime(seconds);

  const prettyHoursWithSeparator = hours > 0 ? hours + ':' : '';
  const prettyMinutes = prettyHoursWithSeparator ? pad(minutes) : minutes;

  return `${prettyHoursWithSeparator}${prettyMinutes}:${pad(remainingSeconds)}`;
};
