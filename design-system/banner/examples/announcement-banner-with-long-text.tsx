import React from 'react';

import { Text } from '@atlaskit/primitives';

import Banner from '../src';

export default () => (
	<>
		<Banner appearance="announcement">
			Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut id volutpat sem, nec iaculis
			augue. Vestibulum quis luctus lacus, et laoreet odio. Praesent bibendum, ipsum sit amet
			interdum rutrum, neque urna tempus ex, sit amet venenatis nibh erat eu lectus. Curabitur
			elementum vitae arcu et condimentum. Aenean nec mauris et neque tristique ultricies id a urna.
			Maecenas non condimentum ante. Vestibulum at enim feugiat, ullamcorper risus sed, tincidunt
			lorem. Mauris posuere turpis eu dui facilisis, posuere ullamcorper diam pharetra. Suspendisse
			id viverra nibh, id hendrerit elit. Curabitur bibendum urna massa, a viverra sapien maximus
			sed. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis
			egestas. Pellentesque vulputate justo at tellus cursus, et pellentesque nisl vulputate.
			Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.
			Aliquam fermentum euismod elementum. Phasellus ornare suscipit quam nec ullamcorper. Donec
			ullamcorper vulputate nibh vitae placerat. Aliquam ut dui non nisl congue luctus. Fusce
			sagittis orci sed arcu ultricies, a egestas nulla faucibus. Nulla scelerisque elementum massa.
			Donec eu urna in ipsum ultricies sollicitudin. In sit amet lobortis turpis.
		</Banner>
		<Text>Above we have an announcement banner with long content which will be truncated.</Text>
	</>
);
