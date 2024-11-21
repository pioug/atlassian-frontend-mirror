/* Example usage
formatNumber(4100); // Output: "4.1k"
formatNumber(1234567); // Output: "1.2M"
formatNumber(9876543210); // Output: "9.9B"
formatNumber(500); // Output: "500"
*/
export const formatNumber = (inputNumber: number): string => {
	if (inputNumber >= 1e9) {
		return (inputNumber / 1e9).toFixed(1) + 'B';
	} else if (inputNumber >= 1e6) {
		return (inputNumber / 1e6).toFixed(1) + 'M';
	} else if (inputNumber >= 1e3) {
		return (inputNumber / 1e3).toFixed(1) + 'k';
	} else {
		return inputNumber.toString();
	}
};
