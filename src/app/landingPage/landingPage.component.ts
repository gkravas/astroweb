import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Meta } from '@angular/platform-browser';

@Component({
  selector: 'landing-page',
  templateUrl: 'landingPage.component.html',
  styleUrls: ['landingPage.component.css']
})
export class LandingPageComponent {
  title = 'Astro Lucis';

  constructor(private metaService: Meta, private router: Router, private titleService: Title){}

  ngInit() {
    this.titleService.setTitle('Astro Lucis');
    const keywords: string = 'Αστρολογία, Αστρολογικές Προβλέψεις, Ημερήσιες Προβλέψεις, Ζώδια, Αστρολογικός Χάρτης';
    const title: string = 'Astro Lucis';
    const description: string = 'Αστρολογία και Τεχνητή Νοημοσύνη ενώνονται και προσφέρουν αξιόπιστες προβλέψεις.'
      + ' Προσωπικές ημερήσιες προβλέψεις δωρεάν';
    const image: string = '/assets/fbImage.png';

    this.metaService.addTags([
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: image },
      { property: 'og:title', content: title },
      { property: 'og:image', content: image },
      { property: 'og:description', content: description },
      { property: 'og:type', content: "website" },
      { property: 'og:url', content: "https://astrolucis.gr" },
      { name: 'keywords', content: keywords },
      { name: 'description', content: description },
    ]);
  }

  onLoginClicked(event) {
    event.stopPropagation();
    this.router.navigate(['/login']);
  }
}