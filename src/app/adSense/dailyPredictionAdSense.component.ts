import {Component,OnInit,AfterViewInit} from '@angular/core'

    @Component({
      moduleId: module.id,
      selector: 'daily-prediction-adsense',
      template: ` <div>
                    <ins class="adsbygoogle"
                        style="display:block;"
                        data-ad-format="fluid"
                        data-ad-layout-key="-8h+1w-e4+dl+je"
                        data-ad-client="ca-pub-6040563814771861"
                        data-ad-slot="9347117076"></ins>
                </div>            
      `,

    })

    export class DailyPredictionAdSenseComponent implements AfterViewInit {

      constructor() {    
      } 

      ngAfterViewInit() {
         setTimeout(()=>{
          try{
            (window['adsbygoogle'] = window['adsbygoogle'] || []).push({});
          }catch(e){
            console.error(e);
          }
        },1000);
     }     
    }