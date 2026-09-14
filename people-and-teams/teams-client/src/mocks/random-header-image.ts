import type { MockConfig } from './team';

const headerImages = [
	'https://images.unsplash.com/photo-1533589067335-b0114bd0ab00?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=44f82f3cfd94db0ed8ad35737bb25fe4&auto=format&fit=crop&w=3469&q=80',
	'https://images.unsplash.com/photo-1519118886560-fbbb446660a4?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=b568db5fad0ec1b0abf8e230662f277c&auto=format&fit=crop&w=3450&q=80',
	'https://images.unsplash.com/photo-1506316940527-4d1c138978a0?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=6952c5da84bed2f5cad7c9e41474c890&auto=format&fit=crop&w=4178&q=80',
	'https://images.unsplash.com/photo-1505872472933-3657fd5f0aa3?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=f55798af8783753567bbe1a2859f9125&auto=format&fit=crop&w=800&q=60',
	'https://images.unsplash.com/photo-1508542373453-6d6aaf71d9b5?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=17d8767fe0f213017c5a248f46708004&auto=format&fit=crop&w=3450&q=80',
	'https://images.unsplash.com/photo-1505343011179-ffb744ab9bef?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=c038482c22e9eccc547a9b8b30d03d6b&auto=format&fit=crop&w=3449&q=80',
	'//noimage.jpg',
];

export const randomHeaderImage =
	({ faker }: MockConfig) =>
	(): string => {
		if (Math.random() > 0.5) {
			return faker.random.arrayElement(headerImages);
		} else {
			return `270deg, #FFF0B3 0%, #FFC400 100%`;
		}
	};
