import {Input, Component} from '@angular/core';
import { Router, ActivatedRouteSnapshot } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { AuthorizationService } from '../services/authorization.service'
import { StorageService } from '../services/storage.service'
import { ErrorDialogComponent } from '../errorDialog/errorDialog.component';
import { MatDialog, MAT_DIALOG_DATA, MatDatepickerInputEvent } from '@angular/material';

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
  loggedIn: boolean = false;

  constructor(private apollo: Apollo, private router: Router,
    public dialog: MatDialog,
    private storageService: StorageService,
    private authorizationService: AuthorizationService){
      this.loggedIn = this.authorizationService.isAuthenticated();
    }

  ngOnInit() {
    const route = this.router.routerState.snapshot;
    this.showProfile = !route.url.endsWith('/profile');
    this.showDaily = !route.url.endsWith('/daily/me');
  }

  public logout() {
    const that = this;
    this.dialog.open(ErrorDialogComponent, {
      width: '250px',
      data: { 
        title: 'Προσοχή', 
        message: 'Θα ήθελες να εξέλθεις απο την υπηρεσία μας;',
        positive: 'Έξοδος',
        negative: 'Άκυρο'
      }
    })
    .afterClosed()
    .subscribe(result => {
      if (!result) {
        return;
      }
      this.apollo.getClient().cache.reset();
      this.storageService.clear();
      this.router.navigate(['/login']);
    });
  }
}