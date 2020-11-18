export class Ciudadano {
   public nombre?:string;
   public apellido?:string;
   public cedula?:string;
   public direccion?:string;
   public latitud?:number;
   public longitud?:number;
   public facultad?:string='Indefinido';



   public Ciudadano(){

   }

}

export class ubicacion{
latitud:number;
longitud:number;
public ubicacion(){}
}