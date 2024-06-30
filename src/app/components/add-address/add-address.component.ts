import { AfterViewInit, Component, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { successDialog, timeMessage } from 'src/app/functions/alerts';
import { ApiService } from 'src/app/services/api.service';
import { MapsService } from 'src/app/services/maps.service';

declare var google: any;

@Component({
  selector: 'app-add-address',
  templateUrl: './add-address.component.html',
  styleUrls: ['./add-address.component.scss']
})
export class AddAddressComponent implements OnInit, AfterViewInit {

  map: any;
  marker: any;

  addAddressForm: FormGroup = this.fb.group({
    street: ['', [Validators.required, Validators.maxLength(50)]],
    suburb: ['', [Validators.required, Validators.maxLength(50)]],
    city: ['', [Validators.required, Validators.maxLength(50)]],
    state: ['', [Validators.required, Validators.maxLength(50)]],
    country: ['', [Validators.required, Validators.maxLength(50)]],
    zip_code: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(5)]],
    latitude: [null, Validators.required],
    longitude: [null, Validators.required]
  });

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private apiService: ApiService,
    private mapService: MapsService
  ) {

  }

  ngOnInit(): void { }

  ngAfterViewInit() {
    this.mapService.loadGoogleMaps(() => this.initMap());
  }

  initMap() {
    this.mapService.getCurrentPosition()
      .then(({ latitude, longitude }) => {
        this.map = this.mapService.createMap('map', latitude, longitude);
        this.marker = this.mapService.createMarker(this.map, latitude, longitude, true);

        google.maps.event.addListener(this.marker, 'dragend', (event: google.maps.KmlMouseEvent) => {
          if (event.latLng) {
            this.updateMarkerPosition(event.latLng);
          }
        });

        this.map.addListener('click', (event: google.maps.KmlMouseEvent) => {
          if (event.latLng) {
            this.updateMarkerPosition(event.latLng);
          }
        });

        const initialPosition = this.marker.getPosition();
        if (initialPosition) {
          this.updateMarkerPosition(initialPosition);
        }
      })
      .catch((error) => console.error('Error getting current position:', error));
  }

  updateMarkerPosition(latLng: google.maps.LatLng) {
    console.log("Nuevas coordenadas: ", latLng.lat(), latLng.lng());
    this.marker.setPosition(latLng);
    this.addAddressForm.patchValue({
      latitude: latLng.lat(),
      longitude: latLng.lng()
    });

    this.mapService.geocodePosition(latLng)
      .then((addressComponents) => {
        const route = addressComponents['route'] || '';
        const streetNumber = addressComponents['street_number'] || '';
        const street = streetNumber ? `${route} ${streetNumber}` : route;

        this.addAddressForm.patchValue({
          street: street,
          suburb: addressComponents['sublocality_level_1'] || '',
          city: addressComponents['locality'] || '',
          state: addressComponents['administrative_area_level_1'] || '',
          country: addressComponents['country'] || '',
          zip_code: addressComponents['postal_code'] || '',
          latitude: latLng.lat(),
          longitude: latLng.lng()
        });
      })
      .catch((error) => console.error('Geocoding failed due to:', error));

    // Después de actualizar la posición del marcador, actualiza la vista del mapa
    google.maps.event.trigger(this.map, 'bounds_changed');
  }

  addAddress() {
    if (this.addAddressForm.valid) {
      console.log("DIRECCIÓN ANTES DE MANDAR A BACKEND: ", this.addAddressForm.value);
      this.apiService.addAddress(this.addAddressForm.value).subscribe(
        response => {
          timeMessage('Registrando dirección...', 1500).then(() => {
            successDialog('Registro completado.')
            console.log('Dirección creada:', response);
          });
          this.router.navigate(['/dashboard']);
        },
        error => {
          console.error('Error al crear la dirección:', error);
        }
      );
    } else {
      console.error('Formulario inválido. Por favor completa correctamente todos los campos.');
    }
  }

  onAddressFieldChange() {
    const address = [
      this.addAddressForm.get('street')?.value,
      this.addAddressForm.get('suburb')?.value,
      this.addAddressForm.get('city')?.value,
      this.addAddressForm.get('state')?.value,
      this.addAddressForm.get('country')?.value,
    ].filter(Boolean).join(', '); // Filter out falsy values and join with comma

    if (address) {
      console.log("New address: ", address);
      this.mapService.geocodeAddress(address)
        .then((newPosition) => {
          console.log("Nueva posición: ", newPosition)
          this.updateMarkerPosition(newPosition);
        })
        .catch((error) => console.error('Geocoding failed due to:', error));
    } else {
      console.warn('No se ingresó una dirección completa');
    }
  }


  getErrorMessage(fieldName: string) {
    const fieldErrors = this.addAddressForm.get(fieldName)?.errors;
    if (fieldErrors) {
      if (fieldErrors['required']) {
        return 'El campo ' + fieldName + ' es requerido.';
      } else if (fieldErrors['maxlength']) {
        return 'El campo es mayor de ' + fieldErrors['maxlength'].requiredLength + ' letras.';
      } else if (fieldErrors['minlength']) {
        return 'El campo es menor de ' + fieldErrors['minlength'].requiredLength + ' letras.';
      } else if (fieldErrors['email']) {
        return 'El email debe tener un formato válido.'
      }
    }
    return '';
  }
}
