import {Input, Component,OnInit,AfterViewInit} from '@angular/core'

    @Component({
      moduleId: module.id,
      selector: 'daily-prediction-adsense',
      template: ` <div>
                    <ins class="adsbygoogle"
                        style="display: block;"
                        data-ad-format="fluid"
                        [attr.data-ad-layout-key]="key"
                        data-ad-client="ca-pub-6040563814771861"
                        [attr.data-ad-slot]="adSlot"></ins>
                </div>            
      `,

    })

    export class DailyPredictionAdSenseComponent implements AfterViewInit {

      private static KEYS: Array<string> = ['-8h+1w-e4+dl+je', '-8i+1w-dq+e9+ft', '-8i+1w-dq+e9+ft', '-fg+5r+6l-ft+4e', '-ej+6g-15-c4+qd'];
      private static SLOTS: Array<string> = ['9347117076', '8334908992', '2687878378', '4539305658', '1821642977'];
      @Input() index: number;
      public adSlot: string;
      public key: string;

      constructor() {    
      } 

      ngOnInit() {
        this.adSlot = DailyPredictionAdSenseComponent.SLOTS[this.index];
        this.key = DailyPredictionAdSenseComponent.KEYS[this.index];
      }

      ngAfterViewInit() {
        try{
          (window['adsbygoogle'] = window['adsbygoogle'] || []).push({});
        }catch(e){
          console.error(e);
        }
     }     
    }