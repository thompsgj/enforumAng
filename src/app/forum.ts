export interface Settings {
	forumid?: string,
	courseId: string,
	name: string;
	description: string;
    gradingMethod: number;
    points: number;
    checklist: boolean;
    reflection: boolean;
    goals: boolean;
    criterias: any[];
    reflectionTasks: any[]; 
}

export class Forum {
	id: number;
	title = '';
	complete = false;

	constructor(values: Object = {}) {
		Object.assign(this, values);
	}
}

export interface Id {
	id: string;
}


export class ForumId {
	forumId: string;

	constructor(values: Object = {}) {
		Object.assign(this, values);
	}
}

export class ReplyId {
	replyId: string;

	constructor(values: Object = {}) {
		Object.assign(this, values);
	}
}

export class Post {
	id: number;
	title = '';
	complete = false;

	constructor(values: Object = {}) {
		Object.assign(this, values);
	}
}

export interface PostContent {
	id: string,
	userid?: string,
	title: string,
	poster: string,
	content: string,
	criterias: any[],
	reflectionTasks: any[]
}

export interface ReplyContent {
    id: string,
    userid: string,
    title: string,
    poster: string,
    content: string    
}

export class Reply {
	id: string;
	title: string;
	content: string;
}

export interface Course {
	title: string;
	description: string;
	instructor: string;
	students?: any[];
}

export interface User {
	id: string,
	name: string,
	email: string,
	role: string,
	studentid?: string
}

export interface Feedback {
	comment: string
}

export interface Goals {
	goals: any[]
}

export interface UpdateUserDetails {
	role: string;
	userid: string;
	name: string;
}

export interface LoginCredentials {
	email: string;
	password: string;
}