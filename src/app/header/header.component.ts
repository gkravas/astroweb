import {Input, Component} from '@angular/core';
import { Router } from '@angular/router';
import { AuthorizationService } from '../services/authorization.service'
import { StorageService } from '../services/storage.service'

@Component({
  selector: 'app-header',
  templateUrl: 'header.component.html',
  styleUrls: ['header.component.css']
})
export class HeaderComponent {
  @Input() title: string;
  @Input() showLogout: boolean = false;

  constructor(private router: Router,
    private storageService: StorageService,
    private authorizationService: AuthorizationService){}

  public logout() {
    this.storageService.clear();
    this.router.navigate(['/login']);
  }
}