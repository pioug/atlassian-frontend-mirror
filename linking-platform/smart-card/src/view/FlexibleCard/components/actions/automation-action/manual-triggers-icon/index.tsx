import React from 'react';

const AutomationManualTriggersGlyph = ({ label }: { label: string }): React.JSX.Element => (
	<svg
		aria-label={label}
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path d="M14 5L10 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
		<path
			d="M14 5L7 12H17L10 19"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</svg>
);

export default AutomationManualTriggersGlyph;
