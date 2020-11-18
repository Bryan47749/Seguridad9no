import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Ciudadano } from 'src/app/models/ciudadano';
import { CiudadanosService } from '../../services/ciudadanos.service';
import { LoadingController, NavController, PopoverController } from '@ionic/angular';
import { PopoverSuccessComponent } from '../../components/popover-success/popover-success.component';

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.page.html',
  styleUrls: ['./formulario.page.scss'],
})
export class FormularioPage implements OnInit {

  constructor(private ciudadanoservice:CiudadanosService,
    private popoverController:PopoverController, 
    private navCtrl:NavController,
    public loadingController: LoadingController
    ) { }
ciudadano=new Ciudadano();
loading:HTMLIonLoadingElement;
popover:any
  facultades=[
    {id:1,facultad:"Ciencias Administrativas"},
    {id:2,facultad:"Ciencias Agropecuarias"},
    {id:3,facultad:"Ciencias de la Salud"},
    {id:4,facultad:"Ciencias Humanas y de la Educación"},
    {id:5,facultad:"Contabilidad y Auditoría"},
    {id:6,facultad:"Diseño, Arquitectura y Artes"},
    {id:7,facultad:"Ingeniería Civil y Mecánica"},
    {id:8,facultad:"Jurisprudencia y Ciencias Sociales"},
    {id:9,facultad:"FCIAL"},
    {id:10,facultad:"FISEI"},

  ]
  ngOnInit() {
  }

  async presentPopover() {
    this.popover = await this.popoverController.create({
     component: PopoverSuccessComponent,
     backdropDismiss:true,
     translucent: true,
   });
    await this.popover.present();
   }

   async presentLoading() {
    this.loading = await this.loadingController.create({
      message: 'Registrando Datos. Porfavor Espere...',
      // duration: 4000
    });
    await this.loading.present();
   
  }

 async register(form:NgForm){
      if(form.invalid) return;
      const coordenadas=await this.ciudadanoservice.obtenerUbicacion();
      if(coordenadas){
        console.log('estas con las coordendas:',coordenadas);
        this.ciudadano.latitud=coordenadas[0];
        this.ciudadano.longitud=coordenadas[1];
        this.presentLoading(); 
        const res:any= await this.ciudadanoservice.guardarCiudadano(this.ciudadano);
        console.log('ok:',res);
       if(res.ok)
       {
        this.presentPopover();
        this.navCtrl.navigateRoot('home', {animated: true});
       }
       this.loading.dismiss();
      
  
      }

  }

}
