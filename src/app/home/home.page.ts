import { Component, OnInit } from '@angular/core';
import { AlertController, MenuController, PopoverController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { CiudadanosService } from '../services/ciudadanos.service';
import { PopoverComponent } from '../components/popover/popover.component';
import * as mapboxgl from 'mapbox-gl';
import { ubicacion } from '../models/ciudadano';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage  implements OnInit{

  constructor(private menu: MenuController, 
    private ciudadanosService:CiudadanosService,
    public alertController: AlertController,
    public popoverController: PopoverController,
    ) {}
  popover:any
  cargando=true;
  latitud:number;
  longitud:number;
  coordenadas:number[];
  ubi:ubicacion=new ubicacion();
  ngOnInit(){
  }

  async presentPopover() {
     this.popover = await this.popoverController.create({
      component: PopoverComponent,
      backdropDismiss:false,
      translucent: true,
    });
     await this.popover.present();
     const coor= await this.popover.onWillDismiss();
     this.latitud=coor.data.data[0];
     this.longitud=coor.data.data[1];
     this.coordenadas=[coor.data.data[0],coor.data.data[1]];
     this.ciudadanosService.guardarUbicacion(this.coordenadas);
      this.ubi.latitud=coor.data.data[0];
      this.ubi.longitud=coor.data.data[1];
     this.ciudadanosService.guardarCoordenadas(this.ubi);
     this.cargarMapa();
     this.mostrartPopup();
     console.log('id')
    
    }
    
    cargarMapa(){
    var coordenadas=this.ciudadanosService.coordenates
    mapboxgl.accessToken = environment.mapboxKey;
      var map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [this.coordenadas[1],this.coordenadas[0]],
      zoom: 15
    
      });
      
      console.log(this.latitud);
      console.log(this.longitud);
      var marker = new mapboxgl.Marker()
          .setLngLat([this.coordenadas[1],this.coordenadas[0]])
          .addTo(map);

      var size = 150;
      var pulsingDot = {
        width: size,
        height: size,
        data: new Uint8Array(size * size * 4),
        
        // get rendering context for the map canvas when layer is added to the map
        onAdd: function() {
        var canvas = document.createElement('canvas');
        canvas.width = this.width;
        canvas.height = this.height;
        this.context = canvas.getContext('2d');
        },
        
        // called once before every frame where the icon will be used
        render: function() {
        var duration = 1000;
        var t = (performance.now() % duration) / duration;
        
        var radius = (size / 2) * 0.3;
        var outerRadius = (size / 2) * 0.9 * t + radius;
        var context = this.context;
        
        // draw outer circle
        context.clearRect(0, 0, this.width, this.height);
        context.beginPath();
        context.arc(
        this.width / 2,
        this.height / 2,
        outerRadius,
        0,
        Math.PI * 2
        );
        context.fillStyle = 'rgba(255, 200, 200,' + (1 - t) + ')';
        context.fill();
        
        // draw inner circle
        context.beginPath();
        context.arc(
        this.width / 2,
        this.height / 2,
        radius,
        0,
        Math.PI * 2
        );
        context.fillStyle = 'rgba(255, 100, 100, 1)';
        context.strokeStyle = 'white';
        context.lineWidth = 2 + 4 * (1 - t);
        context.fill();
        context.stroke();
        
        // update this image's data with data from the canvas
        this.data = context.getImageData(
        0,
        0,
        this.width,
        this.height
        ).data;
        
        // continuously repaint the map, resulting in the smooth animation of the dot
        map.triggerRepaint();
        
        // return `true` to let the map know that the image was updated
        return true;
        }
        };

        var objecto:any
        var coor1= [this.coordenadas[1]+0.0003,this.coordenadas[0]+0.0003]
        var coor2= [this.coordenadas[1]-0.0009,this.coordenadas[0]-0.0009]
        coordenadas.features[0].geometry.coordinates.push(coor1);
        coordenadas.features[0].geometry.coordinates.push(coor2);
        console.log('lista',coordenadas);

        map.on('load', function() {
       map.addImage('pulsing-dot', pulsingDot, { pixelRatio: 2 });
          map.addSource('points', objecto= {
            'type': 'geojson',
            'data': coordenadas
          }
          
          );
          
            map.addLayer({
            'id': 'points',
            'type': 'symbol',
            'source': 'points',
            'layout': {
            'icon-image': 'pulsing-dot'
            }
            });
      });
     return true;
  }
  async presentAlert() {
    const alert = await this.alertController.create({
      cssClass: 'popup',
      animated:true,
      header: 'Sugerencia',
      subHeader: 'Eres de la UTA? te brindamos ayuda',
      message: 'Puedes inscribirte y recibir beneficios como capacitaciones, cursos profesionales, mas velocidad de internet completamente gratis. El formulario se encuentra en el menú lateral izquierdo.',
      buttons: ['OK']
    });

    await alert.present();
  }
  
  async ionViewWillEnter(){
    const res= await this.ciudadanosService.obtenerUbicacion();
    if(res !=null)
    {
      this.coordenadas=res;
      this.cargarMapa();
      this.mostrartPopup();
      return;
    }
    this.presentPopover();
    

  }

  mostrartPopup(){
    setTimeout(() => {
      this.presentAlert()
    }, 5000);
  }

}
