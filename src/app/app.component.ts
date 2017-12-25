import { Component } from '@angular/core';
import { routerTransition } from './router.transitions'
import { NavigationEnd, Router } from '@angular/router';
import { Meta } from '@angular/platform-browser';
import { Angulartics2GoogleAnalytics } from 'angulartics2/ga';

import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/filter";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [routerTransition]
})
export class AppComponent {
  constructor(private router: Router, 
    private metaService: Meta,
    private angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics) {}

    ngOnInit() {
      
      const keywords: string = 'Αστρολογία, Αστρολογικές Προβλέψεις, Ημερήσιες Προβλέψεις, Ζώδια, Αστρολογικός Χάρτης';
      const title: string = 'Astro Lucis';
      const description: string = ' Προσωπικές ημερήσιες προβλέψεις δωρεάν!'
      + ' Αστρολογία και Τεχνητή Νοημοσύνη ενώνονται και προσφέρουν αξιόπιστες προβλέψεις.';
      const image: string = 'https://astrolucis.gr/assets/fbImage.png';

      this.metaService.addTags([
        { name: 'twitter:title', content: title },
        { name: 'twitter:description', content: description },
        { name: 'twitter:image', content: image },
        { property: 'og:title', content: title },
        { property: 'og:image', content: image },
        { property: 'og:description', content: description },
        { property: 'og:type', content: "website" },
        { property: 'og:url', content: "https://astrolucis.gr" },
        { property: 'fb:app_id', content: "1741917992498773" },
        { property: 'og:locale', content: "el_GR" },
        { name: 'keywords', content: keywords },
        { name: 'description', content: description },
      ]);
    }
  getState(outlet) {
    return outlet.activatedRouteData.state;
  }
}
