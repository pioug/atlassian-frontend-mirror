function padMinutes(minutes: number): string {
  return minutes < 10 ? `0${minutes}` : String(minutes);
}

export const random = (int: number): number =>
  Math.floor(Math.random() * (int + 1));

export const getWeekday = (): { index: number; string: string } => {
  const array = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const index = random(6);

  return {
    index,
    string: array[index],
  };
};

export const getTimeString = (): string => {
  const hours = random(23);
  const minutes = random(59);
  const meridiem = ['am', 'pm'][Math.floor(hours / 12)];

  return `${hours === 0 ? 12 : hours % 12}:${padMinutes(minutes)}${meridiem}`;
};
