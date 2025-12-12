export function resolveName(nodeName: string): string {
	switch (nodeName) {
		case 'text_formatted':
			return 'formatted_text_inline_node';
		case 'text_code_inline':
			return 'code_inline_node';
		case 'tableCell':
			return 'table_cell_node';
		case 'tableHeader':
			return 'table_header_node';
		case 'tableRow':
			return 'table_row_node';
		case 'tableCellContent':
			return 'table_cell_content';
		case 'block_content':
			return 'block_content';
		// this is a case of groups passing through here as well and loss of information to tell if its a group or a node
		case 'non_nestable_block_content':
			return 'non_nestable_block_content';
		case 'nestedExpand_content':
			return 'nestedExpand_content';
		default:
			return `${nodeName}_node`;
	}
}
