import React from 'react';

import ProfileCard from '../../../src/components/User/ProfileCard';
import { type TeamCentralReportingLinesData } from '../../../src/types';

const avatarImage =
	'data:image/gif;base64,R0lGODdhgACAAPIHAABRzMHT8l6O3o2w6env+zh22P///xRe0CwAAAAAgACAAAAD/wi63P4wykmrvTjrzbv/YCiOZGmeaKqubOu+cCzPdG3feK7vfO//wKBwSCwaj8ikcslsOp/QqHRKrVqv2Kx2y+16v+CweEwum8/otHrNbrvf8Lh8Tq83CwGDgTA4RA4DBHoBAnADeoh7BQ8HgokGA24Cj4gED3mUBoVsmJmbC5OZe22iepEMh6V+a6UGAQ2poouspacLsZmrap2UswsFpa9sjZnCsLJuBY6IAbrHiQSfbQcCAQED0g8FA9YCznbg4eLj5OVO2zMDvlXKrt8qB3kE61LEg/Qo8ZX4TvrQ2SbaQXvHxB+lPicAiWomBdejaCUEFiPIxOGjAPw04GnFkIiKxYveOFRrBQlLKJKEKDagFohkySwSSRK4NgBbAQE1uS2TCdCKQZdAUaq0ImBn0KN6IIppiTQon6FbqBlt+hBhmm1Tj/LpebVaVkoz1YUrQDZnTbIZzaldy7at27dw48qdS7eu3bt48+rdy7ev37+AAwseTLiw4cOIEytezLix48eQI0uenDcBADs=';

const reportingLinesData: TeamCentralReportingLinesData = {
	managers: [
		{
			accountIdentifier: '123456:12345-67890-123',
			identifierType: 'ATLASSIAN_ID',
			pii: {
				name: 'Kramer Hatfield',
				picture: avatarImage,
			},
		},
	],
	reports: [
		{
			accountIdentifier: '123456:12345-67890-6',
			identifierType: 'ATLASSIAN_ID',
			pii: {
				name: 'Lewis Cervantes',
				picture: avatarImage,
			},
		},
	],
};

export const ProfileCardExampleWithReportingLines = (): React.JSX.Element => (
	<ProfileCard
		avatarUrl={avatarImage}
		fullName="Rosalyn Franklin"
		meta="Manager"
		nickname="rfranklin"
		email="rfranklin@acme.com"
		timestring="18:45"
		location="Somewhere, World"
		actions={[
			{
				label: 'View profile',
				id: 'view-profile',
				callback: () => {},
			},
		]}
		reportingLines={reportingLinesData}
		reportingLinesProfileUrl="/"
		onReportingLinesClick={() => {}}
	/>
);

export const ProfileCardExampleWithoutReportingLines = (): React.JSX.Element => (
	<ProfileCard
		avatarUrl={avatarImage}
		fullName="Rosalyn Franklin"
		meta="Manager"
		nickname="rfranklin"
		email="rfranklin@acme.com"
		timestring="18:45"
		location="Somewhere, World"
		actions={[
			{
				label: 'View profile',
				id: 'view-profile',
				callback: () => {},
			},
		]}
		reportingLinesProfileUrl="/"
		onReportingLinesClick={() => {}}
	/>
);
