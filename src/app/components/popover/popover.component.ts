import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderOptions, NativeGeocoderResult } from '@ionic-native/native-geocoder/ngx';
import { Ciudadano } from '../../models/ciudadano';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
})
export class PopoverComponent implements OnInit {

  constructor(private popoverCtrl:PopoverController,
    private geolocation: Geolocation,
    private nativeGeocoder: NativeGeocoder,
    
    ) { }
   options = {
    enableHighAccuracy: true, 
    timeout: 10000
  };
  noacepta:boolean=false
  coordenadas=[]
  ciudadano:Ciudadano;
  ngOnInit() {
    this.ciudadano=new Ciudadano();
  }
  
  async onClick(){
    await this.geolocation.getCurrentPosition(this.options).then((resp) => {
       this.coordenadas=[resp.coords.latitude,resp.coords.longitude]
      this.obtenerDirerccion(resp.coords.latitude,resp.coords.longitude);
      this.popoverCtrl.dismiss({
        data:this.coordenadas      }
      );
   },(error)=>{

     this.noacepta=true;
     
   });

  }

  obtenerDirerccion(lat:number,lon:number){
   let  options: NativeGeocoderOptions = {
      useLocale: false,
      maxResults: 2
  };
    this.nativeGeocoder.reverseGeocode(lat, lon, options)
    .then((result: NativeGeocoderResult[]) => {
      
     let address= JSON.stringify(result[1].thoroughfare || result[0].thoroughfare )
    var direccion=address.replace(/"/g, '');
    console.log('direccion: ',direccion);
    this.ciudadano.direccion=direccion;
        }

    )
    .catch((error: any) => {
  
    });
  }
  
}
