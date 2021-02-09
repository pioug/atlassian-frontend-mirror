export default function padToTwo(number: number) {
  return number <= 99 ? `0${number}`.slice(-2) : `${number}`;
}
