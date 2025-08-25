/* eslint-disable @typescript-eslint/no-namespace, import/export */
import type {
	Action as ActionSchema,
	AssignAction,
	CommentAction,
	DeleteAction,
	DownloadAction,
	ReplyAction,
	ShareAction,
	SubscribeAction,
	ViewAction,
	WatchAction,
} from 'schema-dts';

export namespace JsonLd {
	export namespace Primitives {
		/*
    ----------------------------
    Primitives for jsonld.meta
    ----------------------------
  */
		export type Access = 'granted' | 'forbidden' | 'unauthorized' | 'not_found';
		export type Visibility = 'public' | 'restricted' | 'other' | 'not_found';

		export type LeafType = 'Object' | 'Link' | 'Collection';
		export type ObjectType =
			| 'Collection'
			| 'Application'
			| 'Group'
			| 'Person'
			| 'Service'
			| 'Organization'
			| 'Relationship'
			| 'Object'
			| 'Article'
			| 'Document'
			| 'Audio'
			| 'Image'
			| 'Video'
			| 'Note'
			| 'Page'
			| 'Event'
			| 'Place'
			| 'Profile'
			| 'Tombstone'
			| 'schema:BlogPosting'
			| 'schema:TextDigitalDocument'
			| 'schema:DigitalDocument'
			| 'schema:PresentationDigitalDocument'
			| 'schema:SpreadsheetDigitalDocument'
			| 'schema:Message'
			| 'atlassian:Goal'
			| 'atlassian:Project'
			| 'atlassian:SourceCodeReference'
			| 'atlassian:SourceCodeRepository'
			| 'atlassian:SourceCodePullRequest'
			| 'atlassian:SourceCodeCommit'
			| 'atlassian:Task'
			| 'atlassian:UndefinedLink'
			| 'atlassian:Emoji'
			| 'atlassian:Schema'
			| 'atlassian:Type'
			| 'atlassian:Object';

		export type LinkType = 'Mention';
		export type CollectionType = 'Collection' | 'CollectionPage';
		export type Type = ObjectType | LinkType | CollectionType | LeafType;
		export type PotentialServerActionType =
			| 'CreateAction'
			| 'ReadAction'
			| 'UpdateAction'
			| 'DeleteAction';

		/*
    ----------------------------
    Primitives for jsonld.meta
    ----------------------------
  */
		export interface AuthService {
			displayName: string;
			key: string;
			url: string;
		}
		/*
    ----------------------------
    Primitives for jsonld.data
    ----------------------------
  */
		export type Property<T> = T | T[];
		export type TypeProperty<ResourceType extends Type, ParentType extends Type = 'Object'> =
			| ResourceType
			| Array<ParentType | ResourceType>;
		export interface Context {
			'@vocab': 'https://www.w3.org/ns/activitystreams#';
			atlassian: 'https://schema.atlassian.com/ns/vocabulary#';
			schema: 'http://schema.org/';
		}

		export interface PreviewExtension {
			/* Embed's aspect ratio */
			'atlassian:aspectRatio'?: number;
			'atlassian:supportedPlatforms'?: Primitives.Platforms[];
			/* A target resource pointed to by a Link that provides an editable/interactive mode. */
			interactiveHref?: string;
		}

		export interface CheckItemProgress {
			checkedItems: number;
			totalItems: number;
		}

		export interface SubTasksProgress {
			resolvedCount: number;
			totalCount: number;
		}

		export interface UserAttributes {
			department?: string;
			location?: string;
			pronouns?: string;
			role?: string;
		}
		/*
      -----------------------
      CORE TYPES
      -----------------------
      The Activity Vocabulary Core Types provide the basis for the rest of the vocabulary. Define at https://www.w3.org/TR/activitystreams-vocabulary/#types.
    */
		/* 	Describes an object of any kind. The Object type serves as the base type for most of the other kinds of objects defined in the Activity Vocabulary, including other Core types such as Activity, IntransitiveActivity, Collection and OrderedCollection. */
		export interface Object<T = any> {
			/* Provides the globally unique identifier for an Object or Link. */
			'@id'?: string;
			/* Identifies the Object or Link type. Multiple values may be specified. */
			'@type': Property<'Object' | ObjectType>;
			/* Identifies an inclusive option for a Question. Use of anyOf implies that the Question can have multiple answers. To indicate that a Question can have only one answer, use oneOf. */
			anyOf?: Array<Primitives.Object | Primitives.Link>;
			/* Identifies a resource attached or related to an object that potentially requires special handling. The intent is to provide a model that is at least semantically similar to attachments in email. */
			attachment?: Property<Primitives.Object | Primitives.Link>;
			/* Identifies one or more entities to which this object is attributed. The attributed entities might not be Actors. For instance, an object might be attributed to the completion of another activity.*/
			attributedTo?: Property<
				(Primitives.Object | Primitives.Link) & {
					/* Describes one or more entities that either performed or are expected to perform the activity. Any single activity can have multiple actors. The actor may be specified using an indirect Link. */
					actor?: Property<Primitives.Object | Primitives.Link>;
				}
			>;
			/* Identifies one or more entities that represent the total population of entities for which the object can considered to be relevant. */
			audience?: Property<Primitives.Object | Primitives.Link>;
			/* Identifies one or more Objects that are part of the private secondary audience of this Object. */
			bcc?: Property<Primitives.Object | Primitives.Link>;
			/* Identifies an Object that is part of the private primary audience of this Object. */
			bto?: Property<Primitives.Object | Primitives.Link>;
			/* Identifies an Object that is part of the public secondary audience of this Object. */
			cc?: Property<Primitives.Object | Primitives.Link>;
			/* Indicates that a question has been closed, and answers are no longer accepted. */
			closed?: Primitives.Object | Primitives.Link | string | boolean;
			/* The content or textual representation of the Object encoded as a JSON string. By default, the value of content is HTML. The mediaType property can be used in the object to indicate a different content type. The content may be expressed using multiple language-tagged values. */
			content?: string;
			contentMap?: Record<string, string>;
			/* Identifies the context within which the object exists or an activity was performed. The notion of "context" used is intentionally vague. The intended function is to serve as a means of grouping objects and activities that share a common originating context or purpose. An example could be all activities relating to a common project or event. */
			context?: Primitives.Object | Primitives.Link;
			/* When the object describes a time-bound resource, such as an audio or video, a meeting, etc, the duration property indicates the object's approximate duration. The value must be expressed as an xsd:duration as defined by [ xmlschema11-2], section 3.3.6 (e.g. a period of 5 seconds is represented as "PT5S"). */
			duration?: string;
			/* The date and time describing the actual or expected ending time of the object. When used with an Activity object, for instance, the endTime property specifies the moment the activity concluded or is expected to conclude. */
			endTime?: string;
			/* Identifies the entity (e.g. an application) that generated the object. */
			generator?: Primitives.Object | Primitives.Link;
			/* Indicates an entity that describes an icon for this object. The image should have an aspect ratio of one (horizontal) to one (vertical) and should be suitable for presentation at a small size. */
			icon?: Image | Primitives.Link;
			/* Indicates an entity that describes an image for this object. Unlike the icon property, there are no aspect ratio or display size limitations assumed. */
			image?: Image | Primitives.Link;
			/* Indicates one or more entities for which this object is considered a response. */
			inReplyTo?: Property<Primitives.Object | Primitives.Link>;
			/* Indicates one or more physical or logical locations associated with the object. */
			location?: Property<Primitives.Object | Primitives.Link>;
			/* When used on a Link, identifies the MIME media type of the referenced resource. When used on an Object, identifies the MIME media type of the value of the content property. If not specified, the content property is assumed to contain text/html content. */
			mediaType?: string;
			/* A simple, human-readable, plain-text name for the object. HTML markup must not be included. The name may be expressed using multiple language-tagged values. */
			name?: string;
			nameMap?: Record<string, string>;
			/* Identifies an exclusive option for a Question. Use of oneOf implies that the Question can have only a single answer. To indicate that a Question can have multiple answers, use anyOf. */
			oneOf?: Array<Primitives.Object | Primitives.Link>;
			/* Identifies an entity that provides a preview of this object. */
			preview?: string | ((Primitives.LinkModel | Primitives.Object) & PreviewExtension);
			/* The date and time at which the object was published */
			published?: string;
			/* Identifies a Collection containing objects considered to be responses to this object. */
			replies?: Collection<T>;
			/* The date and time describing the actual or expected starting time of the object. When used with an Activity object, for instance, the startTime property specifies the moment the activity began or is scheduled to begin. */
			startTime?: string;
			/* A natural language summarization of the object encoded as HTML. Multiple language tagged summaries may be provided. */
			summary?: string;
			summaryMap?: Record<string, string>;
			/* One or more "tags" that have been associated with an objects. A tag can be any kind of Object. The key difference between attachment and tag is that the former implies association by inclusion, while the latter implies associated by reference. */
			tag?: Property<Primitives.Object | Primitives.Link>;
			/* To Show number of members in a team */
			teamMemberCount?: number;
			/* Identifies an entity considered to be part of the public primary audience of an Object */
			to?: Property<Primitives.Object | Primitives.Link>;
			/* The date and time at which the object was updated */
			updated?: string;
			/* Identifies one or more links to representations of the object */
			url?: Property<string | Primitives.Link>;
			/* User details containing few user information like department, designation, location and pronouns */
			userAttributes?: Primitives.UserAttributes;
		}

		/* A Link is an indirect, qualified reference to a resource identified by a URL. The fundamental model for links is established by [ RFC5988]. Many of the properties defined by the Activity Vocabulary allow values that are either instances of Object or Link. When a Link is used, it establishes a qualified relation connecting the subject (the containing object) to the resource identified by the href. Properties of the Link are properties of the reference as opposed to properties of the resource. */
		export type Link = string | LinkModel;
		export interface LinkModel {
			'@type': 'Link';
			/* On a Link, specifies a hint as to the rendering height in device-independent pixels of the linked resource. */
			height?: number;
			/* The target resource pointed to by a Link. */
			href?: string;
			/* Hints as to the language used by the target resource. Value must be a [BCP47] Language-Tag. */
			hreflang?: string;
			/* When used on a Link, identifies the MIME media type of the referenced resource. When used on an Object, identifies the MIME media type of the value of the content property. If not specified, the content property is assumed to contain text/html content. */
			mediaType?: string;
			/* A simple, human-readable, plain-text name for the object. HTML markup must not be included. The name may be expressed using multiple language-tagged values. */
			name?: string;
			nameMap?: Record<string, string>;
			/* Identifies an entity that provides a preview of this object. */
			preview?: string | ((Primitives.LinkModel | Primitives.Object) & PreviewExtension);
			/* A link relation associated with a Link. The value must conform to both the [HTML5] and [RFC5988] "link relation" definitions. In the [HTML5], any string not containing the "space" U+0020, "tab" (U+0009), "LF" (U+000A), "FF" (U+000C), "CR" (U+000D) or "," (U+002C) characters can be used as a valid link relation. */
			rel?: Primitives.Link;
			/* On a Link, specifies a hint as to the rendering width in device-independent pixels of the linked resource. */
			width?: number;
		}

		/* An Activity is a subtype of Object that describes some form of action that may happen, is currently happening, or has already happened. The Activity type itself serves as an abstract base type for all types of activities. It is important to note that the Activity type itself does not carry any specific semantics about the kind of action being taken. */
		export interface Activity {
			/* Describes one or more entities that either performed or are expected to perform the activity. Any single activity can have multiple actors. The actor may be specified using an indirect Link. */
			actor?: Primitives.Object | Primitives.Link;
			/* Identifies one or more objects used (or to be used) in the completion of an Activity. */
			instrument?: Property<Primitives.Object | Primitives.Link>;
			/* When used within an Activity, describes the direct object of the activity. For instance, in the activity "John added a movie to his wishlist", the object of the activity is the movie added. When used within a Relationship describes the entity to which the subject is related */
			object?: Primitives.Object | Primitives.Link;
			/* Describes an indirect object of the activity from which the activity is directed. The precise meaning of the origin is the object of the English preposition "from". For instance, in the activity "John moved an item to List B from List A", the origin of the activity is "List A". */
			origin?: Primitives.Object | Primitives.Link;
			/* Describes the result of the activity. For instance, if a particular action results in the creation of a new resource, the result property can be used to describe that new resource. */
			result?: Primitives.Object | Primitives.Link;
			/* Describes the indirect object, or target, of the activity. The precise meaning of the target is largely dependent on the type of action being described but will often be the object of the English preposition "to". For instance, in the activity "John added a movie to his wishlist", the target of the activity is John's wishlist. An activity can have more than one target. */
			target?: Primitives.Object | Primitives.Link;
		}

		/* Instances of IntransitiveActivity are a subtype of Activity representing intransitive actions. The object property is therefore inappropriate for these activities. */
		export type IntransitiveActivity = Omit<Activity, 'object'>;

		/* A Collection is a subtype of Object that represents ordered or unordered sets of Object or Link instances. Refer to the Activity Streams 2.0 Core specification for a complete description of the Collection type. */
		export interface Collection<T> {
			/* In a paged Collection, indicates the page that contains the most recently updated member items. */
			current?: CollectionPage<T> | Primitives.Link;
			/* In a paged Collection, indicates the furthest preceeding page of items in the collection. */
			first?: CollectionPage<T> | Primitives.Link;
			/* Identifies the items contained in a collection. The items might be ordered or unordered. */
			items?: Primitives.Object | Primitives.Link | Array<Primitives.Object | Primitives.Link | T>;
			/* In a paged Collection, indicates the furthest proceeding page of the collection. */
			last?: CollectionPage<T> | Primitives.Link;
			/* A non-negative integer specifying the total number of objects contained by the logical view of the collection. This number might not reflect the actual number of items serialized within the Collection object instance. */
			totalItems?: number;
		}

		/* A subtype of Collection in which members of the logical collection are assumed to always be strictly ordered. */
		export type OrderedCollection<T> = Collection<T>;

		/* Used to represent distinct subsets of items from a Collection. Refer to the Activity Streams 2.0 Core for a complete description of the CollectionPage object. */
		export interface CollectionPage<T = any> extends Collection<T> {
			/* In a paged Collection, indicates the next page of items. */
			next?: CollectionPage<T> | Primitives.Link;
			/* Identifies the Collection to which a CollectionPage objects items belong. */
			partOf?: Primitives.Link | Collection<T>;
			/* In a paged Collection, identifies the previous page of items. */
			prev?: CollectionPage<T> | Primitives.Link;
		}

		/* Used to represent ordered subsets of items from an OrderedCollection. Refer to the Activity Streams 2.0 Core for a complete description of the OrderedCollectionPage object. */
		export interface OrderedCollectionPage<T> extends CollectionPage<T> {
			/* A non-negative integer value identifying the relative position within the logical view of a strictly ordered collection. */
			startIndex?: number;
		}

		/*
      -----------------------
      ACTOR TYPES
      -----------------------
      Actor types are Object types that are capable of performing activities. Define at https://www.w3.org/TR/activitystreams-vocabulary/#actor-types.
    */
		/* Describes a software application. */
		export interface Application<T = any> extends Primitives.Object<T> {
			'@type': TypeProperty<'Application'>;
		}

		/* Represents a formal or informal collective of Actors. */
		export interface Group<T = any> extends Primitives.Object<T> {
			'@type': TypeProperty<'Group'>;
		}

		/* Represents an organization. */
		export interface Organization<T = any> extends Primitives.Object<T> {
			'@type': TypeProperty<'Organization'>;
		}

		/* Represents an individual person. */
		export interface Person<T = any> extends Primitives.Object<T> {
			'@type': TypeProperty<'Person'>;
			/* The name displayed in the UI for the user */
			'atlassian:displayName'?: string;
			/* Collection of email addresses associated with the user */
			'atlassian:emails'?: Array<{
				/* Whether this is the primary email for the user */
				primary?: boolean;
				/* The email address */
				value: string;
			}>;
			/* Additional profile information as key-value pairs */
			'atlassian:extendedProfile'?: Record<string, any>;
			/* A globally unique identifier for the user */
			'atlassian:externalId'?: string;
			/* Components of the user's name */
			'atlassian:name'?: {
				/* The family (last) name of the user */
				familyName?: string;
				/* The full formatted name of the user */
				formatted?: string;
				/* The given (first) name of the user */
				givenName?: string;
			};
			/* A casual or familiar name for the user */
			'atlassian:nickname'?: string;
			/* Collection of photos associated with the user */
			'atlassian:photos'?: Array<{
				/* Type of photo */
				type?: 'photo' | 'thumbnail';
				/* URL to the photo */
				value?: string;
			}>;
			/* The username used to log in */
			'atlassian:userName'?: string;
		}

		/* Represents a service of any kind. */
		export interface Service<T = any> extends Primitives.Object<T> {
			'@type': TypeProperty<'Service'>;
		}

		/*
      -----------------------
      OBJECT AND LINK TYPES
      -----------------------
      All Object Types inherit the properties of the base Object type. Link Types inherit the properties of the base Link type. Some specific Object Types are subtypes or specializations of more generalized Object Types (for instance, the Like Type is a more specific form of the Activity type). Defined at https://www.w3.org/TR/activitystreams-vocabulary/#object-types.
    */
		/* Describes a relationship between two individuals. The subject and object properties are used to identify the connected individuals. */
		export interface Relationship extends Primitives.Object {
			'@type': TypeProperty<'Relationship'>;
			/* When used within an Activity, describes the direct object of the activity. For instance, in the activity "John added a movie to his wishlist", the object of the activity is the movie added. When used within a Relationship describes the entity to which the subject is related */
			object?: Primitives.Object | Primitives.Link;
			/* On a Relationship object, the relationship property identifies the kind of relationship that exists between subject and object. */
			relationship?: Primitives.Object;
			/* On a Relationship object, the subject property identifies one of the connected individuals. For instance, for a Relationship object describing "John is related to Sally", subject would refer to John. */
			subject?: Primitives.Link | Primitives.Object;
		}
		/* Represents any kind of multi-paragraph written work. */
		export interface Article extends Primitives.Object {
			'@type': TypeProperty<'Article'>;
		}
		/* Represents a document of any kind. */
		export interface Document extends Primitives.Object {
			'@type': TypeProperty<'Document'>;
		}
		/* Represents an audio document of any kind. */
		export interface Audio extends Primitives.Object {
			'@type': TypeProperty<'Audio'>;
		}
		/* Represents an image document of any kind. */
		export interface Image extends Primitives.Object {
			'@type': TypeProperty<'Image'>;
		}
		/* Represents a video document of any kind. */
		export interface Video extends Primitives.Object {
			'@type': TypeProperty<'Video'>;
		}
		/* Represents a short written work typically less than a single paragraph in length. */
		export interface Note extends Primitives.Object {
			'@type': TypeProperty<'Note'>;
		}
		/* Represents a Web Page. */
		export interface Page extends Primitives.Object {
			'@type': TypeProperty<'Page'>;
		}
		/* Represents a Web Page. */
		export interface Event extends Primitives.Object {
			'@type': TypeProperty<'Event'>;
		}
		/* Represents a logical or physical location. See 5.3 Representing Places for additional information. */
		export interface Place extends Primitives.Object {
			'@type': TypeProperty<'Place'>;
			/* Indicates the accuracy of position coordinates on a Place objects. Expressed in properties of percentage. e.g. "94.0" means "94.0% accurate". */
			accuracy?: number;
			/* Indicates the altitude of a place. The measurement units is indicated using the units property. If units is not specified, the default is assumed to be "m" indicating meters. */
			altitude?: number;
			/* The latitude of a place */
			latitude?: number;
			/* The longitude of a place */
			longitude?: number;
			/* The radius from the given latitude and longitude for a Place. The units is expressed by the units property. If units is not specified, the default is assumed to be "m" indicating "meters". */
			radius?: number;
			/* Specifies the measurement units for the radius and altitude properties on a Place object. If not specified, the default is assumed to be "m" for "meters". */
			units?: 'cm' | 'feet' | 'inches' | 'km' | 'm' | 'miles' | string;
		}
		/* A specialized Link that represents an @mention. */
		export type Mention = Primitives.Link & {
			'@type': TypeProperty<'Mention', 'Link'>;
		};
		/* A Profile is a content object that describes another Object, typically used to describe Actor Type objects. The describes property is used to reference the object being described by the profile. */
		export interface Profile extends Primitives.Object {
			'@type': TypeProperty<'Profile'>;
			/* On a Profile object, the describes property identifies the object described by the Profile. */
			describes?: Primitives.Object;
		}
		/* State controls the state lozenge */
		export interface State extends Primitives.Object {
			accent?: string;
			appearance?: string;
		}
		/* A Tombstone represents a content object that has been deleted. It can be used in Collections to signify that there used to be an object at this position, but it has been deleted. */
		export interface Tombstone extends Primitives.Object {
			'@type': TypeProperty<'Tombstone'>;
			/* On a Tombstone object, the deleted property is a timestamp for when the object was deleted. */
			deleted?: string;
			/* On a Tombstone object, the formerType property identifies the type of the object that was deleted. */
			formerType?: Primitives.Object;
		}

		/*
      -----------------------
      ATLASSIAN-ONLY TYPES
      -----------------------
      Defined as Atlassian-only schema.
    */
		/* Actions which relate to an assignable resource */
		export type AssignedObjectActions = AssignAction | SubscribeAction | ServerAction;
		/* Represents an assignable resource - a Task, Issue, etc. */
		export interface AssignedObject {
			'atlassian:assigned'?: string;
			'atlassian:assignedBy'?: Primitives.Link | Person;
			'atlassian:assignedTo'?: Primitives.Link | Person;
			'atlassian:subscriber'?: Primitives.Link | Person;
			'atlassian:subscriberCount'?: number;
		}

		export type PreviewAction = ActionSchema & {
			'@type': 'PreviewAction';
		};

		/**
		 * Basic type of the Smart Link Action that describes the mandatory fields an action must contain
		 */
		type PotentialSmartLinkAction = ActionSchema & {
			/**
			 * Type of the Potential Action, one of PotentialServerActionType
			 */
			'@type': PotentialServerActionType;

			/**
			 * Name of the actual action, for example: 'StatusUpdateAction'
			 */
			name: string;

			/**
			 * references a field in the response to which the action is associated with
			 * for eg. "tag" for jira issues
			 */
			refField?: string;
			/**
			 * An object with key value to identify the resource.
			 * For e.g. for a jira issue link/resource, it could be hostname, and issueId
			 * The values can change for different action and resources hence the type is not strictly defined
			 */
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			resourceIdentifiers?: Record<string, any>;
		};

		/**
		 * An action that represent a read of some resource(s).
		 * Example: 'GetStatusTransitions'
		 */
		export type ReadAction = PotentialSmartLinkAction & {
			'@type': 'ReadAction';
		};

		/**
		 * An action that represent a creation of some resource(s).
		 */
		export type CreateAction = PotentialSmartLinkAction & {
			'@type': 'CreateAction';
		};

		/**
		 * An action that represents an update of some resource.
		 * May contain embedded actions that signify how the data required to execute the action
		 * can be retrieved & updated
		 */
		export type UpdateAction = PotentialSmartLinkAction & {
			'@type': 'UpdateAction';
			dataRetrievalAction?: ReadAction;
			dataUpdateAction?: UpdateAction;
		};

		export type AtlassianActionSchema = PreviewAction;
		export type ClientAction = DownloadAction | ViewAction | AtlassianActionSchema;
		export type ServerAction =
			| AssignAction
			| CommentAction
			| DeleteAction
			| ReplyAction
			| ShareAction
			| SubscribeAction
			| WatchAction
			| CreateAction
			| ReadAction
			| UpdateAction;
		// We define which actions we support at current.
		export type Action = ServerAction | ClientAction;
		// For granularity in which platforms certain views are supported in.
		export type Platforms = 'web' | 'mobile';
	}

	export namespace Meta {
		export interface BaseMeta {
			[k: string]: any;
			access: Primitives.Access;
			'atlassian:remoteLinkCategory'?: string;
			auth?: Primitives.AuthService[];
			category?: any;
			containerId?: any;
			follow?: boolean;
			objectId?: any;
			product?: any;
			resourceType?: any;
			subproduct?: any;
			tenantId?: any;
			visibility: Primitives.Visibility;
		}

		export interface Public extends BaseMeta {
			access: 'granted';
			visibility: 'public';
		}
		export interface Granted extends BaseMeta {
			access: 'granted';
			visibility: 'restricted';
		}
		export interface Unauthorized extends BaseMeta {
			access: 'unauthorized';
			visibility: 'restricted';
		}
		export interface PermissionDenied extends BaseMeta {
			access: 'forbidden';
			visibility: 'restricted';
		}
		export interface NotFound extends BaseMeta {
			access: 'forbidden';
			visibility: 'not_found';
		}
	}

	export namespace Data {
		export interface BaseData extends Primitives.Object {
			'@context': Primitives.Context;
			'@type': Primitives.Property<Primitives.ObjectType>;
			/**
			 * The Atlassian Resource Identifier (ARI) of the object
			 */
			'atlassian:ari'?: string;
			'atlassian:createdBy'?:
				| Primitives.Link
				| Primitives.Person
				| Primitives.Collection<Primitives.Link | Primitives.Person>;
			// Most JSON-lD resoures will be downloadable; main path being Documents.
			'atlassian:downloadUrl'?: string;
			'atlassian:ownedBy'?: Primitives.Person;
			/**
			 * Added because schema:potentialAction could not be used by the new action implementation
			 * https://product-fabric.atlassian.net/wiki/spaces/EM/pages/3531374887/Alternatives+for+using+potentialActions+property
			 * https://team.atlassian.com/project/ATLAS-13099
			 */
			'atlassian:serverAction'?: Primitives.Property<Primitives.ServerAction>;
			// Used to store emoji value for content title
			'atlassian:titlePrefix'?: TitlePrefix;
			'atlassian:updatedBy'?:
				| Primitives.Link
				| Primitives.Person
				| Primitives.Collection<Primitives.Link | Primitives.Person>;
			// Used when a Smart Link is clicked, as opposed to the original URL being unfurled to its JSON-LD representation.
			'atlassian:visitUrl'?: string;
			'schema:dateCreated'?: string;
			'schema:potentialAction'?: Primitives.Property<Primitives.Action>;
		}

		export interface BaseCollectionData<T extends BaseData> extends Primitives.Collection<T> {
			'@context': Primitives.Context;
			'@type': Primitives.TypeProperty<Primitives.Type, 'Collection'>;
			// Context is present at the top level already.
			items: Omit<T, '@context'>[];
		}

		export interface BaseCollectionPage<T> extends Primitives.CollectionPage<T> {
			'@context': Primitives.Context;
			'@type': Primitives.TypeProperty<Primitives.Type, 'CollectionPage'>;
		}

		export interface TitlePrefix extends Primitives.Object {
			'@type': Primitives.Property<Primitives.ObjectType>;
			text: string;
		}

		export type DocumentAction =
			| DeleteAction
			| ViewAction
			| DownloadAction
			| ShareAction
			| CommentAction
			| WatchAction;
		export type DocumentParentType = 'Object' | 'Document';
		export type DocumentChildType =
			| 'schema:BlogPosting'
			| 'schema:TextDigitalDocument'
			| 'schema:DigitalDocument'
			| 'schema:PresentationDigitalDocument'
			| 'schema:SpreadsheetDigitalDocument'
			| 'atlassian:UndefinedLink'
			| 'Collection'; // For folders.
		export interface Document extends BaseData {
			'@type':
				| Primitives.TypeProperty<'Document', 'Object'>
				| Primitives.TypeProperty<DocumentChildType, DocumentParentType>
				| Primitives.TypeProperty<'schema:DigitalDocument', 'Document'>;
			'atlassian:attachmentCount'?: number;
			'atlassian:checkItems'?: Primitives.CheckItemProgress;
			'atlassian:dateViewed'?: string;
			'atlassian:fileSize'?: number;
			'atlassian:isDeleted'?: boolean;
			'atlassian:reactCount'?: number;
			'atlassian:readTimeInMinutes'?: number;
			'atlassian:state'?: string | Primitives.State;
			'atlassian:viewCount'?: number;
			'atlassian:viewerCount'?: number;
			'atlassian:voteCount'?: number;
			'schema:commentCount'?: number;
			'schema:fileFormat'?: string;
			'schema:potentialAction'?: Primitives.Property<DocumentAction>;
			version?: string;
		}

		export interface BlogPostDocument extends Document {
			'@type': Primitives.TypeProperty<'schema:BlogPosting', DocumentParentType>;
		}
		export interface PresentationDocument extends Document {
			'@type': Primitives.TypeProperty<'schema:PresentationDigitalDocument', DocumentParentType>;
		}
		export interface SpreadSheetDocument extends Document {
			'@type': Primitives.TypeProperty<'schema:SpreadsheetDigitalDocument', DocumentParentType>;
		}
		export type Template = Document;
		export interface TextDocument extends Document {
			'@type': Primitives.TypeProperty<'schema:TextDigitalDocument', DocumentParentType>;
		}

		export type DocumentFolder = BaseCollectionData<Document>;
		export type DocumentFolderPaged = BaseCollectionPage<Document>;

		export interface Image extends BaseData, Primitives.Image {
			'@type': 'Image';
		}

		export type MessageAction = ReplyAction | DeleteAction | ViewAction;
		export interface Message extends BaseData {
			'@type': Primitives.TypeProperty<'schema:Message'>;
			'atlassian:reactCount'?: number;
			dateRead?: string;
			dateReceived?: string;
			dateSent?: string;
			'schema:potentialAction'?: Primitives.Property<MessageAction>;
		}

		export type PageAction =
			| ViewAction
			| DownloadAction
			| ShareAction
			| CommentAction
			| WatchAction;
		export interface Page extends Primitives.Page, BaseData {
			'@type': Primitives.Page['@type'];
			'schema:commentCount'?: number; // > 0
			'schema:potentialAction'?: Primitives.Property<PageAction>;
		}

		export interface UndefinedLinkDocument extends Document {
			'@type': Primitives.TypeProperty<'atlassian:UndefinedLink', DocumentParentType>;
		}

		export interface Goal extends BaseData {
			'@type': Primitives.TypeProperty<'atlassian:Goal'>;
			'atlassian:state'?: string | Primitives.State;
			'atlassian:subscriber'?: Primitives.Link | Primitives.Person;
			'atlassian:subscriberCount'?: number;
			'schema:commentCount'?: number;
		}

		export interface Object extends BaseData {
			'@type': Primitives.TypeProperty<'atlassian:Object'>;
			'schema:attachmentCount'?: number;
			'schema:commentCount'?: number;
			'schema:dateCreated'?: string; // xsd:dateTime
		}

		export interface Type extends BaseData {
			'@type': Primitives.TypeProperty<'atlassian:Type'>;
			'schema:dateCreated'?: string; // xsd:dateTime
		}

		export interface Schema extends BaseData {
			'@type': Primitives.TypeProperty<'atlassian:Schema'>;
			'schema:dateCreated'?: string; // xsd:dateTime
		}

		export interface Project extends BaseData {
			'@type': Primitives.TypeProperty<'atlassian:Project'>;
			'atlassian:appliedToComponentsCount'?: number;
			'atlassian:attachmentCount'?: number;
			'atlassian:checkItems'?: Primitives.CheckItemProgress;
			'atlassian:isDeleted': boolean;
			'atlassian:member':
				| Primitives.Link
				| Primitives.Person
				| Primitives.Collection<Primitives.Person>;
			'atlassian:reactCount'?: number;
			'atlassian:state'?: string | Primitives.State;
			'schema:commentCount'?: number;
		}

		export interface SourceCodeDocument extends Document {
			'atlassian:latestCommit'?: Partial<SourceCodeCommit> | Primitives.Link;
			'schema:codeSampleType'?: string;
			'schema:potentialAction'?: Primitives.Property<DocumentAction>;
			'schema:programmingLanguage'?: string; // ComputerLanguage | Text
			'schema:runtimePlatform'?: string;
			'schema:targetProduct'?: string;
		}

		export type SourceCodeCommitAction = DeleteAction | ViewAction | WatchAction;
		export interface SourceCodeCommit extends BaseData {
			'@type': Primitives.TypeProperty<'atlassian:SourceCodeCommit'>;
			'atlassian:committedBy': Primitives.Link | Primitives.Person;
			'atlassian:parent'?: Primitives.Property<Primitives.Object | Primitives.Link>;
			'schema:commentCount'?: number; // xsd:datetime
			'schema:potentialAction'?: Primitives.Property<SourceCodeCommitAction>;
			'schema:programmingLanguage'?: string; // ComputerLanguage | Text
		}

		export type SourceCodePullRequestAction =
			| DeleteAction
			| ViewAction
			| DownloadAction
			| WatchAction;
		export interface SourceCodePullRequest extends BaseData {
			'@type': Primitives.TypeProperty<'atlassian:SourceCodePullRequest'>;
			'atlassian:internalId'?: string;
			'atlassian:isMerged': boolean;
			'atlassian:mergeable'?: boolean;
			'atlassian:mergeCommit'?: Partial<SourceCodeCommit> | Primitives.Link;
			'atlassian:merged'?: string; // xsd:dateTime
			'atlassian:mergedBy'?: Primitives.Link | Primitives.Person;
			'atlassian:mergeDestination'?:
				| Partial<SourceCodeCommit>
				| Partial<SourceCodeReference>
				| Primitives.Link;
			'atlassian:mergeSource'?:
				| Partial<SourceCodeCommit>
				| Partial<SourceCodeReference>
				| Primitives.Link;
			'atlassian:reviewedBy'?: Array<Primitives.Link | Primitives.Person>;
			'atlassian:reviewer'?: Array<Primitives.Link | Primitives.Person>;
			'atlassian:state': string | Primitives.Link | Primitives.State; // xsd:string | rdf:langString
			'atlassian:subscriberCount'?: number;
			'atlassian:voteCount'?: number;
			'schema:potentialAction'?: Primitives.Property<SourceCodePullRequestAction>;
			'schema:programmingLanguage'?: string;
		}

		export type SourceCodeReferenceAction = DownloadAction | DeleteAction | ViewAction;
		export interface SourceCodeReference extends BaseData {
			'@type': Primitives.TypeProperty<'atlassian:SourceCodeReference'>;
			'atlassian:commit': Partial<SourceCodeCommit> | Primitives.Link;
			'schema:potentialAction'?: Primitives.Property<SourceCodeReferenceAction>;
			'schema:programmingLanguage'?: string; // ComputerLanguage | Text
		}

		export type SourceCodeRepositoryAction =
			| DeleteAction
			| ViewAction
			| DownloadAction
			| WatchAction;
		export interface SourceCodeRepository extends BaseData {
			'@type': Primitives.TypeProperty<'atlassian:SourceCodeRepository'>;
			'atlassian:latestCommit'?: Partial<SourceCodeCommit> | Primitives.Link;
			'atlassian:subscriber'?: Primitives.Link | Primitives.Person;
			'atlassian:subscriberCount': number;
			'atlassian:viewCount'?: number;
			'atlassian:voteCount'?: number;
			'schema:potentialAction'?: Primitives.Property<SourceCodeRepositoryAction>;
			'schema:programmingLanguage'?: string; // ComputerLanguage | Text
		}

		export type TaskAction = Primitives.AssignedObjectActions;
		export interface Task extends BaseData, Primitives.AssignedObject {
			'@type': Primitives.TypeProperty<'atlassian:Task'>;
			'atlassian:attachmentCount'?: number;
			'atlassian:checkItems'?: Primitives.CheckItemProgress;
			'atlassian:completed'?: string;
			'atlassian:isCompleted'?: boolean;
			'atlassian:isDeleted'?: boolean;
			'atlassian:originalEstimateInSeconds'?: number;
			'atlassian:priority'?: string | Primitives.Object;
			'atlassian:reactCount'?: number;
			'atlassian:storyPoints'?: number;
			'atlassian:subTasks'?: Primitives.SubTasksProgress;
			'atlassian:taskStatus'?: Primitives.Object;
			'atlassian:taskType'?: TaskType | Primitives.Object | Primitives.Link;
			'atlassian:viewCount'?: number;
			'atlassian:voteCount'?: number;
			'schema:commentCount'?: number;
			'schema:potentialAction'?: Primitives.Property<TaskAction>;
		}

		export type TaskTypeAction = Primitives.AssignedObjectActions;
		export interface TaskType extends BaseData, Primitives.AssignedObject {
			'@type': Primitives.TypeProperty<'atlassian:Task'>;
			'atlassian:attachmentCount'?: number;
			'atlassian:checkItems'?: Primitives.CheckItemProgress;
			'schema:commentCount'?: number;
			'schema:dateCreated': string; // xsd:dateTime
			'schema:potentialAction'?: Primitives.Property<TaskTypeAction>;
		}
	}

	export interface Response<T extends Data.BaseData = Data.BaseData> {
		data: Data.BaseData | Data.BaseCollectionData<T> | Data.BaseCollectionPage<T> | undefined;
		meta: Meta.BaseMeta;
	}
	export interface Object<MetaType extends Meta.BaseMeta, DataType extends Data.BaseData> {
		data: DataType | undefined;
		meta: MetaType;
	}
	export interface Collection<
		MetaType extends Meta.BaseMeta = Meta.BaseMeta,
		ResourceType extends Data.BaseData = Data.BaseData,
		DataType = Data.BaseCollectionData<ResourceType>,
	> {
		data: DataType | undefined;
		meta: MetaType;
	}
}
