export const MEDIA_CDN_MAP: { [key: string]: string } = {
	'api.media.atlassian.com': 'media-cdn.atlassian.com',
	'media.staging.atl-paas.net': 'media-cdn.stg.atlassian.com',
};

// Cloudfront has a hard limit of 8,192 bytes
// https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/cloudfront-limits.html
// Assuming other parts of the URL make up a max of ~1000 (in reality it's lower), the token can be ~7000
export const MEDIA_TOKEN_LENGTH_LIMIT: any = 7000;

export { isCDNEnabled } from './isCDNEnabled';
