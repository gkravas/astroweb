import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'landing-page',
  templateUrl: 'landingPage.component.html',
  styleUrls: ['landingPage.component.css']
})
export class LandingPageComponent {
  title = 'Astro Lucis';

  constructor(private router: Router, private titleService: Title){}

  ngInit() {
    this.titleService.setTitle('Astro Lucis');
  }

  onLoginClicked(event) {
    event.stopPropagation();
    this.router.navigate(['/login']);
  }
}