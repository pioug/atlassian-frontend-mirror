// This function transposes an array of array flipping the columns for rows,
// transposition is a familiar algebra concept;
// you can get more details here:
// https://en.wikipedia.org/wiki/Transpose
//
// ```javascript
//
//  const arr = [
//    ['a1', 'a2', 'a3'],
//    ['b1', 'b2', 'b3'],
//    ['c1', 'c2', 'c3'],
//    ['d1', 'd2', 'd3'],
//  ];
//
//  const result = transpose(arr);
//
//  result === [
//    ['a1', 'b1', 'c1', 'd1'],
//    ['a2', 'b2', 'c2', 'd2'],
//    ['a3', 'b3', 'c3', 'd3'],
//  ]
// ```
// Ignored via go/ees005
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const transpose = (array: Array<any>): Array<any> => {
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	return array[0].map((_: any, i: number) => {
		return array.map((column) => column[i]);
	});
};
