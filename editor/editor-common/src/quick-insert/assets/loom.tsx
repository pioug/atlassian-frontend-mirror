import React from 'react';

import { useIconThemed } from '../use-icon-themed';

export default function IconLayout() {
	const { iconThemed } = useIconThemed();

	return (
		<svg focusable="false" aria-hidden viewBox="0 0 31 30" width={40} height={40}>
			<path
				fill={iconThemed({ light: '#6460F9', dark: '#FFF' })}
				d="M30.01 13.43h-9.142l7.917-4.57-1.57-2.72-7.918 4.57 4.57-7.915-2.72-1.57-4.571 7.913V0h-3.142v9.139L8.863 1.225l-2.721 1.57 4.57 7.913L2.796 6.14 1.225 8.86l7.917 4.57H0v3.141h9.141l-7.916 4.57 1.57 2.72 7.918-4.57-4.571 7.915 2.72 1.57 4.572-7.914V30h3.142v-9.334l4.655 8.06 2.551-1.472-4.656-8.062 8.087 4.668 1.571-2.72-7.916-4.57h9.141v-3.14h.001zm-15.005 5.84a4.271 4.271 0 11-.001-8.542 4.271 4.271 0 01.001 8.542z"
			/>
		</svg>
	);
}
