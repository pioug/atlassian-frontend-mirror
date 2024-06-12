/**
 * This is hard-coded here because our actual <Header /> has no typings
 * for its props.
 *
 * Adding types for real *might* break things so will need a little care.
 *
 * Defining it here for now lets us provide *something* without much headache.
 */
type HeaderProps = {
	/**
	 * Width of the header item. Takes a string, or a number representing the width in pixels.
	 */
	width?: string | number;
};

const TableHeader = function (props: HeaderProps) {
	return null;
};

export default TableHeader;
