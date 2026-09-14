/* eslint-disable @atlaskit/editor/no-re-export */
// Entry file in package.json

export class Rect {
	left: number;
	top: number;
	right: number;
	bottom: number;
	constructor(left: number, top: number, right: number, bottom: number) {
		this.left = left;
		this.top = top;
		this.right = right;
		this.bottom = bottom;
	}
}
