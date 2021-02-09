export default function pad(num: number) {
  return num < 10 ? `0${num}` : num;
}
