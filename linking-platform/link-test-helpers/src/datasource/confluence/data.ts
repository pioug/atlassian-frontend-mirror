import { type DatasourceDataResponseItem } from '@atlaskit/linking-types';

import { profile as profileBase64Image } from '../../images';

export const defaultInitialVisibleColumnKeys: string[] = [
	'id',
	'title',
	'space',
	'type',
	'ownedBy',
];

const mockData: Array<DatasourceDataResponseItem> = [
	{
		id: {
			data: 'ari:cloud:confluence:61ae97a3-2835-4727-82d6-3d6a055c39a9:page/921076941',
		},
		title: {
			data: {
				text: 'Jira Table',
				url: 'https://at-perfpm.jira-dev.com/wiki/spaces/TEST/pages/921076941/Jira+Table',
			},
		},
		space: {
			data: {
				url: 'https://at-perfpm.jira-dev.com/wiki/spaces/TEST',
			},
		},
		type: {
			data: {
				source:
					'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiByb2xlPSJwcmVzZW50YXRpb24iPjxwYXRoIGZpbGw9IiMyNjg0RkYiIGZpbGwtcnVsZT0iZXZlbm9kZCIgZD0iTTMgMGgxOGEzIDMgMCAwMTMgM3YxOGEzIDMgMCAwMS0zIDNIM2EzIDMgMCAwMS0zLTNWM2EzIDMgMCAwMTMtM3ptMSAxOGMwIC41NTYuNDQ2IDEgLjk5NSAxaDguMDFjLjU0IDAgLjk5NS0uNDQ4Ljk5NS0xIDAtLjU1Ni0uNDQ2LTEtLjk5NS0xaC04LjAxYy0uNTQgMC0uOTk1LjQ0OC0uOTk1IDF6bTAtNGMwIC41NTYuNDQ4IDEgMSAxaDE0Yy41NTUgMCAxLS40NDggMS0xIDAtLjU1Ni0uNDQ4LTEtMS0xSDVjLS41NTUgMC0xIC40NDgtMSAxem0wLTRjMCAuNTU2LjQ0OCAxIDEgMWgxNGMuNTU1IDAgMS0uNDQ4IDEtMSAwLS41NTYtLjQ0OC0xLTEtMUg1Yy0uNTU1IDAtMSAuNDQ4LTEgMXptMC00YzAgLjU1Ni40NDggMSAxIDFoMTRjLjU1NSAwIDEtLjQ0OCAxLTEgMC0uNTU2LS40NDgtMS0xLTFINWMtLjU1NSAwLTEgLjQ0OC0xIDF6Ij48L3BhdGg+PC9zdmc+',
			},
		},
		updatedAt: {
			data: '2023-05-17T20:08:13+00:00',
		},
		status: {
			data: {
				text: 'CURRENT',
				style: {
					appearance: 'success',
				},
			},
		},
		updatedBy: {
			data: {
				displayName: 'Alexey Markevich',
				avatarSource: profileBase64Image,
			},
		},
		ownedBy: {
			data: {
				displayName: 'Alexey Markevich',
				avatarSource: profileBase64Image,
			},
		},
		createdBy: {
			data: {
				displayName: 'Alexey Markevich',
				avatarSource: profileBase64Image,
			},
		},
		versionNumber: {
			data: 2,
		},
	},
	{
		id: {
			data: 'ari:cloud:confluence:61ae97a3-2835-4727-82d6-3d6a055c39a9:page/930954727',
		},
		title: {
			data: {
				text: 'Migrated Whiteboards',
				url: 'https://at-perfpm.jira-dev.com/wiki/spaces/TEST/pages/930954727/Migrated+Whiteboards',
			},
		},
		space: {
			data: {
				url: 'https://at-perfpm.jira-dev.com/wiki/spaces/TEST',
			},
		},
		type: {
			data: {
				source:
					'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiByb2xlPSJwcmVzZW50YXRpb24iPjxwYXRoIGZpbGw9IiMyNjg0RkYiIGZpbGwtcnVsZT0iZXZlbm9kZCIgZD0iTTMgMGgxOGEzIDMgMCAwMTMgM3YxOGEzIDMgMCAwMS0zIDNIM2EzIDMgMCAwMS0zLTNWM2EzIDMgMCAwMTMtM3ptMSAxOGMwIC41NTYuNDQ2IDEgLjk5NSAxaDguMDFjLjU0IDAgLjk5NS0uNDQ4Ljk5NS0xIDAtLjU1Ni0uNDQ2LTEtLjk5NS0xaC04LjAxYy0uNTQgMC0uOTk1LjQ0OC0uOTk1IDF6bTAtNGMwIC41NTYuNDQ4IDEgMSAxaDE0Yy41NTUgMCAxLS40NDggMS0xIDAtLjU1Ni0uNDQ4LTEtMS0xSDVjLS41NTUgMC0xIC40NDgtMSAxem0wLTRjMCAuNTU2LjQ0OCAxIDEgMWgxNGMuNTU1IDAgMS0uNDQ4IDEtMSAwLS41NTYtLjQ0OC0xLTEtMUg1Yy0uNTU1IDAtMSAuNDQ4LTEgMXptMC00YzAgLjU1Ni40NDggMSAxIDFoMTRjLjU1NSAwIDEtLjQ0OCAxLTEgMC0uNTU2LS40NDgtMS0xLTFINWMtLjU1NSAwLTEgLjQ0OC0xIDF6Ij48L3BhdGg+PC9zdmc+',
			},
		},
		description: {
			data: 'Hello! :wave:\n Whiteboards have been migrated to this page. Any whiteboards created during the early access program are now visible in the content tree.\nAll whiteboards previously created in the space are under this parent page.\nYou can move and organize these whiteboards any way you want in the content tree.',
		},
		updatedAt: {
			data: '2023-06-07T20:11:13+00:00',
		},
		status: {
			data: {
				text: 'CURRENT',
				style: {
					appearance: 'success',
				},
			},
		},
		versionNumber: {
			data: 1,
		},
	},
	{
		id: {
			data: 'ari:cloud:confluence:61ae97a3-2835-4727-82d6-3d6a055c39a9:page/841220097',
		},
		title: {
			data: {
				text: 'Forged Ipsum',
				url: 'https://at-perfpm.jira-dev.com/wiki/spaces/TEST/pages/841220097/Forged+Ipsum',
			},
		},
		space: {
			data: {
				url: 'https://at-perfpm.jira-dev.com/wiki/spaces/TEST',
			},
		},
		type: {
			data: {
				source:
					'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiByb2xlPSJwcmVzZW50YXRpb24iPjxwYXRoIGZpbGw9IiMyNjg0RkYiIGZpbGwtcnVsZT0iZXZlbm9kZCIgZD0iTTMgMGgxOGEzIDMgMCAwMTMgM3YxOGEzIDMgMCAwMS0zIDNIM2EzIDMgMCAwMS0zLTNWM2EzIDMgMCAwMTMtM3ptMSAxOGMwIC41NTYuNDQ2IDEgLjk5NSAxaDguMDFjLjU0IDAgLjk5NS0uNDQ4Ljk5NS0xIDAtLjU1Ni0uNDQ2LTEtLjk5NS0xaC04LjAxYy0uNTQgMC0uOTk1LjQ0OC0uOTk1IDF6bTAtNGMwIC41NTYuNDQ4IDEgMSAxaDE0Yy41NTUgMCAxLS40NDggMS0xIDAtLjU1Ni0uNDQ4LTEtMS0xSDVjLS41NTUgMC0xIC40NDgtMSAxem0wLTRjMCAuNTU2LjQ0OCAxIDEgMWgxNGMuNTU1IDAgMS0uNDQ4IDEtMSAwLS41NTYtLjQ0OC0xLTEtMUg1Yy0uNTU1IDAtMSAuNDQ4LTEgMXptMC00YzAgLjU1Ni40NDggMSAxIDFoMTRjLjU1NSAwIDEtLjQ0OCAxLTEgMC0uNTU2LS40NDgtMS0xLTFINWMtLjU1NSAwLTEgLjQ0OC0xIDF6Ij48L3BhdGg+PC9zdmc+',
			},
		},
		description: {
			data: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic",
		},
		updatedAt: {
			data: '2023-07-27T21:50:20+00:00',
		},
		status: {
			data: {
				text: 'CURRENT',
				style: {
					appearance: 'success',
				},
			},
		},
		updatedBy: {
			data: {
				displayName: 'Sergey Chebykin',
				avatarSource: profileBase64Image,
			},
		},
		ownedBy: {
			data: {
				displayName: 'Sergey Chebykin',
				avatarSource: profileBase64Image,
			},
		},
		createdBy: {
			data: {
				displayName: 'Sergey Chebykin',
				avatarSource: profileBase64Image,
			},
		},
		versionNumber: {
			data: 4,
		},
	},
	{
		id: {
			data: 'ari:cloud:confluence:61ae97a3-2835-4727-82d6-3d6a055c39a9:page/722665884',
		},
		title: {
			data: {
				text: 'Test restricted hierarchy',
				url: 'https://at-perfpm.jira-dev.com/wiki/spaces/TEST/pages/722665884/Test+restricted+hierarchy',
			},
		},
		space: {
			data: {
				url: 'https://at-perfpm.jira-dev.com/wiki/spaces/TEST',
			},
		},
		type: {
			data: {
				source:
					'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiByb2xlPSJwcmVzZW50YXRpb24iPjxwYXRoIGZpbGw9IiMyNjg0RkYiIGZpbGwtcnVsZT0iZXZlbm9kZCIgZD0iTTMgMGgxOGEzIDMgMCAwMTMgM3YxOGEzIDMgMCAwMS0zIDNIM2EzIDMgMCAwMS0zLTNWM2EzIDMgMCAwMTMtM3ptMSAxOGMwIC41NTYuNDQ2IDEgLjk5NSAxaDguMDFjLjU0IDAgLjk5NS0uNDQ4Ljk5NS0xIDAtLjU1Ni0uNDQ2LTEtLjk5NS0xaC04LjAxYy0uNTQgMC0uOTk1LjQ0OC0uOTk1IDF6bTAtNGMwIC41NTYuNDQ4IDEgMSAxaDE0Yy41NTUgMCAxLS40NDggMS0xIDAtLjU1Ni0uNDQ4LTEtMS0xSDVjLS41NTUgMC0xIC40NDgtMSAxem0wLTRjMCAuNTU2LjQ0OCAxIDEgMWgxNGMuNTU1IDAgMS0uNDQ4IDEtMSAwLS41NTYtLjQ0OC0xLTEtMUg1Yy0uNTU1IDAtMSAuNDQ4LTEgMXptMC00YzAgLjU1Ni40NDggMSAxIDFoMTRjLjU1NSAwIDEtLjQ0OCAxLTEgMC0uNTU2LS40NDgtMS0xLTFINWMtLjU1NSAwLTEgLjQ0OC0xIDF6Ij48L3BhdGg+PC9zdmc+',
			},
		},
		description: {
			data: "👋\n Hi, !\nWelcome to . We're glad you're here!\nI've put together this onboarding plan to help you get up to speed in your new role as a  on . Feel free to reach out if you have any questions 🙂\n​\nQuick links\nTechnical support\nPayroll and benefits\nPeople directory\n🧭\n Guiding thoughts\nTake time to learn. Don't get sucked",
		},
		updatedAt: {
			data: '2021-08-04T19:59:33+00:00',
		},
		status: {
			data: {
				text: 'CURRENT',
				style: {
					appearance: 'success',
				},
			},
		},
		updatedBy: {
			data: {
				displayName: 'Cherie Du',
				avatarSource: profileBase64Image,
			},
		},
		ownedBy: {
			data: {
				displayName: 'Cherie Du',
				avatarSource: profileBase64Image,
			},
		},
		createdBy: {
			data: {
				displayName: 'Cherie Du',
				avatarSource: profileBase64Image,
			},
		},
		versionNumber: {
			data: 2,
		},
	},
	{
		id: {
			data: 'ari:cloud:confluence:61ae97a3-2835-4727-82d6-3d6a055c39a9:page/804945921',
		},
		title: {
			data: {
				text: 'SSR Media Test',
				url: 'https://at-perfpm.jira-dev.com/wiki/spaces/TEST/pages/804945921/SSR+Media+Test',
			},
		},
		space: {
			data: {
				url: 'https://at-perfpm.jira-dev.com/wiki/spaces/TEST',
			},
		},
		type: {
			data: {
				source:
					'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiByb2xlPSJwcmVzZW50YXRpb24iPjxwYXRoIGZpbGw9IiMyNjg0RkYiIGZpbGwtcnVsZT0iZXZlbm9kZCIgZD0iTTMgMGgxOGEzIDMgMCAwMTMgM3YxOGEzIDMgMCAwMS0zIDNIM2EzIDMgMCAwMS0zLTNWM2EzIDMgMCAwMTMtM3ptMSAxOGMwIC41NTYuNDQ2IDEgLjk5NSAxaDguMDFjLjU0IDAgLjk5NS0uNDQ4Ljk5NS0xIDAtLjU1Ni0uNDQ2LTEtLjk5NS0xaC04LjAxYy0uNTQgMC0uOTk1LjQ0OC0uOTk1IDF6bTAtNGMwIC41NTYuNDQ4IDEgMSAxaDE0Yy41NTUgMCAxLS40NDggMS0xIDAtLjU1Ni0uNDQ4LTEtMS0xSDVjLS41NTUgMC0xIC40NDgtMSAxem0wLTRjMCAuNTU2LjQ0OCAxIDEgMWgxNGMuNTU1IDAgMS0uNDQ4IDEtMSAwLS41NTYtLjQ0OC0xLTEtMUg1Yy0uNTU1IDAtMSAuNDQ4LTEgMXptMC00YzAgLjU1Ni40NDggMSAxIDFoMTRjLjU1NSAwIDEtLjQ0OCAxLTEgMC0uNTU2LS40NDgtMS0xLTFINWMtLjU1NSAwLTEgLjQ0OC0xIDF6Ij48L3BhdGg+PC9zdmc+',
			},
		},
		description: {
			data: 'Hello!',
		},
		updatedAt: {
			data: '2021-12-07T00:07:12+00:00',
		},
		status: {
			data: {
				text: 'CURRENT',
				style: {
					appearance: 'success',
				},
			},
		},
		updatedBy: {
			data: {
				displayName: 'Stanislav Sysoev',
				avatarSource: profileBase64Image,
			},
		},
		ownedBy: {
			data: {
				displayName: 'Stanislav Sysoev',
				avatarSource: profileBase64Image,
			},
		},
		createdBy: {
			data: {
				displayName: 'Stanislav Sysoev',
				avatarSource: profileBase64Image,
			},
		},
		versionNumber: {
			data: 3,
		},
	},
	{
		id: {
			data: 'ari:cloud:confluence:61ae97a3-2835-4727-82d6-3d6a055c39a9:page/792592390',
		},
		title: {
			data: {
				text: 'test keyboard date picker',
				url: 'https://at-perfpm.jira-dev.com/wiki/spaces/TEST/pages/792592390/test+keyboard+date+picker',
			},
		},
		space: {
			data: {
				url: 'https://at-perfpm.jira-dev.com/wiki/spaces/TEST',
			},
		},
		type: {
			data: {
				source:
					'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiByb2xlPSJwcmVzZW50YXRpb24iPjxwYXRoIGZpbGw9IiMyNjg0RkYiIGZpbGwtcnVsZT0iZXZlbm9kZCIgZD0iTTMgMGgxOGEzIDMgMCAwMTMgM3YxOGEzIDMgMCAwMS0zIDNIM2EzIDMgMCAwMS0zLTNWM2EzIDMgMCAwMTMtM3ptMSAxOGMwIC41NTYuNDQ2IDEgLjk5NSAxaDguMDFjLjU0IDAgLjk5NS0uNDQ4Ljk5NS0xIDAtLjU1Ni0uNDQ2LTEtLjk5NS0xaC04LjAxYy0uNTQgMC0uOTk1LjQ0OC0uOTk1IDF6bTAtNGMwIC41NTYuNDQ4IDEgMSAxaDE0Yy41NTUgMCAxLS40NDggMS0xIDAtLjU1Ni0uNDQ4LTEtMS0xSDVjLS41NTUgMC0xIC40NDgtMSAxem0wLTRjMCAuNTU2LjQ0OCAxIDEgMWgxNGMuNTU1IDAgMS0uNDQ4IDEtMSAwLS41NTYtLjQ0OC0xLTEtMUg1Yy0uNTU1IDAtMSAuNDQ4LTEgMXptMC00YzAgLjU1Ni40NDggMSAxIDFoMTRjLjU1NSAwIDEtLjQ0OCAxLTEgMC0uNTU2LS40NDgtMS0xLTFINWMtLjU1NSAwLTEgLjQ0OC0xIDF6Ij48L3BhdGg+PC9zdmc+',
			},
		},
		description: {
			data: "👋\n Hi, !\nWelcome to . We're glad you're here!\nI've put together this onboarding plan to help you get up to speed in your new role as a  on . Feel free to reach out if you have any questions 🙂\n​\n2022-02-07 \nQuick links\nTechnical support\nPayroll and benefits\nPeople directory\n🧭\n Guiding thoughts\nTake time to learn. Don't",
		},
		updatedAt: {
			data: '2021-11-04T22:58:16+00:00',
		},
		status: {
			data: {
				text: 'CURRENT',
				style: {
					appearance: 'success',
				},
			},
		},
		updatedBy: {
			data: {
				displayName: 'Cherie Du',
				avatarSource: profileBase64Image,
			},
		},
		ownedBy: {
			data: {
				displayName: 'Cherie Du',
				avatarSource: profileBase64Image,
			},
		},
		createdBy: {
			data: {
				displayName: 'Cherie Du',
				avatarSource: profileBase64Image,
			},
		},
		versionNumber: {
			data: 1,
		},
	},
	{
		id: {
			data: 'ari:cloud:confluence:61ae97a3-2835-4727-82d6-3d6a055c39a9:page/813727799',
		},
		title: {
			data: {
				text: 'i have a title!',
				url: 'https://at-perfpm.jira-dev.com/wiki/spaces/TEST/pages/813727799',
			},
		},
		space: {
			data: {
				url: 'https://at-perfpm.jira-dev.com/wiki/spaces/TEST',
			},
		},
		type: {
			data: {
				source:
					'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiByb2xlPSJwcmVzZW50YXRpb24iPjxwYXRoIGZpbGw9IiMyNjg0RkYiIGZpbGwtcnVsZT0iZXZlbm9kZCIgZD0iTTMgMGgxOGEzIDMgMCAwMTMgM3YxOGEzIDMgMCAwMS0zIDNIM2EzIDMgMCAwMS0zLTNWM2EzIDMgMCAwMTMtM3ptMSAxOGMwIC41NTYuNDQ2IDEgLjk5NSAxaDguMDFjLjU0IDAgLjk5NS0uNDQ4Ljk5NS0xIDAtLjU1Ni0uNDQ2LTEtLjk5NS0xaC04LjAxYy0uNTQgMC0uOTk1LjQ0OC0uOTk1IDF6bTAtNGMwIC41NTYuNDQ4IDEgMSAxaDE0Yy41NTUgMCAxLS40NDggMS0xIDAtLjU1Ni0uNDQ4LTEtMS0xSDVjLS41NTUgMC0xIC40NDgtMSAxem0wLTRjMCAuNTU2LjQ0OCAxIDEgMWgxNGMuNTU1IDAgMS0uNDQ4IDEtMSAwLS41NTYtLjQ0OC0xLTEtMUg1Yy0uNTU1IDAtMSAuNDQ4LTEgMXptMC00YzAgLjU1Ni40NDggMSAxIDFoMTRjLjU1NSAwIDEtLjQ0OCAxLTEgMC0uNTU2LS40NDgtMS0xLTFINWMtLjU1NSAwLTEgLjQ0OC0xIDF6Ij48L3BhdGg+PC9zdmc+',
			},
		},
		description: {
			data: 'and a body! cool',
		},
		updatedAt: {
			data: '2022-03-10T21:50:18+00:00',
		},
		status: {
			data: {
				text: 'CURRENT',
				style: {
					appearance: 'success',
				},
			},
		},
		updatedBy: {
			data: {
				displayName: 'Alex Hixon',
				avatarSource: profileBase64Image,
			},
		},
		ownedBy: {
			data: {
				displayName: 'Alex Hixon',
				avatarSource: profileBase64Image,
			},
		},
		createdBy: {
			data: {
				displayName: 'Alex Hixon',
				avatarSource: profileBase64Image,
			},
		},
		versionNumber: {
			data: 3,
		},
	},
	{
		id: {
			data: 'ari:cloud:confluence:61ae97a3-2835-4727-82d6-3d6a055c39a9:page/722731223',
		},
		title: {
			data: {
				text: 'Tiny MCE Page',
				url: 'https://at-perfpm.jira-dev.com/wiki/spaces/TEST/pages/722731223/Tiny+MCE+Page',
			},
		},
		space: {
			data: {
				url: 'https://at-perfpm.jira-dev.com/wiki/spaces/TEST',
			},
		},
		type: {
			data: {
				source:
					'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiByb2xlPSJwcmVzZW50YXRpb24iPjxwYXRoIGZpbGw9IiMyNjg0RkYiIGZpbGwtcnVsZT0iZXZlbm9kZCIgZD0iTTMgMGgxOGEzIDMgMCAwMTMgM3YxOGEzIDMgMCAwMS0zIDNIM2EzIDMgMCAwMS0zLTNWM2EzIDMgMCAwMTMtM3ptMSAxOGMwIC41NTYuNDQ2IDEgLjk5NSAxaDguMDFjLjU0IDAgLjk5NS0uNDQ4Ljk5NS0xIDAtLjU1Ni0uNDQ2LTEtLjk5NS0xaC04LjAxYy0uNTQgMC0uOTk1LjQ0OC0uOTk1IDF6bTAtNGMwIC41NTYuNDQ4IDEgMSAxaDE0Yy41NTUgMCAxLS40NDggMS0xIDAtLjU1Ni0uNDQ4LTEtMS0xSDVjLS41NTUgMC0xIC40NDgtMSAxem0wLTRjMCAuNTU2LjQ0OCAxIDEgMWgxNGMuNTU1IDAgMS0uNDQ4IDEtMSAwLS41NTYtLjQ0OC0xLTEtMUg1Yy0uNTU1IDAtMSAuNDQ4LTEgMXptMC00YzAgLjU1Ni40NDggMSAxIDFoMTRjLjU1NSAwIDEtLjQ0OCAxLTEgMC0uNTU2LS40NDgtMS0xLTFINWMtLjU1NSAwLTEgLjQ0OC0xIDF6Ij48L3BhdGg+PC9zdmc+',
			},
		},
		description: {
			data: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In nec ipsum convallis, fermentum dui sed, luctus turpis. Duis ac risus ullamcorper, tempor leo efficitur, feugiat tellus. Pellentesque accumsan tincidunt iaculis. Donec vestibulum dignissim ligula, non rutrum leo molestie et. Orci varius natoque penatibus et magnis',
		},
		updatedAt: {
			data: '2021-08-04T16:21:26+00:00',
		},
		status: {
			data: {
				text: 'CURRENT',
				style: {
					appearance: 'success',
				},
			},
		},
		updatedBy: {
			data: {
				displayName: 'Gordie Johnson',
				avatarSource: profileBase64Image,
			},
		},
		ownedBy: {
			data: {
				displayName: 'Gordie Johnson',
				avatarSource: profileBase64Image,
			},
		},
		createdBy: {
			data: {
				displayName: 'Gordie Johnson',
				avatarSource: profileBase64Image,
			},
		},
		versionNumber: {
			data: 3,
		},
	},
	{
		id: {
			data: 'ari:cloud:confluence:61ae97a3-2835-4727-82d6-3d6a055c39a9:page/475496450',
		},
		title: {
			data: {
				text: 'Hector Media SSR test',
				url: 'https://at-perfpm.jira-dev.com/wiki/spaces/TEST/pages/475496450/Hector+Media+SSR+test',
			},
		},
		space: {
			data: {
				url: 'https://at-perfpm.jira-dev.com/wiki/spaces/TEST',
			},
		},
		type: {
			data: {
				source:
					'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiByb2xlPSJwcmVzZW50YXRpb24iPjxwYXRoIGZpbGw9IiMyNjg0RkYiIGZpbGwtcnVsZT0iZXZlbm9kZCIgZD0iTTMgMGgxOGEzIDMgMCAwMTMgM3YxOGEzIDMgMCAwMS0zIDNIM2EzIDMgMCAwMS0zLTNWM2EzIDMgMCAwMTMtM3ptMSAxOGMwIC41NTYuNDQ2IDEgLjk5NSAxaDguMDFjLjU0IDAgLjk5NS0uNDQ4Ljk5NS0xIDAtLjU1Ni0uNDQ2LTEtLjk5NS0xaC04LjAxYy0uNTQgMC0uOTk1LjQ0OC0uOTk1IDF6bTAtNGMwIC41NTYuNDQ4IDEgMSAxaDE0Yy41NTUgMCAxLS40NDggMS0xIDAtLjU1Ni0uNDQ4LTEtMS0xSDVjLS41NTUgMC0xIC40NDgtMSAxem0wLTRjMCAuNTU2LjQ0OCAxIDEgMWgxNGMuNTU1IDAgMS0uNDQ4IDEtMSAwLS41NTYtLjQ0OC0xLTEtMUg1Yy0uNTU1IDAtMSAuNDQ4LTEgMXptMC00YzAgLjU1Ni40NDggMSAxIDFoMTRjLjU1NSAwIDEtLjQ0OCAxLTEgMC0uNTU2LS40NDgtMS0xLTFINWMtLjU1NSAwLTEgLjQ0OC0xIDF6Ij48L3BhdGg+PC9zdmc+',
			},
		},
		description: {
			data: 'demo\nasdasda\nasd\nasd\nasd\nasd',
		},
		updatedAt: {
			data: '2021-04-22T23:53:00+00:00',
		},
		status: {
			data: {
				text: 'CURRENT',
				style: {
					appearance: 'success',
				},
			},
		},
		updatedBy: {
			data: {
				displayName: 'Hector Zarco Garcia',
				avatarSource: profileBase64Image,
			},
		},
		ownedBy: {
			data: {
				displayName: 'Hector Zarco Garcia',
				avatarSource: profileBase64Image,
			},
		},
		createdBy: {
			data: {
				displayName: 'Hector Zarco Garcia',
				avatarSource: profileBase64Image,
			},
		},
		versionNumber: {
			data: 2,
		},
	},
	{
		id: {
			data: 'ari:cloud:confluence:61ae97a3-2835-4727-82d6-3d6a055c39a9:page/795770881',
		},
		title: {
			data: {
				text: 'Test fabric macro page',
				url: 'https://at-perfpm.jira-dev.com/wiki/spaces/TEST/pages/795770881/Test+fabric+macro+page',
			},
		},
		space: {
			data: {
				url: 'https://at-perfpm.jira-dev.com/wiki/spaces/TEST',
			},
		},
		type: {
			data: {
				source:
					'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiByb2xlPSJwcmVzZW50YXRpb24iPjxwYXRoIGZpbGw9IiMyNjg0RkYiIGZpbGwtcnVsZT0iZXZlbm9kZCIgZD0iTTMgMGgxOGEzIDMgMCAwMTMgM3YxOGEzIDMgMCAwMS0zIDNIM2EzIDMgMCAwMS0zLTNWM2EzIDMgMCAwMTMtM3ptMSAxOGMwIC41NTYuNDQ2IDEgLjk5NSAxaDguMDFjLjU0IDAgLjk5NS0uNDQ4Ljk5NS0xIDAtLjU1Ni0uNDQ2LTEtLjk5NS0xaC04LjAxYy0uNTQgMC0uOTk1LjQ0OC0uOTk1IDF6bTAtNGMwIC41NTYuNDQ4IDEgMSAxaDE0Yy41NTUgMCAxLS40NDggMS0xIDAtLjU1Ni0uNDQ4LTEtMS0xSDVjLS41NTUgMC0xIC40NDgtMSAxem0wLTRjMCAuNTU2LjQ0OCAxIDEgMWgxNGMuNTU1IDAgMS0uNDQ4IDEtMSAwLS41NTYtLjQ0OC0xLTEtMUg1Yy0uNTU1IDAtMSAuNDQ4LTEgMXptMC00YzAgLjU1Ni40NDggMSAxIDFoMTRjLjU1NSAwIDEtLjQ0OCAxLTEgMC0uNTU2LS40NDgtMS0xLTFINWMtLjU1NSAwLTEgLjQ0OC0xIDF6Ij48L3BhdGg+PC9zdmc+',
			},
		},
		updatedAt: {
			data: '2021-11-10T22:07:38+00:00',
		},
		status: {
			data: {
				text: 'CURRENT',
				style: {
					appearance: 'success',
				},
			},
		},
		updatedBy: {
			data: {
				displayName: 'Harshita Mehta',
				avatarSource: profileBase64Image,
			},
		},
		ownedBy: {
			data: {
				displayName: 'Harshita Mehta',
				avatarSource: profileBase64Image,
			},
		},
		createdBy: {
			data: {
				displayName: 'Harshita Mehta',
				avatarSource: profileBase64Image,
			},
		},
		versionNumber: {
			data: 1,
		},
	},
	{
		id: {
			data: 'ari:cloud:confluence:61ae97a3-2835-4727-82d6-3d6a055c39a9:page/800555028',
		},
		title: {
			data: {
				text: 'Spaces list',
				url: 'https://at-perfpm.jira-dev.com/wiki/spaces/TEST/pages/800555028/Spaces+list',
			},
		},
		space: {
			data: {
				url: 'https://at-perfpm.jira-dev.com/wiki/spaces/TEST',
			},
		},
		type: {
			data: {
				source:
					'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiByb2xlPSJwcmVzZW50YXRpb24iPjxwYXRoIGZpbGw9IiMyNjg0RkYiIGZpbGwtcnVsZT0iZXZlbm9kZCIgZD0iTTMgMGgxOGEzIDMgMCAwMTMgM3YxOGEzIDMgMCAwMS0zIDNIM2EzIDMgMCAwMS0zLTNWM2EzIDMgMCAwMTMtM3ptMSAxOGMwIC41NTYuNDQ2IDEgLjk5NSAxaDguMDFjLjU0IDAgLjk5NS0uNDQ4Ljk5NS0xIDAtLjU1Ni0uNDQ2LTEtLjk5NS0xaC04LjAxYy0uNTQgMC0uOTk1LjQ0OC0uOTk1IDF6bTAtNGMwIC41NTYuNDQ4IDEgMSAxaDE0Yy41NTUgMCAxLS40NDggMS0xIDAtLjU1Ni0uNDQ4LTEtMS0xSDVjLS41NTUgMC0xIC40NDgtMSAxem0wLTRjMCAuNTU2LjQ0OCAxIDEgMWgxNGMuNTU1IDAgMS0uNDQ4IDEtMSAwLS41NTYtLjQ0OC0xLTEtMUg1Yy0uNTU1IDAtMSAuNDQ4LTEgMXptMC00YzAgLjU1Ni40NDggMSAxIDFoMTRjLjU1NSAwIDEtLjQ0OCAxLTEgMC0uNTU2LS40NDgtMS0xLTFINWMtLjU1NSAwLTEgLjQ0OC0xIDF6Ij48L3BhdGg+PC9zdmc+',
			},
		},
		updatedAt: {
			data: '2021-11-23T23:11:22+00:00',
		},
		status: {
			data: {
				text: 'CURRENT',
				style: {
					appearance: 'success',
				},
			},
		},
		updatedBy: {
			data: {
				displayName: 'Harshita Mehta',
				avatarSource: profileBase64Image,
			},
		},
		ownedBy: {
			data: {
				displayName: 'Harshita Mehta',
				avatarSource: profileBase64Image,
			},
		},
		createdBy: {
			data: {
				displayName: 'Harshita Mehta',
				avatarSource: profileBase64Image,
			},
		},
		versionNumber: {
			data: 1,
		},
	},
	{
		id: {
			data: 'ari:cloud:confluence:61ae97a3-2835-4727-82d6-3d6a055c39a9:page/990150713',
		},
		title: {
			data: {
				text: 'Sheava test page',
				url: 'https://at-perfpm.jira-dev.com/wiki/spaces/TEST/pages/990150713/Sheava+test+page',
			},
		},
		space: {
			data: {
				url: 'https://at-perfpm.jira-dev.com/wiki/spaces/TEST',
			},
		},
		type: {
			data: {
				source:
					'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiByb2xlPSJwcmVzZW50YXRpb24iPjxwYXRoIGZpbGw9IiMyNjg0RkYiIGZpbGwtcnVsZT0iZXZlbm9kZCIgZD0iTTMgMGgxOGEzIDMgMCAwMTMgM3YxOGEzIDMgMCAwMS0zIDNIM2EzIDMgMCAwMS0zLTNWM2EzIDMgMCAwMTMtM3ptMSAxOGMwIC41NTYuNDQ2IDEgLjk5NSAxaDguMDFjLjU0IDAgLjk5NS0uNDQ4Ljk5NS0xIDAtLjU1Ni0uNDQ2LTEtLjk5NS0xaC04LjAxYy0uNTQgMC0uOTk1LjQ0OC0uOTk1IDF6bTAtNGMwIC41NTYuNDQ4IDEgMSAxaDE0Yy41NTUgMCAxLS40NDggMS0xIDAtLjU1Ni0uNDQ4LTEtMS0xSDVjLS41NTUgMC0xIC40NDgtMSAxem0wLTRjMCAuNTU2LjQ0OCAxIDEgMWgxNGMuNTU1IDAgMS0uNDQ4IDEtMSAwLS41NTYtLjQ0OC0xLTEtMUg1Yy0uNTU1IDAtMSAuNDQ4LTEgMXptMC00YzAgLjU1Ni40NDggMSAxIDFoMTRjLjU1NSAwIDEtLjQ0OCAxLTEgMC0uNTU2LS40NDgtMS0xLTFINWMtLjU1NSAwLTEgLjQ0OC0xIDF6Ij48L3BhdGg+PC9zdmc+',
			},
		},
		updatedAt: {
			data: '2023-09-06T22:00:44+00:00',
		},
		status: {
			data: {
				text: 'CURRENT',
				style: {
					appearance: 'success',
				},
			},
		},
		updatedBy: {
			data: {
				displayName: 'Sheava Alqadhy',
				avatarSource: profileBase64Image,
			},
		},
		ownedBy: {
			data: {
				displayName: 'Sheava Alqadhy',
				avatarSource: profileBase64Image,
			},
		},
		createdBy: {
			data: {
				displayName: 'Sheava Alqadhy',
				avatarSource: profileBase64Image,
			},
		},
		versionNumber: {
			data: 1,
		},
	},
	{
		id: {
			data: 'ari:cloud:confluence:61ae97a3-2835-4727-82d6-3d6a055c39a9:page/971999227',
		},
		title: {
			data: {
				text: 'Tiny page tree',
				url: 'https://at-perfpm.jira-dev.com/wiki/spaces/TEST/pages/971999227/Tiny+page+tree',
			},
		},
		space: {
			data: {
				url: 'https://at-perfpm.jira-dev.com/wiki/spaces/TEST',
			},
		},
		type: {
			data: {
				source:
					'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiByb2xlPSJwcmVzZW50YXRpb24iPjxwYXRoIGZpbGw9IiMyNjg0RkYiIGZpbGwtcnVsZT0iZXZlbm9kZCIgZD0iTTMgMGgxOGEzIDMgMCAwMTMgM3YxOGEzIDMgMCAwMS0zIDNIM2EzIDMgMCAwMS0zLTNWM2EzIDMgMCAwMTMtM3ptMSAxOGMwIC41NTYuNDQ2IDEgLjk5NSAxaDguMDFjLjU0IDAgLjk5NS0uNDQ4Ljk5NS0xIDAtLjU1Ni0uNDQ2LTEtLjk5NS0xaC04LjAxYy0uNTQgMC0uOTk1LjQ0OC0uOTk1IDF6bTAtNGMwIC41NTYuNDQ4IDEgMSAxaDE0Yy41NTUgMCAxLS40NDggMS0xIDAtLjU1Ni0uNDQ4LTEtMS0xSDVjLS41NTUgMC0xIC40NDgtMSAxem0wLTRjMCAuNTU2LjQ0OCAxIDEgMWgxNGMuNTU1IDAgMS0uNDQ4IDEtMSAwLS41NTYtLjQ0OC0xLTEtMUg1Yy0uNTU1IDAtMSAuNDQ4LTEgMXptMC00YzAgLjU1Ni40NDggMSAxIDFoMTRjLjU1NSAwIDEtLjQ0OCAxLTEgMC0uNTU2LS40NDgtMS0xLTFINWMtLjU1NSAwLTEgLjQ0OC0xIDF6Ij48L3BhdGg+PC9zdmc+',
			},
		},
		updatedAt: {
			data: '2023-07-18T21:45:27+00:00',
		},
		status: {
			data: {
				text: 'CURRENT',
				style: {
					appearance: 'success',
				},
			},
		},
		updatedBy: {
			data: {
				displayName: 'Alexey Markevich',
				avatarSource: profileBase64Image,
			},
		},
		ownedBy: {
			data: {
				displayName: 'Alexey Markevich',
				avatarSource: profileBase64Image,
			},
		},
		createdBy: {
			data: {
				displayName: 'Alexey Markevich',
				avatarSource: profileBase64Image,
			},
		},
		versionNumber: {
			data: 1,
		},
	},
	{
		id: {
			data: 'ari:cloud:confluence:61ae97a3-2835-4727-82d6-3d6a055c39a9:page/912527484',
		},
		title: {
			data: {
				text: 'Anchor',
				url: 'https://at-perfpm.jira-dev.com/wiki/spaces/TEST/pages/912527484/Anchor',
			},
		},
		space: {
			data: {
				url: 'https://at-perfpm.jira-dev.com/wiki/spaces/TEST',
			},
		},
		type: {
			data: {
				source:
					'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiByb2xlPSJwcmVzZW50YXRpb24iPjxwYXRoIGZpbGw9IiMyNjg0RkYiIGZpbGwtcnVsZT0iZXZlbm9kZCIgZD0iTTMgMGgxOGEzIDMgMCAwMTMgM3YxOGEzIDMgMCAwMS0zIDNIM2EzIDMgMCAwMS0zLTNWM2EzIDMgMCAwMTMtM3ptMSAxOGMwIC41NTYuNDQ2IDEgLjk5NSAxaDguMDFjLjU0IDAgLjk5NS0uNDQ4Ljk5NS0xIDAtLjU1Ni0uNDQ2LTEtLjk5NS0xaC04LjAxYy0uNTQgMC0uOTk1LjQ0OC0uOTk1IDF6bTAtNGMwIC41NTYuNDQ4IDEgMSAxaDE0Yy41NTUgMCAxLS40NDggMS0xIDAtLjU1Ni0uNDQ4LTEtMS0xSDVjLS41NTUgMC0xIC40NDgtMSAxem0wLTRjMCAuNTU2LjQ0OCAxIDEgMWgxNGMuNTU1IDAgMS0uNDQ4IDEtMSAwLS41NTYtLjQ0OC0xLTEtMUg1Yy0uNTU1IDAtMSAuNDQ4LTEgMXptMC00YzAgLjU1Ni40NDggMSAxIDFoMTRjLjU1NSAwIDEtLjQ0OCAxLTEgMC0uNTU2LS40NDgtMS0xLTFINWMtLjU1NSAwLTEgLjQ0OC0xIDF6Ij48L3BhdGg+PC9zdmc+',
			},
		},
		description: {
			data: 'a\nb\n2\n3\nTest1  \nhttps://at-perfpm.jira-dev.com/wiki/spaces/TEST/pages/912527484/Anchor#Test1 \nAnchor | Test2  \nVivamus posuere ipsum vitae metus consectetur',
		},
		updatedAt: {
			data: '2023-05-24T17:06:56+00:00',
		},
		status: {
			data: {
				text: 'CURRENT',
				style: {
					appearance: 'success',
				},
			},
		},
		updatedBy: {
			data: {
				displayName: 'Alexey Markevich',
				avatarSource: profileBase64Image,
			},
		},
		ownedBy: {
			data: {
				displayName: 'Alexey Markevich',
				avatarSource: profileBase64Image,
			},
		},
		createdBy: {
			data: {
				displayName: 'Alexey Markevich',
				avatarSource: profileBase64Image,
			},
		},
		versionNumber: {
			data: 8,
		},
	},
	{
		id: {
			data: 'ari:cloud:confluence:61ae97a3-2835-4727-82d6-3d6a055c39a9:page/924877222',
		},
		title: {
			data: {
				text: 'Jira roadmap 2',
				url: 'https://at-perfpm.jira-dev.com/wiki/spaces/TEST/pages/924877222/Jira+roadmap+2',
			},
		},
		space: {
			data: {
				url: 'https://at-perfpm.jira-dev.com/wiki/spaces/TEST',
			},
		},
		type: {
			data: {
				source:
					'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiByb2xlPSJwcmVzZW50YXRpb24iPjxwYXRoIGZpbGw9IiMyNjg0RkYiIGZpbGwtcnVsZT0iZXZlbm9kZCIgZD0iTTMgMGgxOGEzIDMgMCAwMTMgM3YxOGEzIDMgMCAwMS0zIDNIM2EzIDMgMCAwMS0zLTNWM2EzIDMgMCAwMTMtM3ptMSAxOGMwIC41NTYuNDQ2IDEgLjk5NSAxaDguMDFjLjU0IDAgLjk5NS0uNDQ4Ljk5NS0xIDAtLjU1Ni0uNDQ2LTEtLjk5NS0xaC04LjAxYy0uNTQgMC0uOTk1LjQ0OC0uOTk1IDF6bTAtNGMwIC41NTYuNDQ4IDEgMSAxaDE0Yy41NTUgMCAxLS40NDggMS0xIDAtLjU1Ni0uNDQ4LTEtMS0xSDVjLS41NTUgMC0xIC40NDgtMSAxem0wLTRjMCAuNTU2LjQ0OCAxIDEgMWgxNGMuNTU1IDAgMS0uNDQ4IDEtMSAwLS41NTYtLjQ0OC0xLTEtMUg1Yy0uNTU1IDAtMSAuNDQ4LTEgMXptMC00YzAgLjU1Ni40NDggMSAxIDFoMTRjLjU1NSAwIDEtLjQ0OCAxLTEgMC0uNTU2LS40NDgtMS0xLTFINWMtLjU1NSAwLTEgLjQ0OC0xIDF6Ij48L3BhdGg+PC9zdmc+',
			},
		},
		description: {
			data: 'Version published after converting to the new editor',
		},
		updatedAt: {
			data: '2023-05-24T20:32:50+00:00',
		},
		status: {
			data: {
				text: 'CURRENT',
				style: {
					appearance: 'success',
				},
			},
		},
		updatedBy: {
			data: {
				displayName: 'Alexey Markevich',
				avatarSource: profileBase64Image,
			},
		},
		ownedBy: {
			data: {
				displayName: 'Alexey Markevich',
				avatarSource: profileBase64Image,
			},
		},
		createdBy: {
			data: {
				displayName: 'Alexey Markevich',
				avatarSource: profileBase64Image,
			},
		},
		versionNumber: {
			data: 6,
		},
	},
	{
		id: {
			data: 'ari:cloud:confluence:61ae97a3-2835-4727-82d6-3d6a055c39a9:page/923437980',
		},
		title: {
			data: {
				text: 'Jira roadmap',
				url: 'https://at-perfpm.jira-dev.com/wiki/spaces/TEST/pages/923437980/Jira+roadmap',
			},
		},
		space: {
			data: {
				url: 'https://at-perfpm.jira-dev.com/wiki/spaces/TEST',
			},
		},
		type: {
			data: {
				source:
					'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiByb2xlPSJwcmVzZW50YXRpb24iPjxwYXRoIGZpbGw9IiMyNjg0RkYiIGZpbGwtcnVsZT0iZXZlbm9kZCIgZD0iTTMgMGgxOGEzIDMgMCAwMTMgM3YxOGEzIDMgMCAwMS0zIDNIM2EzIDMgMCAwMS0zLTNWM2EzIDMgMCAwMTMtM3ptMSAxOGMwIC41NTYuNDQ2IDEgLjk5NSAxaDguMDFjLjU0IDAgLjk5NS0uNDQ4Ljk5NS0xIDAtLjU1Ni0uNDQ2LTEtLjk5NS0xaC04LjAxYy0uNTQgMC0uOTk1LjQ0OC0uOTk1IDF6bTAtNGMwIC41NTYuNDQ4IDEgMSAxaDE0Yy41NTUgMCAxLS40NDggMS0xIDAtLjU1Ni0uNDQ4LTEtMS0xSDVjLS41NTUgMC0xIC40NDgtMSAxem0wLTRjMCAuNTU2LjQ0OCAxIDEgMWgxNGMuNTU1IDAgMS0uNDQ4IDEtMSAwLS41NTYtLjQ0OC0xLTEtMUg1Yy0uNTU1IDAtMSAuNDQ4LTEgMXptMC00YzAgLjU1Ni40NDggMSAxIDFoMTRjLjU1NSAwIDEtLjQ0OCAxLTEgMC0uNTU2LS40NDgtMS0xLTFINWMtLjU1NSAwLTEgLjQ0OC0xIDF6Ij48L3BhdGg+PC9zdmc+',
			},
		},
		updatedAt: {
			data: '2023-05-24T20:13:10+00:00',
		},
		status: {
			data: {
				text: 'CURRENT',
				style: {
					appearance: 'success',
				},
			},
		},
		updatedBy: {
			data: {
				displayName: 'Alexey Markevich',
				avatarSource: profileBase64Image,
			},
		},
		ownedBy: {
			data: {
				displayName: 'Alexey Markevich',
				avatarSource: profileBase64Image,
			},
		},
		createdBy: {
			data: {
				displayName: 'Alexey Markevich',
				avatarSource: profileBase64Image,
			},
		},
		versionNumber: {
			data: 2,
		},
	},
	{
		id: {
			data: 'ari:cloud:confluence:61ae97a3-2835-4727-82d6-3d6a055c39a9:page/927405905',
		},
		title: {
			data: {
				text: 'Framed Macros',
				url: 'https://at-perfpm.jira-dev.com/wiki/spaces/TEST/pages/927405905/Framed+Macros',
			},
		},
		space: {
			data: {
				url: 'https://at-perfpm.jira-dev.com/wiki/spaces/TEST',
			},
		},
		type: {
			data: {
				source:
					'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiByb2xlPSJwcmVzZW50YXRpb24iPjxwYXRoIGZpbGw9IiMyNjg0RkYiIGZpbGwtcnVsZT0iZXZlbm9kZCIgZD0iTTMgMGgxOGEzIDMgMCAwMTMgM3YxOGEzIDMgMCAwMS0zIDNIM2EzIDMgMCAwMS0zLTNWM2EzIDMgMCAwMTMtM3ptMSAxOGMwIC41NTYuNDQ2IDEgLjk5NSAxaDguMDFjLjU0IDAgLjk5NS0uNDQ4Ljk5NS0xIDAtLjU1Ni0uNDQ2LTEtLjk5NS0xaC04LjAxYy0uNTQgMC0uOTk1LjQ0OC0uOTk1IDF6bTAtNGMwIC41NTYuNDQ4IDEgMSAxaDE0Yy41NTUgMCAxLS40NDggMS0xIDAtLjU1Ni0uNDQ4LTEtMS0xSDVjLS41NTUgMC0xIC40NDgtMSAxem0wLTRjMCAuNTU2LjQ0OCAxIDEgMWgxNGMuNTU1IDAgMS0uNDQ4IDEtMSAwLS41NTYtLjQ0OC0xLTEtMUg1Yy0uNTU1IDAtMSAuNDQ4LTEgMXptMC00YzAgLjU1Ni40NDggMSAxIDFoMTRjLjU1NSAwIDEtLjQ0OCAxLTEgMC0uNTU2LS40NDgtMS0xLTFINWMtLjU1NSAwLTEgLjQ0OC0xIDF6Ij48L3BhdGg+PC9zdmc+',
			},
		},
		description: {
			data: 'Profile pic:\nWidget connector:\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ac faucibus metus. Nulla facilisi. Fusce porttitor, nibh vel posuere bibendum, ex lorem vestibulum ipsum, quis porttitor nulla ex vel sem. Nullam vel justo eu velit bibendum placerat. Sed tristique, massa vel vestibulum placerat,',
		},
		updatedAt: {
			data: '2023-06-05T18:20:10+00:00',
		},
		status: {
			data: {
				text: 'CURRENT',
				style: {
					appearance: 'success',
				},
			},
		},
		updatedBy: {
			data: {
				displayName: 'Sergey Chebykin',
				avatarSource: profileBase64Image,
			},
		},
		ownedBy: {
			data: {
				displayName: 'Sergey Chebykin',
				avatarSource: profileBase64Image,
			},
		},
		createdBy: {
			data: {
				displayName: 'Sergey Chebykin',
				avatarSource: profileBase64Image,
			},
		},
		versionNumber: {
			data: 2,
		},
	},
	{
		id: {
			data: 'ari:cloud:confluence:61ae97a3-2835-4727-82d6-3d6a055c39a9:page/923337724',
		},
		title: {
			data: {
				text: 'Chart',
				url: 'https://at-perfpm.jira-dev.com/wiki/spaces/TEST/pages/923337724/Chart',
			},
		},
		space: {
			data: {
				url: 'https://at-perfpm.jira-dev.com/wiki/spaces/TEST',
			},
		},
		type: {
			data: {
				source:
					'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiByb2xlPSJwcmVzZW50YXRpb24iPjxwYXRoIGZpbGw9IiMyNjg0RkYiIGZpbGwtcnVsZT0iZXZlbm9kZCIgZD0iTTMgMGgxOGEzIDMgMCAwMTMgM3YxOGEzIDMgMCAwMS0zIDNIM2EzIDMgMCAwMS0zLTNWM2EzIDMgMCAwMTMtM3ptMSAxOGMwIC41NTYuNDQ2IDEgLjk5NSAxaDguMDFjLjU0IDAgLjk5NS0uNDQ4Ljk5NS0xIDAtLjU1Ni0uNDQ2LTEtLjk5NS0xaC04LjAxYy0uNTQgMC0uOTk1LjQ0OC0uOTk1IDF6bTAtNGMwIC41NTYuNDQ4IDEgMSAxaDE0Yy41NTUgMCAxLS40NDggMS0xIDAtLjU1Ni0uNDQ4LTEtMS0xSDVjLS41NTUgMC0xIC40NDgtMSAxem0wLTRjMCAuNTU2LjQ0OCAxIDEgMWgxNGMuNTU1IDAgMS0uNDQ4IDEtMSAwLS41NTYtLjQ0OC0xLTEtMUg1Yy0uNTU1IDAtMSAuNDQ4LTEgMXptMC00YzAgLjU1Ni40NDggMSAxIDFoMTRjLjU1NSAwIDEtLjQ0OCAxLTEgMC0uNTU2LS40NDgtMS0xLTFINWMtLjU1NSAwLTEgLjQ0OC0xIDF6Ij48L3BhdGg+PC9zdmc+',
			},
		},
		description: {
			data: 'a\nb\n1\n2\n4\n5\n pp',
		},
		updatedAt: {
			data: '2023-05-24T21:09:32+00:00',
		},
		status: {
			data: {
				text: 'CURRENT',
				style: {
					appearance: 'success',
				},
			},
		},
		updatedBy: {
			data: {
				displayName: 'Alexey Markevich',
				avatarSource: profileBase64Image,
			},
		},
		ownedBy: {
			data: {
				displayName: 'Alexey Markevich',
				avatarSource: profileBase64Image,
			},
		},
		createdBy: {
			data: {
				displayName: 'Alexey Markevich',
				avatarSource: profileBase64Image,
			},
		},
		versionNumber: {
			data: 13,
		},
	},
	{
		id: {
			data: 'ari:cloud:confluence:61ae97a3-2835-4727-82d6-3d6a055c39a9:page/990150702',
		},
		title: {
			data: {
				text: 'Another one 123 - sheava',
				url: 'https://at-perfpm.jira-dev.com/wiki/spaces/TEST/pages/990150702/Another+one+123+-+sheava',
			},
		},
		space: {
			data: {
				url: 'https://at-perfpm.jira-dev.com/wiki/spaces/TEST',
			},
		},
		type: {
			data: {
				source:
					'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiByb2xlPSJwcmVzZW50YXRpb24iPjxwYXRoIGZpbGw9IiMyNjg0RkYiIGZpbGwtcnVsZT0iZXZlbm9kZCIgZD0iTTMgMGgxOGEzIDMgMCAwMTMgM3YxOGEzIDMgMCAwMS0zIDNIM2EzIDMgMCAwMS0zLTNWM2EzIDMgMCAwMTMtM3ptMSAxOGMwIC41NTYuNDQ2IDEgLjk5NSAxaDguMDFjLjU0IDAgLjk5NS0uNDQ4Ljk5NS0xIDAtLjU1Ni0uNDQ2LTEtLjk5NS0xaC04LjAxYy0uNTQgMC0uOTk1LjQ0OC0uOTk1IDF6bTAtNGMwIC41NTYuNDQ4IDEgMSAxaDE0Yy41NTUgMCAxLS40NDggMS0xIDAtLjU1Ni0uNDQ4LTEtMS0xSDVjLS41NTUgMC0xIC40NDgtMSAxem0wLTRjMCAuNTU2LjQ0OCAxIDEgMWgxNGMuNTU1IDAgMS0uNDQ4IDEtMSAwLS41NTYtLjQ0OC0xLTEtMUg1Yy0uNTU1IDAtMSAuNDQ4LTEgMXptMC00YzAgLjU1Ni40NDggMSAxIDFoMTRjLjU1NSAwIDEtLjQ0OCAxLTEgMC0uNTU2LS40NDgtMS0xLTFINWMtLjU1NSAwLTEgLjQ0OC0xIDF6Ij48L3BhdGg+PC9zdmc+',
			},
		},
		updatedAt: {
			data: '2023-09-06T22:00:26+00:00',
		},
		status: {
			data: {
				text: 'CURRENT',
				style: {
					appearance: 'success',
				},
			},
		},
		updatedBy: {
			data: {
				displayName: 'Sheava Alqadhy',
				avatarSource: profileBase64Image,
			},
		},
		ownedBy: {
			data: {
				displayName: 'Sheava Alqadhy',
				avatarSource: profileBase64Image,
			},
		},
		createdBy: {
			data: {
				displayName: 'Sheava Alqadhy',
				avatarSource: profileBase64Image,
			},
		},
		versionNumber: {
			data: 1,
		},
	},
	{
		id: {
			data: 'ari:cloud:confluence:61ae97a3-2835-4727-82d6-3d6a055c39a9:page/990183921',
		},
		title: {
			data: {
				text: 'Another one - sheava',
				url: 'https://at-perfpm.jira-dev.com/wiki/spaces/TEST/pages/990183921/Another+one+-+sheava',
			},
		},
		space: {
			data: {
				url: 'https://at-perfpm.jira-dev.com/wiki/spaces/TEST',
			},
		},
		type: {
			data: {
				source:
					'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiByb2xlPSJwcmVzZW50YXRpb24iPjxwYXRoIGZpbGw9IiMyNjg0RkYiIGZpbGwtcnVsZT0iZXZlbm9kZCIgZD0iTTMgMGgxOGEzIDMgMCAwMTMgM3YxOGEzIDMgMCAwMS0zIDNIM2EzIDMgMCAwMS0zLTNWM2EzIDMgMCAwMTMtM3ptMSAxOGMwIC41NTYuNDQ2IDEgLjk5NSAxaDguMDFjLjU0IDAgLjk5NS0uNDQ4Ljk5NS0xIDAtLjU1Ni0uNDQ2LTEtLjk5NS0xaC04LjAxYy0uNTQgMC0uOTk1LjQ0OC0uOTk1IDF6bTAtNGMwIC41NTYuNDQ4IDEgMSAxaDE0Yy41NTUgMCAxLS40NDggMS0xIDAtLjU1Ni0uNDQ4LTEtMS0xSDVjLS41NTUgMC0xIC40NDgtMSAxem0wLTRjMCAuNTU2LjQ0OCAxIDEgMWgxNGMuNTU1IDAgMS0uNDQ4IDEtMSAwLS41NTYtLjQ0OC0xLTEtMUg1Yy0uNTU1IDAtMSAuNDQ4LTEgMXptMC00YzAgLjU1Ni40NDggMSAxIDFoMTRjLjU1NSAwIDEtLjQ0OCAxLTEgMC0uNTU2LS40NDgtMS0xLTFINWMtLjU1NSAwLTEgLjQ0OC0xIDF6Ij48L3BhdGg+PC9zdmc+',
			},
		},
		description: {
			data: 'awefwaefawe',
		},
		updatedAt: {
			data: '2023-09-06T22:00:08+00:00',
		},
		status: {
			data: {
				text: 'CURRENT',
				style: {
					appearance: 'success',
				},
			},
		},
		updatedBy: {
			data: {
				displayName: 'Sheava Alqadhy',
				avatarSource: profileBase64Image,
			},
		},
		ownedBy: {
			data: {
				displayName: 'Sheava Alqadhy',
				avatarSource: profileBase64Image,
			},
		},
		createdBy: {
			data: {
				displayName: 'Sheava Alqadhy',
				avatarSource: profileBase64Image,
			},
		},
		versionNumber: {
			data: 1,
		},
	},
];

export const mockConfluenceData = {
	nextPageCursor: '_f_MjA=_sa_WyJkdW1teS1zb3J0LXZhbHVlcyJd',
	totalIssues: 1357,
	data: mockData,
};
