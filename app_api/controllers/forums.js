var monk = require('monk');
var assert = require('assert');
var asynch = require('asynch');
var db = monk('localhost:27017/enforum');
var forumcoll = db.get('forumcollection');
var coursecoll = db.get('coursecollection');
var userscoll = db.get('userscollection');

var sendJsonResponse = function(res, status, content) {
	res.status(status);
	res.json(content);
};
///////////////////////////////////////////
var mongoose = require('mongoose');
var User = mongoose.model('User');

module.exports.profileRead = function(req, res) {
  if (!req.payload._id) {
    res.status(401).json({
      "message" : "UnauthorizedError: private profile"
    });
  } else {
    User
      .findById(req.payload._id)
      .exec(function(err, user) {
        res.status(200).json(user);
      });
  }

};
///////////////////////////////////////////
module.exports.createCourse = function(req, res) {
	ObjectID = require('mongodb').ObjectID
	coursecoll.insert({
		title: req.body.title,
		description: req.body.description,
		instructor: ObjectID(req.body.instructor),
		students: []
	}).then(function(doc, err) {
		if(err) {
			res.send("Problem");
		} else {
			sendJsonResponse(res, 201, doc);
		}
	})
}

module.exports.viewCourseList = function(req, res) {
	ObjectID = require('mongodb').ObjectID;

	if( req.headers.role === "admin") {
		coursecoll.find({

		}).then(function(doc, err) {
			if(err) {
				res.send("Problem");
			} else {
				sendJsonResponse(res, 201, doc)
			}
		})
	} else {
		coursecoll.find({
			"students.id": ObjectID(req.headers.userid)
		}).then(function(studentCourses, err){
			coursecoll.find({
				"instructor": ObjectID(req.headers.userid)
			}).then(function(instructorCourses, err) {
				if(err) {
					res.send("Problem");
				} else {

					courseArr = studentCourses.concat(instructorCourses)

					sendJsonResponse(res, 201, courseArr);
				}
			})
		})		
	}
}

///////////////////////////////////////////
module.exports.createForum = function(req, res) {
	
	let today = new Date();
	let newForumDate = today.getFullYear() + '-' + (today.getMonth()+1) + '-' + today.getDate();


	ObjectID = require('mongodb').ObjectID;
	forumcoll.insert({
		courseId: ObjectID(req.body.courseId),
		settings: {
			name: req.body.name ,
			description: req.body.description ,
			/*
			dateRestrictions: {
				dateOpen: req.body. ,
				dateClosed: req.body. 
			},
			*/
			gradingMethod: req.body.gradingMethod ,
			points: req.body.points ,
			checklist: req.body.checklist ,
			reflection: req.body.reflection,
			goals: req.body.goals,
			criterias: req.body.criterias,
			reflectionTasks: req.body.reflectionTasks,
			creationDate: today,
		},
		posts: []
	}).then(function(doc, err) {
		if(err) {
			res.send("Problem");
		} else {
			sendJsonResponse(res, 201, doc);
		}
	})
}

////////////////////////////////////////////
module.exports.retrieveUsers = function(req, res) {
	userscoll.find({

	}).then(function(doc, err) {
		if(err) {
			res.send("Problem");
		} else {
			sendJsonResponse(res, 201, doc);
		}		
	})
}

module.exports.retrieveUser = function(req, res) {
	userscoll.find({
		"_id": req.params.userid
	}).then(function(doc, err) {
		if(err) {
			res.send("Problem");
		} else {
			sendJsonResponse(res, 201, doc);
		}		
	})
}

module.exports.retrieveUserMatch = function(req, res) {
	userscoll.find({
		name: req.params.userid
	}).then(function(doc, err) {
		if(err) {
			res.send("Problem");
		} else {
			sendJsonResponse(res, 201, doc);
		}		
	})
}


module.exports.enrollUser = function(req, res) {
	ObjectID = require('mongodb').ObjectID

	coursecoll.update({
		_id: ObjectID(req.body.courseId)
	},{
		$push:{
			"students" :{
				id: ObjectID(req.body.userId),
				name: req.body.name,
				studentid: req.body.studentid
			}
		}
	}).then(function(doc, err) {
		if(err) {
			res.send("Problem");
		} else {
			sendJsonResponse(res, 201, doc);
		}
	})
}

module.exports.retrieveEnrolledUsers = function(req, res) {
	ObjectID = require('mongodb').ObjectID

	coursecoll.find({
		"_id": ObjectID(req.params.courseid)
	}).then(function(doc, err) {
		if(err) {
			res.send("Problem");
		} else {
			sendJsonResponse(res, 201, doc);
		}
	})
}

module.exports.unenrollUser = function(req, res) {
	ObjectID = require('mongodb').ObjectID

	coursecoll.update({
		_id: ObjectID(req.body.courseId)
	},{
		$pull:{
			"students" :{
				id: ObjectID(req.body.userId)
			}
		}
	}).then(function(doc, err) {
		if(err) {
			res.send("Problem");
		} else {
			sendJsonResponse(res, 201, doc);
		}
	})
}


////////////////////////////////////////////
module.exports.viewForumList = function(req, res) {
	ObjectID = require('mongodb').ObjectID

	coursecoll.find({
		_id: ObjectID(req.params.courseid)
	}).then(function(courseData, err) {
		if(err) {
			res.send("Problems")
		} else {
			
			forumcoll.find({
				courseId: ObjectID(req.params.courseid)
			}).then(function(doc, err){
				if(err) {
					res.send("Problem");
				} else {
					doc[0].courseTitle = courseData[0].title
					sendJsonResponse(res, 201, doc);
				}

			})

		}
	})


}


module.exports.deleteForum = function(req, res) {
	forumcoll.remove({
		_id: req.body.id
	}).then(function(doc, err) {
		if(err) {
			res.send("Problem");
		} else {
			sendJsonResponse(res, 201, doc);
		}
	})
}

module.exports.viewReadOne = function(req, res) {
	forumcoll.find({
		_id: req.params.forumid
	}).then(function(doc, err) {
		if(err){
			res.send("Problem");
		} else {
			sendJsonResponse(res, 201, doc);
		}
	})
}

module.exports.updateForum = function(req, res) {
	forumcoll.update({_id: req.body.forumid},{
		$set:{
			settings: {
				name: req.body.name ,
				description: req.body.description,
				/*
				dateRestrictions: {
					dateOpen: req.body. ,
					dateClosed: req.body. 
				},
				*/
				gradingMethod: req.body.gradingMethod,
				points: req.body.points,
				checklist: req.body.checklist,
				reflection: req.body.reflection,
				goals: req.body.goals,
				criterias: req.body.criterias,
				reflectionTasks : req.body.reflectionTasks
			}
		}
	}).then(function(doc, err) {
		if(err) {
			res.send("Problem");
		} else {
			sendJsonResponse(res, 201, doc);
		}
	})
}

module.exports.createPost = function(req, res) {
	ObjectID = require('mongodb').ObjectID;
	uploadData = {
			posts: {
				_id: new ObjectID(),
				userid: req.body.userid,
				poster: req.body.poster,
				title: req.body.title,
				content: req.body.content,
				beginPost : req.body.beginPost,
				sendPost : req.body.sendPost,
				wordCount : req.body.content.split(' ').length,
				criterias : req.body.criterias,
				reflectionTasks : req.body.reflectionTasks,
				replies: []
			}	
		}
	forumcoll.update(
		{_id: req.body.id},
		{ $push: uploadData}
	).then(function(doc, err) {
		if(err) {
			res.send("Problem");
		} else {
			sendJsonResponse(res, 201, uploadData);
		}
	})
}

module.exports.viewThread = function(req, res) {
	ObjectID = require('mongodb').ObjectID
	forumcoll.find({
		"posts._id" : ObjectID(req.params.threadid)
	}, {
		"posts.$" : 1
	}).then(function(doc, err) {
		if(err){
			res.send("Problem");
		} else {
			sendJsonResponse(res, 201, doc);
		}
	})
}

module.exports.deleteThread = function(req, res) {
	ObjectID = require('mongodb').ObjectID
	forumcoll.update({
		"posts._id": ObjectID(req.body.id)
	},{
		$pull : {"posts": {"_id": ObjectID(req.body.id)}}
	}).then(function(doc, err) {
		if(err) {
			res.send("Problem");
		} else {
			sendJsonResponse(res, 201, doc);
		}
	})
}



module.exports.viewThreadPost = function(req, res) {
	ObjectID = require('mongodb').ObjectID
	forumcoll.find({
		"posts._id": ObjectID(req.params.threadid)
	}, {
		"settings.points": 1,
		"posts.$" : 1
	}).then(function(doc, err) {
		if(err) {
			res.send("Problem");
		} else {
			sendJsonResponse(res, 201, doc);
		}
	})
}

module.exports.updateThread = function(req, res) {
	ObjectID = require('mongodb').ObjectID
	forumcoll.update({
		"posts._id": ObjectID(req.body._id)
	},{
		$set:{
			"posts.$._id": ObjectID(req.body._id),
			"posts.$.userid": req.body.userid,
			"posts.$.poster": req.body.poster,
			"posts.$.title": req.body.title,
			"posts.$.content": req.body.content,
			"posts.$.beginPost": req.body.beginPost,
			"posts.$.sendPost": req.body.sendPost,
			"posts.$.wordCount" : req.body.content.split(' ').length,
			"posts.$.criterias" : req.body.criterias,
			"posts.$.reflectionTasks" : req.body.reflectionTasks
		}
	}).then(function(doc, err) {
		if(err) {
			res.send("Problem");
		} else {
			sendJsonResponse(res, 201, doc);
		}
	})
}

module.exports.createReply = function(req, res) {
	ObjectID = require('mongodb').ObjectID
	forumcoll.findOneAndUpdate({
		"posts._id": ObjectID(req.body.id)
	},{
		$push: {
			"posts.$.replies": {
				"_id": new ObjectID(),
				"userid": req.body.userid,
				"poster": req.body.poster,
				"title": req.body.title,
				"content": req.body.content,
				"beginReply": req.body.beginReply,
				"sendReply": req.body.sendReply
			}
		}
	}).then(function(doc, err) {
		if(err) {
			res.send("Problem");
		} else {

	      //Get Posts from Doc and filter for the right post
	      var filteredPost = doc.posts.find( post => post._id == req.body.id)

	      //Get replies from filtered post and filter again for the right reply
	      var filteredReply = filteredPost.replies.find( reply => reply.content == req.body.content)

			sendJsonResponse(res, 201, filteredReply);
		}
	})
}

module.exports.deleteReply = function(req, res) {
	ObjectID = require('mongodb').ObjectID
	forumcoll.update({
		"posts.replies._id": ObjectID(req.body.id)
	},{
		$pull : {"posts.$.replies": {"_id": ObjectID(req.body.id)}}
	}).then(function(doc, err) {
		if(err) {
			res.send("Problem");
		} else {
			sendJsonResponse(res, 201, doc);
		}
	})
}

module.exports.updateReply = function(req, res) {
	ObjectID = require('mongodb').ObjectID

	//Need to revisit this setup for MongoDB
	var MongoClient = require('mongodb').MongoClient;
	MongoClient.connect("mongodb://localhost:27017").then(client => {
		const db = client.db("enforum");
		const collection = db.collection("forumcollection");

		collection.update({
		"posts.replies._id": ObjectID(req.body._id)
	}, {
		$set : {
			"posts.$.replies.$[j]": {
				"_id": ObjectID(req.body._id),
				"userid": req.body.userid,
				"poster": req.body.poster,
				"title": req.body.title,
				"content": req.body.content,
				"beginReply": req.body.beginReply,
				"sendReply": req.body.sendReply
			}
		}
	}, {
		arrayFilters: [
			{"j._id": ObjectID(req.body._id)}
		]
	}).then(function(doc, err) {
		if(err) {
			res.send("Problem");
		} else {
			sendJsonResponse(res, 201, doc);
		}
	})
	})
}

module.exports.retrieveReply = function(req, res){
	ObjectID = require('mongodb').ObjectID

	forumcoll.aggregate([{
		"$match": {"posts.replies._id": ObjectID(req.params.replyid)}
	}, {
		"$unwind":"$posts"
	}, {
		"$unwind":"$posts.replies"
	}, {
		"$replaceRoot":{"newRoot":"$posts.replies"}
	}, {
		"$match": {"_id": ObjectID(req.params.replyid)}
	}
	]).then(function(doc, err) {
		if(err){
			res.send("Problem");
		} else {
			sendJsonResponse(res, 201, doc);
		}
	})

}

module.exports.setGrade = function(req, res) {
	//Need to revisit this setup for MongoDB
	var MongoClient = require('mongodb').MongoClient;
	MongoClient.connect("mongodb://localhost:27017").then(client => {
		const db = client.db("enforum");
		const collection = db.collection("forumcollection");

		if(req.body.type == "reply") {
			
			collection.update({
				"posts.replies._id": ObjectID(req.body.id)
			}, {
				"$set" : {
						"posts.$.replies.$[j].grade": req.body.grade
				}
			}, {
				arrayFilters: [
					{"j._id": ObjectID(req.body.id)}
				]
			}).then(function(doc, err) {
				if(err) {
					res.send("Problem");
				} else {
					sendJsonResponse(res, 201, doc);
				}
			})
		} else {
			collection.update({
				"posts._id": ObjectID(req.body.id)
			}, {
				"$set" : {
						"posts.$.grade": req.body.grade
				}
			}).then(function(doc, err) {
				if(err) {
					res.send("Problem");
				} else {
					sendJsonResponse(res, 201, doc);
				}
			})
		}
	})
}


module.exports.createTeacherFeedback = function(req, res) {
	ObjectID = require('mongodb').ObjectID
	forumcoll.update({
		"posts._id": ObjectID(req.body.id)
	},{
		$set:{
			"posts.$.teacherFeedback": req.body.comment,
		}
	}).then(function(doc, err) {
		if(err) {
			res.send("Problem");
		} else {
			sendJsonResponse(res, 201, doc);
		}
	})
}

module.exports.retrieveInstructors = function(req, res) {
	userscoll.find({
		"role":"teacher"
	}).then(function(doc, err) {
		if(err) {
			res.send("Problem");
		} else {
			sendJsonResponse(res, 201, doc);
		}
	})
}

module.exports.retrieveGoals = function(req, res) {
	ObjectID = require('mongodb').ObjectID

	let today = new Date();

	userscoll.find({
		"_id": ObjectID(req.params.userid)	
	}, {"goals": 1}).then(function(goals, err) {
		if(err) {
		} else {
			if(goals.length == 0) {
				sendJsonResponse(res,201,goals)
			} else {
				userscoll.aggregate([
					{$match: {"_id": ObjectID(req.params.userid)}},
					{$project: {goals:1}},
					{$unwind: '$goals'},
					{$match:{'goals.forumId':{$lt: ObjectID(req.params.forumid)}, 'goals.courseId': ObjectID(req.params.courseid)}},
					{$sort:{"goals.forumId": -1}},
					{$limit:1}
				]).then(function(doc, err) {
					if(err) {
						res.send("Problem");
					} else {
						sendJsonResponse(res, 201, doc);
					}
				})		

			}
		}

	})
}

module.exports.setGoals = function(req, res) {
	let today = new Date();
	//let goalDate = today.getFullYear() + '-' + (today.getMonth()+1) + '-' + today.getDate();

	ObjectID = require('mongodb').ObjectID

	req.body.goals.forumId = ObjectID(req.body.forumId)
	req.body.goals.courseId = ObjectID(req.body.courseId)

	req.body.goals.creationDate = today

	req.body.goals._id = new ObjectID()

	userscoll.update({
		"_id": ObjectID(req.body.userId)
	}, {
		$push: {
			"goals": req.body.goals
		}
	})

}

module.exports.updateGoals = function(req, res) {
	ObjectID = require('mongodb').ObjectID

	userscoll.update({
		"goals._id":ObjectID(req.body.goalId)
	}, {
		$set: {"goals.$.goals": req.body.goals}
	})
	.then(function(doc, err) {
		if(err) {
			res.send("Problem");
		} else {
			sendJsonResponse(res, 201, doc);
		}
	})	
}

module.exports.viewCourseSelectionList = function(req, res) {
	coursecoll.find({

	}).then(function(doc, err) {

		if(err) {
			res.send("Problem")
		} else {
			sendJsonResponse(res, 201, doc)
		}
	})
}

module.exports.updateCourse = function(req, res) {
	ObjectID = require('mongodb').ObjectID

	coursecoll.update({
		"_id": ObjectID(req.body.id)
	}, {
		$set: {
			title: req.body.title,
			description: req.body.description,
			instructor: ObjectID(req.body.instructor)			
		}
	}).then(function(doc, err) {

		if(err) {
			res.send("Problem")
		} else {
			sendJsonResponse(res, 201, doc)
		}
	})

}


/* DB SUM AGGREGATION

db.forumcollection.aggregate([{$project: {wordCount:{$sum: "$posts.wordCount"}}}])

db.forumcollection.aggregate([{$project: {wordCount:{$avg: "$posts.wordCount"}}}])

*/

/*

---------------
Example Data Schema
{
	settings: {
		name: "Forum Title",
		directions: "Forum Directions",
		dateRestrictions: {
			dateOpen: "2017-03-01",
			dateClosed: "2017-03-07"
		},
		points: 10,
		gradingMethod: "Sum",
		tutorial: "on",
		reflection: "on"
	},
	posts: [
		{
			title: "Test Post 1",
			poster: "User1",
			content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris dapibus luctus ligula, in mattis lorem pulvinar sit amet. Suspendisse potenti. Suspendisse potenti. Nam a nisi sit amet augue interdum feugiat. Ut sodales at arcu in efficitur. Aenean mattis auctor dictum. Fusce nec lorem eget diam ultrices hendrerit. Mauris dignissim metus eget felis tincidunt, non faucibus nisl consectetur. Duis porttitor interdum nunc ac laoreet. Ut aliquet leo eget ligula tempor, in accumsan libero sodales. Nullam sit amet pretium ex, vel ornare purus. Mauris ut molestie erat. Vestibulum eleifend dui eu enim dignissim, et interdum nibh dignissim. Nulla blandit lectus ac est rutrum cursus. Donec posuere risus at fringilla aliquam. Praesent et mi sit amet sem consectetur viverra. ",
			replies: [
				{
					title: "Test Reply Title 1",
					name: "Test Reply Name 1",
					reply: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris dapibus luctus ligula, in mattis lorem pulvinar sit amet. Suspendisse potenti. Suspendisse potenti. Nam a nisi sit amet augue interdum feugiat. Ut sodales at arcu in efficitur. Aenean mattis auctor dictum. Fusce nec lorem eget diam ultrices hendrerit. Mauris dignissim metus eget felis tincidunt, non faucibus nisl consectetur. Duis porttitor interdum nunc ac laoreet. Ut aliquet leo eget ligula tempor, in accumsan libero sodales. Nullam sit amet pretium ex, vel ornare purus. Mauris ut molestie erat. Vestibulum eleifend dui eu enim dignissim, et interdum nibh dignissim. Nulla blandit lectus ac est rutrum cursus. Donec posuere risus at fringilla aliquam. Praesent et mi sit amet sem consectetur viverra. ",
					date: "2017-03-02"
				}, 
				{
					title: "Test Reply Title 2",
					name: "Test Reply Name 2",
					reply: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris dapibus luctus ligula, in mattis lorem pulvinar sit amet. Suspendisse potenti. Suspendisse potenti. Nam a nisi sit amet augue interdum feugiat. Ut sodales at arcu in efficitur. Aenean mattis auctor dictum. Fusce nec lorem eget diam ultrices hendrerit. Mauris dignissim metus eget felis tincidunt, non faucibus nisl consectetur. Duis porttitor interdum nunc ac laoreet. Ut aliquet leo eget ligula tempor, in accumsan libero sodales. Nullam sit amet pretium ex, vel ornare purus. Mauris ut molestie erat. Vestibulum eleifend dui eu enim dignissim, et interdum nibh dignissim. Nulla blandit lectus ac est rutrum cursus. Donec posuere risus at fringilla aliquam. Praesent et mi sit amet sem consectetur viverra. ",
					date: "2017-03-03"
				}
			],
			reflection: {
				checklist: ["Topic Sentence Present", true, "3 Support Sentences", true, "1 Conclusion Sentence", true],
				studentSummary: "Aenean ut dui nec quam congue luctus. Vestibulum velit velit, cursus vel nulla non, fermentum sagittis arcu. Etiam lacus eros, rhoncus id facilisis ut, feugiat ut enim. Integer quis venenatis quam. Praesent blandit sodales mi et consectetur. Vivamus et scelerisque nunc, vitae ultricies ex. Morbi ac porttitor est, in auctor urna. Proin mattis, eros non tempor consectetur, purus orci efficitur leo, vel viverra ante orci et velit. Vivamus consequat libero eu tortor lobortis fringilla.",
				teacherFeedback: "Aenean ut dui nec quam congue luctus. Vestibulum velit velit, cursus vel nulla non, fermentum sagittis arcu. Etiam lacus eros, rhoncus id facilisis ut, feugiat ut enim. Integer quis venenatis quam. Praesent blandit sodales mi et consectetur. Vivamus et scelerisque nunc, vitae ultricies ex. Morbi ac porttitor est, in auctor urna. Proin mattis, eros non tempor consectetur, purus orci efficitur leo, vel viverra ante orci et velit. Vivamus consequat libero eu tortor lobortis fringilla."
			},
			feedback: "This is the space where teacher feedback will go."
		}, 
		{
			title: "Test Post 2",
			poster: "User2",
			content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris dapibus luctus ligula, in mattis lorem pulvinar sit amet. Suspendisse potenti. Suspendisse potenti. Nam a nisi sit amet augue interdum feugiat. Ut sodales at arcu in efficitur. Aenean mattis auctor dictum. Fusce nec lorem eget diam ultrices hendrerit. Mauris dignissim metus eget felis tincidunt, non faucibus nisl consectetur. Duis porttitor interdum nunc ac laoreet. Ut aliquet leo eget ligula tempor, in accumsan libero sodales. Nullam sit amet pretium ex, vel ornare purus. Mauris ut molestie erat. Vestibulum eleifend dui eu enim dignissim, et interdum nibh dignissim. Nulla blandit lectus ac est rutrum cursus. Donec posuere risus at fringilla aliquam. Praesent et mi sit amet sem consectetur viverra. ",
			replies: [
				{
					title: "Test Reply Title 3",
					name: "Test Reply Name 3",
					reply: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris dapibus luctus ligula, in mattis lorem pulvinar sit amet. Suspendisse potenti. Suspendisse potenti. Nam a nisi sit amet augue interdum feugiat. Ut sodales at arcu in efficitur. Aenean mattis auctor dictum. Fusce nec lorem eget diam ultrices hendrerit. Mauris dignissim metus eget felis tincidunt, non faucibus nisl consectetur. Duis porttitor interdum nunc ac laoreet. Ut aliquet leo eget ligula tempor, in accumsan libero sodales. Nullam sit amet pretium ex, vel ornare purus. Mauris ut molestie erat. Vestibulum eleifend dui eu enim dignissim, et interdum nibh dignissim. Nulla blandit lectus ac est rutrum cursus. Donec posuere risus at fringilla aliquam. Praesent et mi sit amet sem consectetur viverra. ",
					date: "2017-03-03"
				}, 
				{
					title: "Test Reply Title 4",
					name: "Test Reply Name 4",
					reply: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris dapibus luctus ligula, in mattis lorem pulvinar sit amet. Suspendisse potenti. Suspendisse potenti. Nam a nisi sit amet augue interdum feugiat. Ut sodales at arcu in efficitur. Aenean mattis auctor dictum. Fusce nec lorem eget diam ultrices hendrerit. Mauris dignissim metus eget felis tincidunt, non faucibus nisl consectetur. Duis porttitor interdum nunc ac laoreet. Ut aliquet leo eget ligula tempor, in accumsan libero sodales. Nullam sit amet pretium ex, vel ornare purus. Mauris ut molestie erat. Vestibulum eleifend dui eu enim dignissim, et interdum nibh dignissim. Nulla blandit lectus ac est rutrum cursus. Donec posuere risus at fringilla aliquam. Praesent et mi sit amet sem consectetur viverra. ",
					date: "2017-03-04"
				}
			]	
		}
	]
}
*/