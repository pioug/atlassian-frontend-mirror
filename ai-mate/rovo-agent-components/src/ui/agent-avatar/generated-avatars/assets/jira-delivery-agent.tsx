import React from 'react';

type AvatarIconProps = {
	size: number;
	primaryColor: string;
	secondaryColor: string;
};

export default ({
	size,
	primaryColor: _primaryColor,
	secondaryColor: _secondaryColor,
}: AvatarIconProps): React.JSX.Element => (
	<svg
		width={size}
		height={size}
		viewBox="0 0 48 52"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		aria-hidden="true"
	>
		<path
			d="M21.049 0.790295C22.8749 -0.263431 25.1245 -0.263432 26.9504 0.790294L44.1581 10.7209C45.984 11.7746 47.1087 13.722 47.1087 15.8294V35.6906C47.1087 37.798 45.984 39.7454 44.1581 40.7991L26.9504 50.7297C25.1245 51.7834 22.8749 51.7834 21.049 50.7297L3.84132 40.7991C2.01542 39.7454 0.890625 37.798 0.890625 35.6906V15.8294C0.890625 13.722 2.01542 11.7746 3.84132 10.7209L21.049 0.790295Z"
			fill="#1868DB"
		/>
		<path
			d="M34.5 15.2598L10.5 23.4721L19.5852 28.015L24.7501 22.8518L26.871 24.9735L21.7068 30.1361L26.2499 39.2221L34.5 15.2598Z"
			fill="white"
		/>
	</svg>
);
