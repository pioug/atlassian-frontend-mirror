export default function getDaysInMonth(year: number, month: number): number {
	return new Date(year, month + 1, 0).getDate();
}
