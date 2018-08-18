var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');

var auth = jwt({
	secret: 'MY_SECRET',
	userProperty: 'payload'
});

var ctrlForums = require('../controllers/forums');
var ctrlAuth = require('../controllers/authentication')

router.get('/', function(req, res, next) {
  res.send('Express RESTful API');
});

//Posts
router.post('/post/create', ctrlForums.createPost);
router.put('/post/feedback', ctrlForums.createTeacherFeedback)

//Forums
///////////////////////////////////
router.get('/profile', auth, ctrlForums.profileRead);
router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);
router.put('/user/self/update', ctrlAuth.updateSelf);
router.put('/user/general/update', ctrlAuth.updateUser);
///////////////////////////////////
router.post('/forum', ctrlForums.createForum); //Create a Post
router.get('/forum/list/:courseid', ctrlForums.viewForumList); //View List of Forums
router.get('/forums/:forumid', ctrlForums.viewReadOne); //View One Forum's Posts
router.post('/forum/delete', ctrlForums.deleteForum); //Delete a Forum
router.put('/forum/update/:forumid', ctrlForums.updateForum);//Update a Forum's Settings
router.get('/forum/:threadid/posts', ctrlForums.viewThread);//View List of Posts/Replies in a Thread
router.post('/forum/thread/delete', ctrlForums.deleteThread);//Delete a Thread
router.get('/forum/thread/:threadid', ctrlForums.viewThreadPost)//View One Thread's Main Post
router.put('/forum/thread/update/:threadid', ctrlForums.updateThread)//Update a Thread
router.get('/reply/:replyid', ctrlForums.retrieveReply);//View Reply Contents
router.post('/reply/create', ctrlForums.createReply); //Create a Reply
router.post('/reply/delete', ctrlForums.deleteReply);//Delete a Reply
router.put('/reply/update/:replyid', ctrlForums.updateReply);//Update a Reply
router.post('/grade', ctrlForums.setGrade)//Set Grade

router.get('/courses', ctrlForums.viewCourseList);
router.get('/courses/list', ctrlForums.viewCourseSelectionList);
router.post('/course/create', ctrlForums.createCourse);
router.put('/course/update', ctrlForums.updateCourse);

router.put('/goals/create', ctrlForums.setGoals);
router.put('/goals/update', ctrlForums.updateGoals);
router.get('/goals/:courseid/:forumid/:userid', ctrlForums.retrieveGoals);

//Users
router.get('/users', ctrlForums.retrieveUsers);
router.get('/user/:userid', ctrlForums.retrieveUser);

router.get('/instructors', ctrlForums.retrieveInstructors);
router.get('/usermatch/:userid', ctrlForums.retrieveUserMatch);
router.post('/enrolluser', ctrlForums.enrollUser);
router.get('/enrolledusers/:courseid', ctrlForums.retrieveEnrolledUsers);
router.put('/unenrolluser', ctrlForums.unenrollUser);

module.exports = router;