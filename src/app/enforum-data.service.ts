import { Injectable } from '@angular/core';
import { 
	Forum,
	Settings,
	Id,
	ForumId,
	Post,
	PostContent,
	Reply,
	ReplyContent,
	Course,
	User,
	Goals
} from './forum';
import { ApiService } from './api.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/delay';
import 'rxjs/add/observable/fromPromise';
@Injectable()
export class EnforumDataService {
	constructor( 
		private api: ApiService
	) {}


	//FORUM CRUD OPERATIONS
	//Create Forum
	createForum(settings: Settings): Observable<Forum> {
		return this.api.createForum(settings);
	}

	//Retrieve Forum List
	retrieveForums(courseId): Observable<Forum> {
		return this.api.retrieveForums(courseId);
	}

	//Delete Forum
	deleteForum(forumId) {
		return this.api.deleteForum(forumId)
	}

	//Create Post
	createPost(post: PostContent): Observable<Post> {
		return this.api.createPost(post);
	}

	//THREAD CRUD OPERATIONS
	retrievePosts(forumId): Observable<Forum> {
		return this.api.retrievePosts(forumId)
	}

	//Delete Post
	deletePost(threadId) {
		return this.api.deletePost(threadId)
	}


	//Retrieve Replies
	retrieveReplies(threadId): Observable<Post> {
		return this.api.retrieveReplies(threadId);
	}

	//Create Reply
	createReply(reply: ReplyContent): Observable<Reply> {
		return this.api.createReply(reply);
	}

	//Delete Reply
	deleteReply(replyId) {
		return this.api.deleteReply(replyId)
	}

	//Edit Forum
	editForum(forum) {
		return this.api.editForum(forum)
	}

	//Retrieve Post
	retrievePost(postId) {
		return this.api.retrievePost(postId)
	}

	//Edit Post
	editPost(post) {
		return this.api.editPost(post);
	}

	//Retrieve Reply
		//Retrieve Replies
	retrieveReply(replyId) {
		return this.api.retrieveReply(replyId);
	}

	editReply(reply) {
		return this.api.editReply(reply);
	}

	addCourse(course): Observable<Course> {
		return this.api.addCourse(course);
	}

	registerUser(user): Observable<User> {
		return this.api.registerUser(user);
	}

	retrieveCourses(userPackage): Observable<Course> {
		return this.api.retrieveCourses(userPackage);
	}

	retrieveUsers(): Observable<User> {
		return this.api.retrieveUsers();
	}

	retrieveUserMatch(userId): Observable<User> {
		return this.api.retrieveUserMatch(userId);
	}

	enrollUser(enrollIds): Observable<User> {
		return this.api.enrollUser(enrollIds);
	}

	retrieveEnrolledUsers(courseId) {
		return this.api.retrieveEnrolledUsers(courseId);
	}

	unenrollUser(unenrollIds): Observable<User> {
		return this.api.unenrollUser(unenrollIds)
	}

	createTeacherFeedback(feedback) {
		return this.api.createTeacherFeedback(feedback)
	}

	retrieveInstructors() {
		return this.api.retrieveInstructors()
	}

	retrieveGoals(goals) {
		return this.api.retrieveGoals(goals)
	}

	setGoals(goals) {
		return this.api.setGoals(goals)
	}

	updateGoals(goals) {
		return this.api.updateGoals(goals)
	}

	retrieveUser(userId: Id): Observable<User> {
		return this.api.retrieveUser(userId)
	}

	retrieveCourseSelectionList() {
		return this.api.retrieveCourseSelectionList();
	}

	updateCourse(course: Course): Observable<Course> {
		return this.api.updateCourse(course);
	}

}

