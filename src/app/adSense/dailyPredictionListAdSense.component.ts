import {Component,OnInit,AfterViewInit} from '@angular/core'

    @Component({
      moduleId: module.id,
      selector: 'daily-prediction-list-adsense',
      template: ` <div>
                  <ins class="adsbygoogle"
                      style="display:block; width: auto; height: initial;"
                      data-ad-client="ca-pub-6040563814771861"
                      data-ad-slot="8587126214"
                      data-ad-format="auto"></ins>
                </div>            
      `,

    })

    export class DailyPredictionListAdSenseComponent implements AfterViewInit {

      constructor() {    
      } 

      ngAfterViewInit() {
        try{
          (window['adsbygoogle'] = window['adsbygoogle'] || []).push({});
        }catch(e){
          console.error(e);
        }
     }     
    }