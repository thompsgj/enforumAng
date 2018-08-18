import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { AuthenticationService } from './authentication.service';

@Injectable()
export class RoleGuardService implements CanActivate {

  constructor(private auth: AuthenticationService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot): boolean {
  	const expectedRole = route.data.expectedRole;

  	const user = this.auth.getUserDetails();

  	if(!this.auth.isLoggedIn() || user.role !== expectedRole) {
  		this.router.navigateByUrl('/');
  		return false
  	}

  	return true;
  }
}
