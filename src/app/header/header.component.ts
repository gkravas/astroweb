import {Input, Component} from '@angular/core';
import { Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthorizationService } from '../services/authorization.service'
import { StorageService } from '../services/storage.service'

@Component({
  selector: 'app-header',
  templateUrl: 'header.component.html',
  styleUrls: ['header.component.css']
})
export class HeaderComponent {
  @Input() title: string;
  @Input() showMenu: boolean = false;
  showDaily: boolean = false;
  showProfile: boolean = false;

  constructor(private router: Router,
    
    private storageService: StorageService,
    private authorizationService: AuthorizationService){}

  ngOnInit() {
    const route = this.router.routerState.snapshot;
    this.showProfile = !route.url.endsWith('/profile');
    this.showDaily = !route.url.endsWith('/daily/me');
  }

  public logout() {
    this.storageService.clear();
    this.router.navigate(['/login']);
  }
}