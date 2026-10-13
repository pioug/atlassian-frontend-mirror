import React from 'react';

import { SideNavBody } from '@atlaskit/navigation-system/layout/side-nav';
import { ContainerAvatar } from '@atlaskit/side-nav-items/container-avatar';
import { LinkMenuItem } from '@atlaskit/side-nav-items/link-menu-item';
import { MenuList } from '@atlaskit/side-nav-items/menu-list';

const sampleProjectIcon =
	'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 20 20%22%3E%3Crect width=%2220%22 height=%2220%22 rx=%223%22 fill=%22%236E5DC6%22/%3E%3C/svg%3E';

const sampleProjects = [
	{ id: 'roadmap', name: 'Product roadmap', href: '/projects/roadmap', iconUrl: sampleProjectIcon },
	{ id: 'website', name: 'Website refresh', href: '/projects/website', iconUrl: sampleProjectIcon },
];

export function ProjectLinks({
	projects,
}: {
	projects: Array<{ href: string; iconUrl: string; id: string; name: string }>;
}): React.JSX.Element {
	return (
		<SideNavBody>
			<MenuList>
				{projects.map((project) => (
					<LinkMenuItem
						key={project.id}
						href={project.href}
						elemBefore={<ContainerAvatar src={project.iconUrl} />}
					>
						{project.name}
					</LinkMenuItem>
				))}
			</MenuList>
		</SideNavBody>
	);
}

export function ProjectLinksExample(): React.JSX.Element {
	return <ProjectLinks projects={sampleProjects} />;
}

export default ProjectLinksExample;
