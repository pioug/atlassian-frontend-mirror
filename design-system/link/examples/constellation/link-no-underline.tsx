import React from 'react';

import Link from '../../src';

export default function NoUnderline() {
	return (
		<Link href="https://www.atlassian.com/software/confluence" isUnderlined={false}>
			No underline
		</Link>
	);
}
