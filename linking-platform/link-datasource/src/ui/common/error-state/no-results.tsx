/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useEffect } from 'react';

import { cssMap, jsx } from '@compiled/react';
import { FormattedMessage, useIntl } from 'react-intl-next';

import Button from '@atlaskit/button/standard-button';
import { fg } from '@atlaskit/platform-feature-flags';
import { Grid, Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { useDatasourceAnalyticsEvents } from '../../../analytics';
import { SpotSearchNoResult } from '../../../common/ui/spot/error-state/search-no-result';

import { loadingErrorMessages } from './messages';
import { NoResultsOld } from './no-results-old';

const styles = cssMap({
	noResultsContainerStyles: {
		marginTop: token('space.500'),
		marginRight: token('space.500'),
		marginBottom: token('space.500'),
		marginLeft: token('space.500'),
		gap: token('space.300'),
		placeItems: 'center',
		placeSelf: 'center',
	},
	noResultsMessageContainerStyles: {
		gap: token('space.100'),
		placeItems: 'center',
	},
});

interface NoResultsProps {
	onRefresh?: () => void;
}

const noop = () => '';
export const NoResultsNew = ({ onRefresh }: NoResultsProps) => {
	const { fireEvent } = useDatasourceAnalyticsEvents();

	const { formatMessage } = fg('bandicoots-update-sllv-icons')
		? // eslint-disable-next-line react-hooks/rules-of-hooks
			useIntl()
		: { formatMessage: noop };

	useEffect(() => {
		fireEvent('ui.emptyResult.shown.datasource', {});
	}, [fireEvent]);

	return (
		<Grid xcss={styles.noResultsContainerStyles} testId="datasource-modal--no-results">
			{fg('bandicoots-update-sllv-icons') ? (
				<SpotSearchNoResult
					size={'xlarge'}
					alt={formatMessage(loadingErrorMessages.noResultsFound)}
				/>
			) : (
				<svg
					width="131"
					height="120"
					viewBox="0 0 131 120"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<g clipPath="url(#clip0_4923_331211)">
						<rect width="130.927" height="120" fill="white" fillOpacity="0.01" />
						<path
							opacity="0.3"
							d="M66.5381 119.968C65.9503 119.987 65.3626 120 64.7748 120.006C63.9532 120.013 63.2832 119.349 63.2832 118.527C63.2769 117.725 63.9153 117.061 64.7179 117.036C64.7306 117.036 64.7495 117.036 64.7622 117.036C68.51 117.017 72.3147 116.612 75.974 115.835C76.7767 115.664 77.5667 116.176 77.7374 116.979C77.908 117.782 77.3961 118.572 76.5934 118.742C73.3006 119.431 69.9194 119.848 66.5381 119.968Z"
							fill="#B3BAC5"
						/>
						<path
							opacity="0.3"
							d="M56.7356 119.469C56.6535 119.469 56.565 119.469 56.4765 119.456C52.5454 118.913 48.6648 117.959 44.9296 116.619C44.1586 116.341 43.7541 115.494 44.0322 114.716C44.3103 113.945 45.1635 113.541 45.9345 113.819C49.4738 115.089 53.1521 115.993 56.881 116.505C57.6963 116.619 58.2651 117.365 58.1513 118.18C58.0565 118.913 57.4435 119.444 56.7356 119.469Z"
							fill="#B3BAC5"
						/>
						<path
							opacity="0.3"
							d="M84.1081 116.518C83.4824 116.537 82.8883 116.164 82.6608 115.544C82.3764 114.773 82.7682 113.92 83.5393 113.636C87.0659 112.334 90.4661 110.659 93.6578 108.662C94.353 108.226 95.2694 108.434 95.7055 109.129C96.1416 109.825 95.933 110.741 95.2378 111.177C91.8755 113.282 88.2857 115.051 84.5758 116.423C84.4178 116.486 84.2661 116.511 84.1081 116.518Z"
							fill="#B3BAC5"
						/>
						<path
							opacity="0.3"
							d="M38.0786 113.427C37.8258 113.433 37.5667 113.383 37.3329 113.256C33.8378 111.398 30.5135 109.167 27.4672 106.633C26.8352 106.108 26.7467 105.173 27.2713 104.541C27.7958 103.909 28.7312 103.821 29.3632 104.345C32.2578 106.753 35.4052 108.864 38.7233 110.627C39.4501 111.013 39.7219 111.91 39.3363 112.637C39.0772 113.13 38.5906 113.414 38.0786 113.427Z"
							fill="#B3BAC5"
						/>
						<path
							opacity="0.3"
							d="M22.6197 101.368C22.1963 101.381 21.7665 101.217 21.4631 100.882C18.8024 97.9365 16.4387 94.7132 14.4415 91.294C14.0244 90.5862 14.2645 89.6761 14.9724 89.2589C15.6802 88.8418 16.5903 89.082 17.0075 89.7898C18.9035 93.0321 21.1471 96.091 23.6689 98.8845C24.2187 99.4912 24.1745 100.433 23.5614 100.983C23.2897 101.229 22.9547 101.356 22.6197 101.368Z"
							fill="#B3BAC5"
						/>
						<path
							opacity="0.3"
							d="M113.572 91.5468C113.307 91.5532 113.029 91.4963 112.782 91.3509C112.068 90.9401 111.822 90.0363 112.233 89.3222C114.103 86.0547 115.639 82.5849 116.796 79.0141C117.049 78.2304 117.889 77.8069 118.666 78.0597C119.45 78.3125 119.874 79.1531 119.621 79.9305C118.401 83.6973 116.777 87.3503 114.805 90.7948C114.546 91.2624 114.072 91.5279 113.572 91.5468Z"
							fill="#B3BAC5"
						/>
						<path
							opacity="0.3"
							d="M12.1978 84.7717C11.5911 84.7907 11.0096 84.4367 10.7695 83.8426C9.27792 80.1707 8.16558 76.3343 7.46405 72.4285C7.31868 71.6195 7.85589 70.8485 8.66487 70.7031C9.47384 70.5578 10.2449 71.095 10.3903 71.9039C11.0602 75.6075 12.1157 79.2479 13.525 82.7303C13.8347 83.4887 13.4682 84.3609 12.7034 84.6643C12.5391 84.7275 12.3685 84.7654 12.1978 84.7717Z"
							fill="#B3BAC5"
						/>
						<path
							opacity="0.3"
							d="M120.202 73.0858C120.101 73.0921 120 73.0858 119.899 73.0668C119.09 72.9278 118.546 72.1631 118.685 71.3541C119.317 67.6631 119.564 63.8774 119.431 60.1043L119.425 59.9779C119.393 59.1563 120.038 58.4674 120.86 58.4421C121.681 58.4105 122.37 59.0551 122.395 59.8768L122.402 60.0032C122.541 63.9785 122.275 67.9665 121.612 71.8597C121.492 72.5612 120.891 73.0605 120.202 73.0858Z"
							fill="#B3BAC5"
						/>
						<path
							opacity="0.3"
							d="M8.10236 65.5648C7.28074 65.5964 6.59185 64.9834 6.56657 64.1618V64.0986C6.42752 60.1422 6.68665 56.1732 7.34394 52.3052C7.48298 51.4963 8.24772 50.9527 9.05669 51.0855C9.86567 51.2245 10.4092 51.9892 10.2765 52.7982C9.6571 56.4702 9.4043 60.237 9.53702 63.9848C9.56862 64.8128 8.92397 65.5332 8.10236 65.5648Z"
							fill="#B3BAC5"
						/>
						<path
							opacity="0.3"
							d="M120.082 53.3607C119.355 53.386 118.704 52.8741 118.572 52.1409C117.895 48.4373 116.84 44.797 115.424 41.3209C115.115 40.5625 115.481 39.6903 116.24 39.3806C116.998 39.0709 117.87 39.4375 118.18 40.1959C119.671 43.8616 120.79 47.7042 121.498 51.6101C121.643 52.419 121.112 53.1901 120.303 53.3418C120.228 53.3481 120.158 53.3544 120.082 53.3607Z"
							fill="#B3BAC5"
						/>
						<path
							opacity="0.3"
							d="M10.7884 46.1684C10.6177 46.1748 10.4471 46.1495 10.2765 46.0989C9.49276 45.8461 9.06931 45.0055 9.32212 44.2282C10.5419 40.4614 12.1535 36.802 14.1254 33.3576C14.5299 32.6434 15.44 32.3969 16.1542 32.8014C16.8683 33.2059 17.1148 34.116 16.7103 34.8301C14.8459 38.0976 13.3101 41.5674 12.1535 45.1446C11.9513 45.7513 11.3951 46.1495 10.7884 46.1684Z"
							fill="#B3BAC5"
						/>
						<path
							opacity="0.3"
							d="M113.269 34.9882C112.738 35.0071 112.22 34.7417 111.936 34.255C110.033 31.0191 107.79 27.9602 105.262 25.1667C104.712 24.56 104.756 23.6183 105.369 23.0684C105.976 22.5186 106.917 22.5628 107.467 23.1759C110.134 26.121 112.498 29.338 114.502 32.7508C114.919 33.4587 114.679 34.3688 113.971 34.7859C113.749 34.9123 113.509 34.9755 113.269 34.9882Z"
							fill="#B3BAC5"
						/>
						<path
							opacity="0.3"
							d="M19.9779 28.845C19.6429 28.8576 19.3017 28.7565 19.0109 28.529C18.3663 28.0234 18.2462 27.088 18.7518 26.4433C21.1914 23.3149 23.9533 20.4329 26.9743 17.867C27.6 17.3361 28.5353 17.4119 29.0726 18.0376C29.6034 18.6633 29.5276 19.5987 28.9019 20.1359C26.0389 22.5691 23.4097 25.312 21.0966 28.2762C20.8185 28.6364 20.4014 28.8323 19.9779 28.845Z"
							fill="#B3BAC5"
						/>
						<path
							opacity="0.3"
							d="M100.566 20.0537C100.212 20.0664 99.8578 19.9526 99.5671 19.7124C96.6662 17.3108 93.5188 15.1999 90.1944 13.4366C89.4676 13.051 89.1895 12.1536 89.575 11.4268C89.9605 10.7 90.858 10.4282 91.5848 10.8074C95.0798 12.6592 98.4042 14.8839 101.457 17.4182C102.089 17.9428 102.177 18.8782 101.653 19.5102C101.375 19.8515 100.97 20.0348 100.566 20.0537Z"
							fill="#B3BAC5"
						/>
						<path
							opacity="0.3"
							d="M34.5205 15.6929C34.0086 15.7118 33.503 15.4653 33.2059 14.9976C32.7698 14.3024 32.9784 13.386 33.6736 12.9499C37.0359 10.839 40.6194 9.06937 44.3357 7.69159C45.1067 7.40718 45.9599 7.79903 46.2443 8.57008C46.5287 9.34114 46.1369 10.1944 45.3658 10.4788C41.8455 11.7807 38.4453 13.4619 35.2536 15.4653C35.0261 15.6107 34.7733 15.6865 34.5205 15.6929Z"
							fill="#B3BAC5"
						/>
						<path
							opacity="0.3"
							d="M83.5266 10.3397C83.3433 10.346 83.1537 10.3208 82.9767 10.2512C79.4375 8.98721 75.7528 8.08975 72.024 7.57782C71.2087 7.46406 70.6399 6.71829 70.7536 5.90299C70.8674 5.0877 71.6195 4.51889 72.4284 4.63265C76.3596 5.16986 80.2401 6.11787 83.9753 7.45142C84.7463 7.7295 85.1508 8.5764 84.8728 9.35377C84.6642 9.94154 84.1143 10.3208 83.5266 10.3397Z"
							fill="#B3BAC5"
						/>
						<path
							opacity="0.3"
							d="M52.6845 8.31728C51.9766 8.34256 51.3319 7.85591 51.1803 7.14174C51.0096 6.33908 51.5216 5.54907 52.3242 5.37843C56.1858 4.55681 60.1928 4.12704 64.1365 4.09544C64.9581 4.08912 65.628 4.75273 65.6344 5.57435C65.6407 6.38332 65.0024 7.04062 64.1997 7.07222C64.1871 7.07222 64.1681 7.07222 64.1555 7.07222C60.4076 7.09118 56.6029 7.50831 52.9436 8.28568C52.8551 8.30464 52.7666 8.31096 52.6845 8.31728Z"
							fill="#B3BAC5"
						/>
						<path
							opacity="0.3"
							d="M120.588 21.6085C120.43 21.5642 120.322 21.4189 120.341 21.2546C120.354 21.1598 120.367 21.065 120.379 20.9702C120.411 20.7869 120.449 20.591 120.499 20.3887C120.689 19.6619 121.037 19.0109 121.536 18.4358C122.035 17.8607 122.756 17.3803 123.685 17.0074L125.252 16.3691C126.187 15.9962 126.763 15.3769 126.99 14.5236C127.072 14.214 127.098 13.8979 127.066 13.5693C127.034 13.2407 126.94 12.931 126.769 12.6466C126.598 12.3622 126.364 12.103 126.055 11.8755C125.745 11.648 125.366 11.4773 124.911 11.3573C124.418 11.2309 123.982 11.2119 123.59 11.3004C123.198 11.3889 122.85 11.5469 122.547 11.7681C122.244 11.9893 121.991 12.2737 121.789 12.615C121.58 12.9563 121.428 13.3228 121.327 13.702C121.296 13.8158 121.27 13.9296 121.251 14.0307C121.195 14.3277 120.897 14.5047 120.607 14.4162L118.186 13.6767C117.959 13.6072 117.801 13.386 117.826 13.1522C117.832 13.0763 117.845 13.0005 117.857 12.9247C117.895 12.7098 117.94 12.5075 117.99 12.3053C118.18 11.5785 118.502 10.9022 118.957 10.2765C119.412 9.65083 119.975 9.1389 120.645 8.74074C121.315 8.34257 122.073 8.08344 122.933 7.95704C123.792 7.83064 124.727 7.90648 125.745 8.17193C126.8 8.45001 127.685 8.84818 128.399 9.36643C129.12 9.88468 129.682 10.4661 130.093 11.1045C130.504 11.7491 130.763 12.4317 130.864 13.1585C130.965 13.8853 130.927 14.5932 130.744 15.2821C130.46 16.3691 129.967 17.235 129.278 17.8796C128.583 18.5243 127.755 19.0299 126.782 19.3901L125.461 19.8894C125.088 20.0095 124.532 20.256 124.07 20.7616C124.026 20.8122 123.836 21.0207 123.647 21.343C123.508 21.5832 123.407 21.8171 123.337 22.0193C123.28 22.1836 123.103 22.2721 122.939 22.2279L120.588 21.6085ZM118.654 25.3184C118.812 24.718 119.153 24.2629 119.684 23.9469C120.215 23.6309 120.777 23.5488 121.378 23.7068C121.978 23.8648 122.433 24.2124 122.749 24.7496C123.065 25.2868 123.141 25.8556 122.983 26.456C122.825 27.0564 122.478 27.5052 121.94 27.8148C121.403 28.1182 120.834 28.194 120.24 28.036C119.64 27.878 119.185 27.5368 118.881 27.0122C118.572 26.4813 118.496 25.9188 118.654 25.3184Z"
							fill="#C1C7D0"
						/>
						<path
							opacity="0.3"
							d="M11.6986 13.4745C11.5469 13.4239 11.4457 13.2659 11.4773 13.1079C11.4963 13.0131 11.5153 12.9183 11.5342 12.8235C11.5785 12.6402 11.629 12.4506 11.6986 12.2547C11.9387 11.5405 12.3242 10.9148 12.8678 10.3776C13.405 9.83409 14.1508 9.41065 15.1114 9.09464L16.7167 8.56375C17.6711 8.25407 18.2904 7.67894 18.5748 6.83836C18.676 6.53499 18.7265 6.21899 18.7139 5.89034C18.7076 5.5617 18.6254 5.24569 18.48 4.94865C18.3347 4.6516 18.1135 4.37984 17.8164 4.13335C17.5257 3.88687 17.1528 3.69094 16.7104 3.53926C16.2301 3.37494 15.7877 3.3307 15.3958 3.3939C14.9977 3.4571 14.6437 3.58982 14.3277 3.79206C14.0117 3.99431 13.7399 4.25975 13.5124 4.5884C13.2723 4.91705 13.0953 5.27097 12.9689 5.64386C12.931 5.75762 12.8994 5.86506 12.8741 5.96618C12.7983 6.25691 12.4886 6.41491 12.2042 6.30747L9.84044 5.41001C9.61924 5.32785 9.48019 5.09401 9.51811 4.86016C9.53075 4.78432 9.54971 4.70848 9.56868 4.63264C9.61924 4.42408 9.67612 4.22183 9.74564 4.02591C9.9858 3.31174 10.3524 2.66076 10.8517 2.06667C11.3509 1.47258 11.945 0.998574 12.6339 0.644648C13.3291 0.290722 14.1065 0.082158 14.9661 0.0189568C15.8319 -0.0442443 16.761 0.0884781 17.7532 0.423444C18.7834 0.77105 19.6429 1.2261 20.3255 1.79491C21.0081 2.36372 21.5326 2.97677 21.8992 3.6467C22.2658 4.31663 22.4807 5.01185 22.5312 5.74498C22.5818 6.47811 22.4933 7.17965 22.2658 7.8559C21.9055 8.924 21.362 9.75193 20.6226 10.346C19.8894 10.9401 19.0236 11.3888 18.0313 11.6859L16.6788 12.0904C16.2996 12.1852 15.7245 12.3937 15.2315 12.8677C15.1809 12.9183 14.9787 13.1142 14.7701 13.4176C14.6121 13.6514 14.4984 13.8726 14.4162 14.0686C14.353 14.2266 14.1697 14.3087 14.0054 14.2519L11.6986 13.4745ZM9.51811 17.0453C9.71404 16.4576 10.0869 16.0215 10.6368 15.7434C11.1866 15.4653 11.7554 15.4211 12.3432 15.617C12.931 15.8129 13.3607 16.1921 13.6388 16.7483C13.9169 17.3045 13.9548 17.8796 13.7589 18.4674C13.563 19.0551 13.1838 19.4849 12.6276 19.7504C12.0714 20.0158 11.5026 20.0537 10.9149 19.8578C10.3271 19.6619 9.89732 19.289 9.62556 18.7391C9.36011 18.2019 9.32219 17.6331 9.51811 17.0453Z"
							fill="#C1C7D0"
						/>
						<path
							opacity="0.3"
							d="M7.8306 114.002C7.67892 114.059 7.50196 114.002 7.42611 113.857C7.38187 113.775 7.33763 113.686 7.29339 113.598C7.21123 113.427 7.13539 113.244 7.05955 113.054C6.80042 112.353 6.70562 111.62 6.78778 110.861C6.86994 110.103 7.17963 109.3 7.72948 108.453L8.6459 107.031C9.19575 106.191 9.31583 105.35 9.00614 104.522C8.89238 104.225 8.73438 103.947 8.51949 103.694C8.30461 103.441 8.05181 103.245 7.74844 103.106C7.44508 102.967 7.10379 102.898 6.71826 102.885C6.33274 102.879 5.92193 102.955 5.48584 103.119C5.01183 103.296 4.63894 103.53 4.36718 103.833C4.09541 104.13 3.90581 104.459 3.78573 104.813C3.66565 105.167 3.62141 105.546 3.64669 105.944C3.67197 106.342 3.75413 106.728 3.89317 107.101C3.93741 107.214 3.97533 107.316 4.01957 107.41C4.14598 107.682 4.00061 108.004 3.71621 108.099L1.31456 108.883C1.08704 108.959 0.834235 108.864 0.720473 108.655C0.682553 108.586 0.650952 108.516 0.613032 108.447C0.51823 108.251 0.436068 108.055 0.366547 107.865C0.107422 107.164 -0.0189799 106.424 -0.00633972 105.647C0.00630051 104.87 0.170623 104.13 0.492949 103.422C0.808955 102.714 1.28296 102.064 1.91497 101.469C2.54699 100.875 3.35596 100.395 4.3419 100.035C5.36576 99.6556 6.31378 99.4723 7.19859 99.4849C8.08341 99.4976 8.87974 99.6492 9.58759 99.9336C10.2954 100.224 10.8959 100.635 11.3951 101.172C11.8944 101.71 12.2673 102.31 12.5138 102.98C12.9057 104.035 13.0005 105.028 12.8045 105.95C12.6086 106.873 12.2168 107.764 11.629 108.624L10.8327 109.793C10.5988 110.109 10.2828 110.627 10.1943 111.304C10.188 111.373 10.1501 111.651 10.1817 112.018C10.207 112.296 10.2575 112.542 10.3207 112.745C10.3713 112.909 10.2765 113.086 10.1122 113.149L7.8306 114.002ZM8.38045 118.148C8.16557 117.567 8.18453 116.998 8.43733 116.429C8.69014 115.867 9.10727 115.475 9.68872 115.26C10.2702 115.045 10.8453 115.07 11.4078 115.329C11.9766 115.589 12.3684 116.012 12.5833 116.593C12.7982 117.175 12.7729 117.744 12.5075 118.3C12.242 118.856 11.8186 119.242 11.2435 119.456C10.662 119.671 10.0932 119.652 9.53703 119.4C8.98086 119.147 8.59534 118.73 8.38045 118.148Z"
							fill="#C1C7D0"
						/>
						<path
							d="M94.3973 84.4304L89.8784 80.0506L83.7921 86.3391L88.311 90.7189C89.4676 91.8376 90.2766 93.2596 90.6558 94.8207C91.035 96.3817 91.8503 97.8038 93.0005 98.9224L111.348 116.682C114.129 119.374 118.559 119.298 121.251 116.524C123.944 113.743 123.868 109.313 121.093 106.62L102.746 88.8608C101.59 87.7421 100.142 86.9774 98.5685 86.6488C97.0012 86.3138 95.5538 85.5427 94.3973 84.4304Z"
							fill="#CFD4DB"
						/>
						<path
							d="M98.3916 86.5919C96.8937 86.2443 95.5096 85.4985 94.4036 84.4241L93.0258 83.0905C91.2878 81.4094 88.5196 81.4536 86.8384 83.1917C85.1573 84.9297 85.2015 87.6979 86.9395 89.3791L88.3173 90.7126C89.4233 91.787 90.2134 93.1395 90.6115 94.6247C92.0967 93.4998 93.4998 92.2547 94.8207 90.8896C96.129 89.5434 97.3172 88.1024 98.3916 86.5919Z"
							fill="#B3BAC5"
						/>
						<path
							d="M64.4335 98.5938C54.6563 98.7518 45.4037 95.0924 38.382 88.292C23.8774 74.255 23.5045 51.0349 37.5414 36.5303C44.3419 29.5086 53.4745 25.5522 63.2454 25.3879C73.0226 25.2299 82.2752 28.8893 89.2969 35.6897C96.3248 42.4901 100.275 51.6227 100.439 61.3936C100.597 71.1708 96.9379 80.4235 90.1374 87.4451C83.3433 94.4794 74.2108 98.4358 64.4335 98.5938ZM63.3907 34.1286C55.9456 34.2487 48.9998 37.2634 43.8173 42.6102C33.13 53.6515 33.4144 71.3288 44.4557 82.0161C49.8025 87.1923 56.8494 89.9795 64.2945 89.8594C71.7396 89.7393 78.6854 86.7246 83.8679 81.3778C89.0441 76.031 91.8312 68.9841 91.7112 61.539C91.5911 54.0939 88.5764 47.1481 83.2296 41.9656C77.8764 36.7957 70.8358 34.0085 63.3907 34.1286Z"
							fill="url(#paint0_linear_4923_331211)"
						/>
						<path
							d="M75.1588 53.86L71.7839 50.5419C71.2846 50.0553 70.4883 50.0616 69.9953 50.5609L63.8079 56.8621L57.5068 50.6747C57.0075 50.188 56.2111 50.1943 55.7182 50.6936L52.4001 54.0686C51.9135 54.5679 51.9198 55.3642 52.4191 55.8572L58.7202 62.0446L52.5328 68.3457C52.0462 68.845 52.0525 69.6413 52.5518 70.1343L55.9267 73.4524C56.426 73.939 57.2223 73.9327 57.7153 73.4334L63.9027 67.1322L70.2039 73.3196C70.7032 73.8063 71.4995 73.8 71.9925 73.3007L75.3105 69.9257C75.7972 69.4265 75.7908 68.6301 75.2916 68.1371L68.9904 61.9498L75.1778 55.6486C75.6644 55.1493 75.6581 54.3467 75.1588 53.86Z"
							fill="#C1C7D0"
						/>
					</g>
					<defs>
						<linearGradient
							id="paint0_linear_4923_331211"
							x1="37.9599"
							y1="87.8783"
							x2="89.7263"
							y2="36.1119"
							gradientUnits="userSpaceOnUse"
						>
							<stop offset="0.5572" stopColor="#C1C7D0" />
							<stop offset="0.966" stopColor="#E9EBEF" stopOpacity="0.5" />
						</linearGradient>
						<clipPath id="clip0_4923_331211">
							<rect width="130.927" height="120" fill="white" />
						</clipPath>
					</defs>
				</svg>
			)}
			<Grid xcss={styles.noResultsMessageContainerStyles}>
				<Text as="span" size="large" weight="bold">
					<FormattedMessage {...loadingErrorMessages.noResultsFound} />
				</Text>
				{onRefresh && (
					<Button appearance="primary" onClick={onRefresh}>
						<FormattedMessage {...loadingErrorMessages.refresh} />
					</Button>
				)}
			</Grid>
		</Grid>
	);
};

export const NoResults = (props: NoResultsProps) => {
	if (fg('bandicoots-compiled-migration-link-datasource')) {
		return <NoResultsNew {...props} />;
	} else {
		return <NoResultsOld {...props} />;
	}
};
