import { Component, ViewEncapsulation, Input } from '@angular/core';
import { AddUserComponent } from '../add-user/add-user.component'
import { EditUserModalComponent } from '../edit-user-modal/edit-user-modal.component'
import { EditProfileModalComponent } from '../edit-profile-modal/edit-profile-modal.component'
import { AddCourseComponent } from '../add-course/add-course.component'
import {EditCourseModalComponent} from '../edit-course-modal/edit-course-modal.component'
import { NgbModal, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService, UserDetails } from '../authentication.service';
import { EnforumDataService } from '../enforum-data.service';
import { Course } from '../forum';
import { Router } from '@angular/router';
import {MatCardModule} from '@angular/material/card';
import { ActivatedRoute } from '@angular/router';
import {MatSnackBar} from '@angular/material';
import 'rxjs/add/observable/fromPromise';
@Component({
  templateUrl: './profile.component.html'
})
export class ProfileComponent {
  details: UserDetails;

  courses : any;

  isAdmin:boolean = false
  isTeacher:boolean = false
  isStudent:boolean = false

  msg : string;

  constructor(
    private auth: AuthenticationService,
    private enforumDataService: EnforumDataService,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    public snackBar : MatSnackBar
  ) {}

  ngOnInit() {   
    //Nested Function
    this.auth.profile().subscribe(user => {
      this.details = user;
      this.toggleViewRole(this.details.role)
      
            

      this.enforumDataService
        .retrieveCourses(this.details)
        .subscribe(
          (result) => {
            this.courses = result;
            this.router.navigateByUrl('/profile')

          }
        )

    }, (err) => {
      console.error(err);
    });



    /* SEPARATE FUNCTIONS
    console.log("PROFILE COMPONENT TS- auth profile") 
    this.auth.profile().subscribe(user => {
      this.details = user;
      console.log("PROFILE.COMPONENT.TS- users details", this.details)
    }, (err) => {
      console.error(err);
    });

    console.log("PROFILE COMPONENT TS- courses")
    this.enforumDataService
      .retrieveCourses()
      .subscribe(
        (result) => {
          console.log("Finished retrieving courses", result)

          this.courses = result;
          this.router.navigateByUrl('/profile')
        }
      )
    */
  }  


  toggleViewRole(role) {
    if(role === "admin") {
      this.isAdmin = true
      return this.isAdmin
    } else if (role === "teacher") {
      this.isTeacher = true
      return this.isTeacher
    } else {
      this.isStudent = true
      return this.isStudent
    }
  }


  addUser() {
    const modalRef = this.modalService.open(AddUserComponent);

    modalRef.result.then((result) => {
      if(result == "Close click") {
        return false
      }


      this.snackBar.open(result, "Close", {
        duration: 2000
      })
    })
  }

  editUser() {
     const modalRef = this.modalService.open(EditUserModalComponent)

     modalRef.result.then((result) => {
       if(result == "Close click") {
         return false
       }

       this.msg = result

       this.snackBar.open(result, "Close", {
         duration: 2000
       })
     })
  }
  
  addCourse() {
    const modalRef = this.modalService.open(AddCourseComponent);

    modalRef.result.then((result) => {
      if(result == "Close click") {
        return false
      }

      this.courses = this.courses.concat(result);

      let msg = "Course Added"

      this.snackBar.open(msg, "Close", {
        duration: 2000
      })

    })
  }


  editProfile() {
     const modalRef = this.modalService.open(EditProfileModalComponent)
     modalRef.componentInstance.userid = this.details._id

     modalRef.result.then((result) => {
       if(result == "Close click") {
         return false
       }

       this.details = result.userData

       let msg="Profile Updated"
       this.snackBar.open(msg, "Close", {
         duration: 2000
       })
     })
  }


  editCourse() {
    const modalRef = this.modalService.open(EditCourseModalComponent)

    modalRef.result.then((result) => {
       if(result == "Close click") {
         return false
       }

       let msg="Course Settings Updated"
       this.snackBar.open(msg, "Close", {
         duration: 2000
       })      
    })
  }


}
