import { Component, OnInit } from '@angular/core';
import {
  AlertController,
  MenuController,
  PopoverController,
} from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { CiudadanosService } from '../services/ciudadanos.service';
import { PopoverComponent } from '../components/popover/popover.component';
import * as mapboxgl from 'mapbox-gl';
import { ubicacion } from '../models/ciudadano';
import { Device } from '@ionic-native/device/ngx';
import { NetworkInterface } from '@ionic-native/network-interface/ngx';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  constructor(
    private menu: MenuController,
    private ciudadanosService: CiudadanosService,
    public alertController: AlertController,
    public popoverController: PopoverController,
    private deviceMobile: Device,
    private networkInterface: NetworkInterface,
    public platform: Platform
  ) {}
  popover: any;
  cargando = true;
  latitud: number;
  longitud: number;
  coordenadas: number[];
  ubi: ubicacion = new ubicacion();
  dispositivo: string;

  ngOnInit() {}

  async presentPopover() {
    this.popover = await this.popoverController.create({
      component: PopoverComponent,
      backdropDismiss: false,
      translucent: true,
    });
    await this.popover.present();
    const coor = await this.popover.onWillDismiss();
    this.coordenadas = [coor.data.data[0], coor.data.data[1]];
    this.ciudadanosService.guardarUbicacion(this.coordenadas);
    await this.networkInterface
      .getWiFiIPAddress()
      .then((address) => (this.ubi.ip = address.ip))
      .catch((error) => console.error(`Unable to get IP: ${error}`));
    if (this.platform.is('mobileweb')) {
      this.dispositivo = 'mobileweb';
    } else {
      if (this.platform.is('pwa')) {
        this.dispositivo = 'pwa';
      } else {
        if (this.platform.is('ios')) {
          this.dispositivo = 'ios';
        } else {
          if (this.platform.is('android')) {
            this.dispositivo = 'android';
          } else {
            if (this.platform.is('ipad')) {
              this.dispositivo = 'ipad';
            }else {
              if (this.platform.is('mobile')) {
                this.dispositivo = 'mobile';
              }else {
                if (this.platform.is('cordova')) {
                  this.dispositivo = 'cordova';
                }else{
                  if (this.platform.is('electron')) {
                    this.dispositivo = 'electron';
                  }else{
                    if (this.platform.is('iphone')) {
                      this.dispositivo = 'iphone';
                    }else{
                      if (this.platform.is('tablet')) {
                        this.dispositivo = 'tablet';
                      }else {
                        if (this.platform.is('desktop')) {
                          this.dispositivo = 'desktop';
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

    this.ubi.latitud = coor.data.data[0];
    this.ubi.longitud = coor.data.data[1];
    this.ubi.manufacturer = this.deviceMobile.manufacturer;

    if (this.deviceMobile.model) {
      this.ubi.modelo = this.deviceMobile.model;
    } else {
      this.ubi.modelo = this.dispositivo;
    }
    this.ubi.version = this.deviceMobile.version;
    this.ubi.platform = this.deviceMobile.platform;
    // console.log('Datos de la persona:', this.ubi);

    this.ciudadanosService.guardarCoordenadas(this.ubi);
    this.cargarMapa();
    this.mostrartPopup();
  }

  cargarMapa() {
    const coordenadas = this.ciudadanosService.coordenates;
    mapboxgl.accessToken = environment.mapboxKey;
    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [this.coordenadas[1], this.coordenadas[0]],
      zoom: 15,
    });
    const marker = new mapboxgl.Marker()
      .setLngLat([this.coordenadas[1], this.coordenadas[0]])
      .addTo(map);

    const size = 150;
    const pulsingDot = {
      width: size,
      height: size,
      data: new Uint8Array(size * size * 4),

      // get rendering context for the map canvas when layer is added to the map
      onAdd() {
        const canvas = document.createElement('canvas');
        canvas.width = this.width;
        canvas.height = this.height;
        this.context = canvas.getContext('2d');
      },

      // called once before every frame where the icon will be used
      render() {
        const duration = 1000;
        const t = (performance.now() % duration) / duration;

        const radius = (size / 2) * 0.3;
        const outerRadius = (size / 2) * 0.9 * t + radius;
        const context = this.context;

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
        context.arc(this.width / 2, this.height / 2, radius, 0, Math.PI * 2);
        context.fillStyle = 'rgba(255, 100, 100, 1)';
        context.strokeStyle = 'white';
        context.lineWidth = 2 + 4 * (1 - t);
        context.fill();
        context.stroke();

        // update this image's data with data from the canvas
        this.data = context.getImageData(0, 0, this.width, this.height).data;

        // continuously repaint the map, resulting in the smooth animation of the dot
        map.triggerRepaint();

        // return `true` to let the map know that the image was updated
        return true;
      },
    };

    let objecto: any;
    const coor1 = [this.coordenadas[1] + 0.0003, this.coordenadas[0] + 0.0003];
    const coor2 = [this.coordenadas[1] + 0.0006, this.coordenadas[0] - 0.0004];
    const coor3 = [this.coordenadas[1] + 0.0007, this.coordenadas[0] - 0.0005];
    const coor4 = [this.coordenadas[1] - 0.0003, this.coordenadas[0] - 0.0004];
    const coor5 = [this.coordenadas[1] - 0.0006, this.coordenadas[0] + 0.0003];
    const coor6 = [this.coordenadas[1] - 0.0009, this.coordenadas[0] + 0.0002];
    coordenadas.features[0].geometry.coordinates.push(coor1);
    coordenadas.features[0].geometry.coordinates.push(coor2);
    coordenadas.features[0].geometry.coordinates.push(coor3);
    coordenadas.features[0].geometry.coordinates.push(coor4);
    coordenadas.features[0].geometry.coordinates.push(coor5);
    coordenadas.features[0].geometry.coordinates.push(coor6);
    // tslint:disable-next-line: only-arrow-functions
    map.on('load', function () {
      map.addImage('pulsing-dot', pulsingDot, { pixelRatio: 2 });
      map.addSource(
        'points',
        (objecto = {
          type: 'geojson',
          data: coordenadas,
        })
      );

      map.addLayer({
        id: 'points',
        type: 'symbol',
        source: 'points',
        layout: {
          'icon-image': 'pulsing-dot',
        },
      });
    });
    return true;
  }
  async presentAlert() {
    const alert = await this.alertController.create({
      cssClass: 'popup',
      animated: true,
      header: 'Sugerencia',
      subHeader: 'Eres de la UTA? Te brindamos ayuda',
      message:
        'Puedes inscribirte y recibir beneficios como capacitaciones, cursos profesionales, mas velocidad de internet completamente gratis. El formulario se encuentra en el menú lateral izquierdo.',
      buttons: ['Aceptar'],
    });

    await alert.present();
  }

  async ionViewWillEnter() {
    const res = await this.ciudadanosService.obtenerUbicacion();
    if (res != null) {
      this.coordenadas = res;
      this.cargarMapa();
      this.mostrartPopup();
      return;
    }
    this.presentPopover();
  }

  mostrartPopup() {
    setTimeout(() => {
      this.presentAlert();
    }, 5000);
  }
}
