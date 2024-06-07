// These imports are not included in the manifest file to avoid circular package dependencies blocking our Typescript and bundling tooling
// eslint-disable-next-line import/no-extraneous-dependencies
import {
	userPickerData,
	userPickerTeamData,
	userPickerCustomData,
} from '@atlaskit/util-data-test/user-picker';
import { type OptionData } from '../src/types';

export const isTesting = () => typeof jest !== 'undefined';

const mockAvatarUrl =
	'data:image/png;base64,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V7ABXxGOG+mh87AZv4e9tRifhW8Rtx9/pYP3FFjC2Ie/lsz2rRU1EyDFqM34kF6CqJMwin8S8jY1SX8JC1KA1IWvFzJMrZ3O0EMlTOEaXIXiQozPIk9VS+KBNbgCb1jsdXqoG0X8F96OQws1PvURgJAfuAavavebWKK4HW/ELhYm/SUsaupj6kZ78R78sN1vYgliC/5UHcanTulOKcHzBCW4sN1vZYlgB94spOkXbXzq3Ck8deMf421SK056aBp2CO+6buPTgK3iUw3YLrCy1x00D1uEd3wX9RufBp0VUKYEbxHSxr2UceNQFAK+N2mQ55fQsPUvqQY9kDT0q3p5gkZgUhjqvVGyqWejjE+DTwspGx28C5/C8GKv14McPiuM8+uK9quhaQmcZIQwiNcLpeSnNOteGcV+/KOQ4RtrtOFLaGoGLyFBhJfiY7hYFx5T22JM4W6h6Ha7sqVcjUbTU7ipXMF6fECIYk9t9n27FMNCPf8fJFW9ZhqfFubwEyIM4LX4W7xATw1KmMK9QkXvRow32/AltLSIU1ZDeB/+WFCGpYzHhQmcnxB272q616fRlipeQoR+XIQP4nJdeIZxnRgVNub6uDB7d6KVhi+hbWXclBqswKsFRbgw+TnLGBNm7f6rsGhjhNZ6fRptr+OniLAar8E7cb7sKUJO2ILnC/hvyXKtdhm+hLYToIQUEVbhUrwDL8HaTmrnQh9LWJV7tzCevyn5ue2GL6EzWpFCigjL8VwhBfrLeIbuOep+DI8IK6yvFTw/R+cYvoTOak0ZEjLEWCckkf5Q6B7O1nlkGBNm5m4XduK4TVhTOdVpRk+jc1uWQkoVBoRh4/nC0qfz8GSclvyulZgU5Hy3MIb/llCmPSDZh6+TDV9C57ewAlLKsBpnCqOHy4Ru4gyBECuxTP0Fr6JwwNKoYPADeFDYb+9u4bSVYzrc06uh+1pchpQ6xMKmVmsElThHyDOcK3QhawRSLBeIMeAEOQrCTqnjwrY4I8Ju2o8Lx+rdLRj9IA4lv29qjr5V+H/I3NWc3zwu3gAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyMC0wNy0xN1QxMjoyNzozOCswMDowMMZ+YY4AAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjAtMDctMTdUMTI6Mjc6MzgrMDA6MDC3I9kyAAAAIHRFWHRzb2Z0d2FyZQBodHRwczovL2ltYWdlbWFnaWNrLm9yZ7zPHZ0AAAAYdEVYdFRodW1iOjpEb2N1bWVudDo6UGFnZXMAMaf/uy8AAAAYdEVYdFRodW1iOjpJbWFnZTo6SGVpZ2h0ADUxMo+NU4EAAAAXdEVYdFRodW1iOjpJbWFnZTo6V2lkdGgANTEyHHwD3AAAABl0RVh0VGh1bWI6Ok1pbWV0eXBlAGltYWdlL3BuZz+yVk4AAAAXdEVYdFRodW1iOjpNVGltZQAxNTk0OTg4ODU4f/ZjtwAAABN0RVh0VGh1bWI6OlNpemUAMTgzNzVCQiX2ZgQAAABKdEVYdFRodW1iOjpVUkkAZmlsZTovLy4vdXBsb2Fkcy81Ni9CZWlIMjZTLzI0MjkvYXRsYXNzaWFuX2xvZ29faWNvbl8xNDczMTcucG5n5LbRvwAAAABJRU5ErkJggg==';

const userPickerDataWithAvatar = userPickerData.map((userOption: any) => ({
	...userOption,
	avatarUrl: mockAvatarUrl,
}));

// Exclude avatarUrl to workaround SSR issue with Avatar at this point in time
const ssrExampleOptions = userPickerData.map((u: any) => ({
	...u,
	avatarUrl: undefined,
})) as OptionData[];

const testOptions = isTesting() ? ssrExampleOptions : (userPickerDataWithAvatar as OptionData[]);

export const exampleOptions = testOptions.concat(userPickerTeamData).concat(userPickerCustomData);

export const unassigned = { id: 'unassign', name: 'Unassigned' };
export const assignToMe = { id: 'assign-me', name: 'Assign to me' };

export const filterUsers = (searchText: string): OptionData[] =>
	exampleOptions.filter((user) => user.name.toLowerCase().indexOf(searchText.toLowerCase()) !== -1);
