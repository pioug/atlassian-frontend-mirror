const MOCK_DATA = {
  MOCKED_PROVIDERS: {
    providers: [
      {
        key: 'google-search-provider',
        metadata: {
          name: 'Google',
          avatarUrl:
            'https://developers.google.com/drive/images/drive_icon.png',
          supportedViews: ['folder'],
          displayName: 'Drive',
          unAuthDescription:
            'You can work on all of your Google sheets, docs, slides and more, without ever leaving Atlassian. Only you have this access.',
        },
      },
    ],
  },
  MOCKED_DATA: {
    status: 200,
    body: {
      data: {
        '@context': {
          '@vocab': 'https://www.w3.org/ns/activitystreams#',
          atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
          schema: 'http://schema.org/',
        },
        '@type': 'Collection',
        items: [
          {
            '@context': {
              '@vocab': 'https://www.w3.org/ns/activitystreams#',
              atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
              schema: 'http://schema.org/',
            },
            '@type': ['schema:TextDigitalDocument', 'Object'],
            '@id': 'id:EXAMPLE1',
            url:
              'https://docs.google.com/document/d/EXAMPLE1/edit?usp=drivesdk',
            icon: {
              '@type': 'Image',
              url:
                'https://drive-thirdparty.googleusercontent.com/32/type/application/vnd.google-apps.document',
            },
            image: {
              '@type': 'Image',
              url: 'https://docs.google.com/feeds/vt?gd=true&id=EXAMPLE',
            },
            name: 'How to create a link',
            'atlassian:fileSize': '53956',
            'schema:fileFormat': 'application/vnd.google-apps.document',
            'atlassian:dateViewed': '2022-10-14T01:49:52.423Z',
            attributedTo: {
              '@type': 'Person',
              name: 'Real Person',
              image: 'https://lh3.googleusercontent.com/a/default-user=s64',
            },
            'schema:dateCreated': '2016-04-18T02:24:12.736Z',
            updated: '2022-08-12T11:32:21.577Z',
            'atlassian:isDeleted': false,
            'schema:commentCount': 0,
            preview: {
              '@type': 'Link',
              href:
                'https://docs.google.com/document/d/EXAMPLE/edit?usp=drivesdk&rm=minimal&output=embed',
              'atlassian:supportedPlatforms': ['web'],
            },
            generator: {
              '@type': 'Application',
              name: 'Google Drive',
              icon: {
                '@type': 'Image',
                url:
                  'https://developers.google.com/drive/images/drive_icon.png',
              },
            },
          },
          {
            '@context': {
              '@vocab': 'https://www.w3.org/ns/activitystreams#',
              atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
              schema: 'http://schema.org/',
            },
            '@type': ['schema:PresentationDigitalDocument', 'Object'],
            '@id': 'id:EXAMPLE2',
            url:
              'https://docs.google.com/presentation/d/EXAMPLE2/edit?usp=drivesdk',
            icon: {
              '@type': 'Image',
              url:
                'https://drive-thirdparty.googleusercontent.com/32/type/application/vnd.google-apps.presentation',
            },
            image: {
              '@type': 'Image',
              url: 'https://docs.google.com/feeds/vt?gd=true&id=EXAMPLE',
            },
            name: 'Dependent Coverage',
            'schema:fileFormat': 'application/vnd.google-apps.presentation',
            'atlassian:dateViewed': '2022-10-14T01:49:37.942Z',
            attributedTo: { '@type': 'Person', name: 'Good Name' },
            'schema:dateCreated': '2020-04-30T17:20:31.478Z',
            updated: '2020-04-30T17:20:56.473Z',
            'atlassian:updatedBy': { '@type': 'Person', name: 'Good Name' },
            'atlassian:isDeleted': false,
            'schema:commentCount': 0,
            preview: {
              '@type': 'Link',
              href:
                'https://docs.google.com/presentation/d/EXAMPLE/preview?usp=drivesdk',
              'atlassian:supportedPlatforms': ['web'],
            },
            generator: {
              '@type': 'Application',
              name: 'Google Drive',
              icon: {
                '@type': 'Image',
                url:
                  'https://developers.google.com/drive/images/drive_icon.png',
              },
            },
          },
          {
            '@context': {
              '@vocab': 'https://www.w3.org/ns/activitystreams#',
              atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
              schema: 'http://schema.org/',
            },
            '@type': ['schema:PresentationDigitalDocument', 'Object'],
            '@id': 'id:EXAMPLE3',
            url:
              'https://docs.google.com/presentation/d/EXAMPLE3/edit?usp=drivesdk',
            icon: {
              '@type': 'Image',
              url:
                'https://drive-thirdparty.googleusercontent.com/32/type/application/vnd.google-apps.presentation',
            },
            image: {
              '@type': 'Image',
              url: 'https://docs.google.com/feeds/vt?gd=true&id=EXAMPLE',
            },
            name: 'Media experiences in the Editor',
            'schema:fileFormat': 'application/vnd.google-apps.presentation',
            'atlassian:dateViewed': '2022-10-14T01:49:24.158Z',
            attributedTo: {
              '@type': 'Person',
              name: 'Fake Person',
              image: 'https://lh3.googleusercontent.com/a/default-user=s64',
            },
            'schema:dateCreated': '2020-07-16T05:54:20.668Z',
            updated: '2020-12-02T03:50:42.977Z',
            'atlassian:updatedBy': {
              '@type': 'Person',
              name: 'Fake Person',
              image: 'https://lh3.googleusercontent.com/a/default-user=s64',
            },
            'atlassian:isDeleted': false,
            'schema:commentCount': 0,
            preview: {
              '@type': 'Link',
              href:
                'https://docs.google.com/presentation/d/EXAMPLE/preview?usp=drivesdk',
              'atlassian:supportedPlatforms': ['web'],
            },
            generator: {
              '@type': 'Application',
              name: 'Google Drive',
              icon: {
                '@type': 'Image',
                url:
                  'https://developers.google.com/drive/images/drive_icon.png',
              },
            },
          },
          {
            '@context': {
              '@vocab': 'https://www.w3.org/ns/activitystreams#',
              atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
              schema: 'http://schema.org/',
            },
            '@type': 'Document',
            '@id': 'id:EXAMPLE4',
            url: 'https://drive.google.com/file/d/EXAMPLE4/view?usp=drivesdk',
            icon: {
              '@type': 'Image',
              url:
                'https://drive-thirdparty.googleusercontent.com/32/type/video/mp4',
            },
            image: {
              '@type': 'Image',
              url:
                'https://lh6.googleusercontent.com/f5gPV8uWHnjY_OSL8_Wuq6tL9GVQGJGkYlP-YO8ojRm93GBns_J1MoIyb7tNiVi2LavhY8ZHxu88Rso=s500',
            },
            name: 'Video.mp4',
            'atlassian:fileSize': '222178532',
            'schema:fileFormat': 'video/mp4',
            'atlassian:dateViewed': '2022-09-01T00:15:06.103Z',
            attributedTo: {
              '@type': 'Person',
              name: 'John Doe',
              image: 'https://lh3.googleusercontent.com/a/default-user=s64',
            },
            'schema:dateCreated': '2020-04-23T04:18:34.884Z',
            updated: '2020-04-23T04:50:20.009Z',
            'atlassian:updatedBy': {
              '@type': 'Person',
              name: 'John Doe',
              image: 'https://lh3.googleusercontent.com/a/default-user=s64',
            },
            'atlassian:isDeleted': false,
            'schema:commentCount': 0,
            preview: {
              '@type': 'Link',
              href:
                'https://drive.google.com/file/d/EXAMPLE/preview?usp=drivesdk',
              'atlassian:supportedPlatforms': ['web'],
            },
            generator: {
              '@type': 'Application',
              name: 'Google Drive',
              icon: {
                '@type': 'Image',
                url:
                  'https://developers.google.com/drive/images/drive_icon.png',
              },
            },
          },
          {
            '@context': {
              '@vocab': 'https://www.w3.org/ns/activitystreams#',
              atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
              schema: 'http://schema.org/',
            },
            '@type': 'Document',
            '@id': 'id:EXAMPLE5',
            url: 'https://drive.google.com/file/d/EXAMPLE5/view?usp=drivesdk',
            icon: {
              '@type': 'Image',
              url:
                'https://drive-thirdparty.googleusercontent.com/32/type/video/mp4',
            },
            image: {
              '@type': 'Image',
              url:
                'https://lh3.googleusercontent.com/DUMMY-67t7URzDc6Hsp44s44=s500',
            },
            name: 'Some Training video.mp4',
            'atlassian:fileSize': '109865785',
            'schema:fileFormat': 'video/mp4',
            'atlassian:dateViewed': '2022-08-31T01:30:24.006Z',
            attributedTo: {
              '@type': 'Person',
              name: 'John Doe',
              image: 'https://lh3.googleusercontent.com/a/default-user=s64',
            },
            'schema:dateCreated': '2021-06-07T03:38:39.597Z',
            updated: '2021-06-07T03:45:34.955Z',
            'atlassian:updatedBy': {
              '@type': 'Person',
              name: 'John Doe',
              image: 'https://lh3.googleusercontent.com/a/default-user=s64',
            },
            'atlassian:isDeleted': false,
            'schema:commentCount': 0,
            preview: {
              '@type': 'Link',
              href:
                'https://drive.google.com/file/d/EXAMPLE/preview?usp=drivesdk',
              'atlassian:supportedPlatforms': ['web'],
            },
            generator: {
              '@type': 'Application',
              name: 'Google Drive',
              icon: {
                '@type': 'Image',
                url:
                  'https://developers.google.com/drive/images/drive_icon.png',
              },
            },
          },
        ],
      },
      meta: {
        access: 'restricted',
        auth: [
          {
            displayName: 'Atlassian Links - Google Drive',
            key: 'gdrive',
            url:
              'https://id.stg.internal.atlassian.com/outboundAuth/start?containerId=DUMMY-ID-4&serviceKey=gdrive',
            length: 1,
            version: '3.0.0',
            visibility: 'restricted',
          },
        ],
        definitionId: 'google-object-provider',
        key: 'google-object-provider',
        visibility: 'restricted',
      },
    },
  },
};

export default MOCK_DATA;
