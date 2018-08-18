import { Injectable } from '@angular/core';
import { HttpModule,Http, Response, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import { Forum, Settings, Id, ForumId, ReplyId, Post, PostContent, Reply, ReplyContent, Course, Feedback, Goals, User } from './forum';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/fromPromise';
import {HttpClient} from '@angular/common/http'

const API_URL = 'http://localhost:3000/api';

@Injectable()
export class ApiService {
	constructor(
		private http: Http,
		private requestOptions : RequestOptions,
		private httpClient: HttpClient
	) {}



	public createForum(settings: Settings): Observable<Forum> {
		return this.http
			.post(API_URL + '/forum', settings)
			.map(response => {
				return new Forum(response.json());
			})
			.catch(this.handleError);
	}



	public retrieveForums(courseId): Observable<Forum> {
		return this.http
			.get(API_URL + '/forum/list/' + courseId)
			.map(response => {
				const ForumList = response.json()

				return ForumList;
			})
			.catch(this.handleError);
	}

	public deleteForum(forumId: Id): Observable<ForumId> {
		return this.http
			.post(API_URL + '/forum/delete', forumId)
			.map(response => {
				const id = response.json()

				return id
			})
			.catch(this.handleError)
	}


	public createPost(post: PostContent): Observable<Post> {
		return this.http
			.post(API_URL + '/post/create', post)
			.map(response => {
				return new Post(response.json())
			})
			.catch(this.handleError);
	}


	public retrievePosts(forumId: Id): Observable<Forum> {
		return this.http
			.get(API_URL + '/forums/' + forumId)
			.map(response => {
				const PostList = response.json()

				return PostList;
			})
			.catch(this.handleError);
	}

	public deletePost(threadId: Id): Observable<ForumId> {
		return this.http
			.post(API_URL + '/forum/thread/delete', threadId)
			.map(response => {
				const id = response.json()

				return id
			})
			.catch(this.handleError)
	}


	public retrieveReplies(threadId: Id): Observable<Post> {
		return this.http
			.get(API_URL + '/forum/thread/' + threadId)
			.map(response => {
				const ReplyList = response.json()

				return ReplyList
			})
			.catch(this.handleError)
	}

	public createReply(reply: ReplyContent): Observable<Reply> {
		return this.http
			.post(API_URL + '/reply/create', reply)
			.map(response => {
				return response.json()
			})
			.catch(this.handleError)
	}


	public deleteReply(replyId: Id): Observable<ReplyId> {
		return this.http
			.post(API_URL + '/reply/delete', replyId)
			.map(response => {
				const id = response.json()

				return id
			})
			.catch(this.handleError)
	}

	public editForum(settings) {
		return this.http
			.put(API_URL + '/forum/update/' + settings._id, settings )
	}


	public retrievePost(postId: Id): Observable<ReplyId> {
		return this.http
			.get(API_URL + '/forum/thread/' + postId)
			.map(response => {
				const postContent = response.json()

				return postContent;
			})
			.catch(this.handleError);
	}

	public editPost(post) {
		return this.http
			.put(API_URL + '/forum/thread/update/' + post._id, post)
	}

	public retrieveReply(replyId): Observable<Post> {
		return this.http
			.get(API_URL + '/reply/' + replyId, replyId)
			.map(response => {
				const ReplyList = response.json()

				return ReplyList
			})
			.catch(this.handleError)
	}

	public editReply(reply) {
		return this.http
			.put(API_URL + '/reply/update/' + reply._id, reply)
	}

	public addCourse(course: Course): Observable<Course> {
		return this.http
				.post(API_URL + '/course/create', course)
				.map(response => {
					return response.json();
				})
				.catch(this.handleError);
	}

	public registerUser(user: User) {
		return this.http
				.post(API_URL + '/register', user)
				.map(response => {
					return response.json()
				})
				.catch(this.handleError);
	}

/* HTTP Way */
	public retrieveCourses(userPackage): Observable<Course> {
	    let myHeaders = new Headers(); 
	    myHeaders.append('userId', userPackage._id);
	    myHeaders.append('role', userPackage.role)  

	    let options = new RequestOptions({ headers: myHeaders });

			return this.http
				.get(API_URL + '/courses', options)
				.map(response => {
					const CourseList = response.json()

					return CourseList;
				})
				.catch(this.handleError);
	}


//HTTP Client Way
/*
	public retrieveCourses(userId) {
		this.httpClient.get(API_URL + '/courses/' + userId, {
			params: {
				userId : userId
			},
			observe: 'response'
		})
		.toPromise()
		.then(response => {
				console.log("API SERVICE RETRIEVE COURSES RESPONSE", response);

				const CourseList = response.body
				console.log("COURSE LIST", CourseList)
				return CourseList;			
		})
	}
*/



	public retrieveUsers() {
		return this.http
			.get(API_URL + '/users')
			.map(response => {
				const UserList = response.json()

				return UserList
			})
	}

	public retrieveUserMatch(userId) {
		return this.http
			.get(API_URL + '/usermatch/' + userId)
			.map(response => {
				const UserList = response.json()

				return UserList
			})
	}

	public enrollUser(enrollIds: Id) {
		return this.http
			.post(API_URL + '/enrolluser', enrollIds)
			.map(response => {
				return response.json()
			})
			.catch(this.handleError);
	}

	public retrieveEnrolledUsers(courseId: Id): Observable<Course> {
		return this.http
			.get(API_URL + '/enrolledusers/' + courseId)
			.map(response => {
				const EnrolledUserList = response.json()

				return EnrolledUserList
			})
	}

	public unenrollUser(unenrollIds: Id) {
		return this.http
			.put(API_URL + '/unenrolluser', unenrollIds)
			.map(response => {
				return response.json()
			})
			.catch(this.handleError)
	}

	public createTeacherFeedback(feedback: Feedback): Observable<Feedback> {
		return this.http
			.put(API_URL + '/post/feedback', feedback)
			.map(response => {
				return response.json()
			})
			.catch(this.handleError)
	}

	public retrieveInstructors() {
		return this.http
			.get(API_URL + '/instructors')
			.map(response => {
				const InstructorList = response.json()

				return InstructorList;
			})
			.catch(this.handleError);
	}

	public retrieveGoals(goals) {
		return this.http
			.get(API_URL + '/goals/' + goals.courseId + '/' + goals.forumId + '/' + goals.userId)
			.map(response => {
				const goalList = response.json()

				return goalList;
			})
			.catch(this.handleError);
	}

	public setGoals(goals) {
		return this.http
			.put(API_URL + '/goals/create', goals)
	}

	public updateGoals(goals) {
		return this.http
			.put(API_URL + '/goals/update', goals)
			.map(response => {
				return response.json()
			})
			.catch(this.handleError)
	}

	public retrieveUser(userId: Id) {
		return this.http
			.get(API_URL + '/user/' + userId)
			.map(response => {
				const user = response.json()

				return user
			})
	}

	public retrieveCourseSelectionList() {
		return this.http
			.get(API_URL + '/courses/list')
			.map(response => {
				const courses = response.json()

				return courses
			})
	}

	public updateCourse(course: Course) {
		return this.http
			.put(API_URL + '/course/update', course)
			.map(response => {
				const course = response.json()

				return course
			})
	}

	private handleError (error: Response | any) {
    	console.error('ApiService::handleError', error);
    	return Observable.throw(error);
  	}

}