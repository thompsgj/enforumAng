import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MaterialModule } from './material.module';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EditorModule } from '@tinymce/tinymce-angular'


import {
  RouterModule,
  Routes
} from '@angular/router';



import { AppComponent } from './app.component';
import { ForumsComponent } from './forums/forums.component';
import { HomeComponent } from './home/home.component';
import { ThreadsComponent } from './threads/threads.component';
import { PostsComponent } from './posts/posts.component';

import { AUTH_PROVIDERS } from './auth.service';
//import { LoggedInGuard } from './logged-in.guard';
import { LoginComponent } from './login/login.component';

import { CreateForumModalComponent } from './create-forum-modal/create-forum-modal.component';
import { CreateReplyModalComponent } from './create-reply-modal/create-reply-modal.component';
import { CreatePostModalComponent } from './create-post-modal/create-post-modal.component';
import { EditForumModalComponent } from './edit-forum-modal/edit-forum-modal.component';
import { EditReplyModalComponent } from './edit-reply-modal/edit-reply-modal.component';
import { EditPostModalComponent } from './edit-post-modal/edit-post-modal.component';

import { ApiService } from './api.service';
import {EnforumDataService } from './enforum-data.service';
import { TinyEditorComponent } from './tiny-editor/tiny-editor.component';
import { HtmlAllowPipe } from './html-allow.pipe';
import { ProfileComponent } from './profile/profile.component';
import { RegisterComponent } from './register/register.component';
import { AuthenticationService } from './authentication.service';
import { AuthGuardService } from './auth-guard.service';
import { RoleGuardService } from './role-guard.service';
import { AddUserComponent } from './add-user/add-user.component';
import { AddCourseComponent } from './add-course/add-course.component';
import { EnrollUserComponent } from './enroll-user/enroll-user.component';
import { FilterPipe } from './filter.pipe';
import { EditUserModalComponent } from './edit-user-modal/edit-user-modal.component';
import { EditCourseModalComponent } from './edit-course-modal/edit-course-modal.component';
import { EditProfileModalComponent } from './edit-profile-modal/edit-profile-modal.component';

const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'home', component: HomeComponent},
  {path: 'forums', component: ForumsComponent},
  {path: 'forum/:id', component: ForumsComponent},
  {path: 'threads', component: ThreadsComponent},
  {path: 'thread/:id', component: ThreadsComponent},
  {path: 'posts', component: PostsComponent},
  {path: 'posts/:id', component: PostsComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent },
  {path: 'profile', component: ProfileComponent, canActivate: [AuthGuardService], },
  {path: 'adduser', component: AddUserComponent, canActivate: [RoleGuardService], data: {expectedRole: 'admin'}},
  {path: 'addcourse', component: AddCourseComponent}
];


@NgModule({
  declarations: [
    AppComponent,
    ForumsComponent,
    HomeComponent,
    ThreadsComponent,
    PostsComponent,
    LoginComponent,
    CreateForumModalComponent,
    CreateReplyModalComponent,
    CreatePostModalComponent,
    EditForumModalComponent,
    EditReplyModalComponent,
    EditPostModalComponent,
    TinyEditorComponent,
    HtmlAllowPipe,
    ProfileComponent,
    RegisterComponent,
    AddUserComponent,
    AddCourseComponent,
    EnrollUserComponent,
    FilterPipe,
    EditUserModalComponent,
    EditCourseModalComponent,
    EditProfileModalComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    HttpClientModule,
    NgbModule.forRoot(),
    RouterModule.forRoot(routes),
    MaterialModule,
    EditorModule
  ],
  providers: [
    AUTH_PROVIDERS,
    //LoggedInGuard,
    EnforumDataService,
    ApiService,
    NgbModal,
    AuthenticationService,
    AuthGuardService,
    RoleGuardService
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    CreateForumModalComponent,
    CreateReplyModalComponent,
    CreatePostModalComponent,
    EditForumModalComponent,
    EditReplyModalComponent,
    EditPostModalComponent,
    EnrollUserComponent,
    EditProfileModalComponent,
    EditCourseModalComponent,
    EditUserModalComponent
  ]
})
export class AppModule { }
