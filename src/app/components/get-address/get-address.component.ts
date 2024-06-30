import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Address } from 'src/app/interfaces/addressRequest';
import { ApiService } from 'src/app/services/api.service';
import { MapsService } from 'src/app/services/maps.service';

declare var google: any;

@Component({
  selector: 'app-get-address',
  templateUrl: './get-address.component.html',
  styleUrls: ['./get-address.component.scss']
})
export class GetAddressComponent implements OnInit, AfterViewInit {
  userAddress: Address[] = [];
  error: string | null = null;
  loading = true;

  map: any;
  markers: any[] = [];

  constructor(
    private apiService: ApiService,
    private router: Router,
    private mapService: MapsService
  ) { }

  ngOnInit(): void {
    //this.loadUserAddress();
    this.fetchAddresses();
  }

  ngAfterViewInit() {
    this.mapService.loadGoogleMaps(() => this.initMap());
  }

  initMap() {
    this.mapService.getCurrentPosition()
      .then(({ latitude, longitude }) => {
        this.map = this.mapService.createMap('map', latitude, longitude);

        if (this.markers.length > 0) {
          const lastMarker = this.markers[this.markers.length - 1];
          google.maps.event.addListener(lastMarker, 'dragend', (event: google.maps.KmlMouseEvent) => {
            if (event.latLng) {
              //this.updateMarkerPosition(event.latLng);
            }
          });
        }

        this.map.addListener('click', (event: google.maps.KmlMouseEvent) => {
          if (event.latLng) {
            //this.updateMarkerPosition(event.latLng);
          }
        });
      })
      .catch((error) => console.error('Error getting current position:', error));
  }

  fetchAddresses(): void {
    this.apiService.getUserAddress().subscribe({
      next: (data: any) => {
        this.userAddress = data.Addresses;
        this.loading = false;
        console.log("Si obtuve las direcciones.")
        this.addMarkersForAddresses()
      },
      error: (err: any) => {
        this.error = 'Error al obtener los datos. Por favor intente nuevamente más tarde.';
        this.loading = false;
      }
    });
  }

  addMarkersForAddresses(): void {
    if (!this.map || this.userAddress.length === 0) return;
    let addressCounter = 1;

    this.apiService.getUserAddress().subscribe({
      next: (response: any) => {
        this.userAddress = response.Addresses;
        this.userAddress.forEach(address => {
          if (address.latitude && address.longitude) {
            const marker = this.mapService.createMarker(
              this.map,
              address.latitude,
              address.longitude,
              true,
            );

            this.markers.push(marker);

            const infoWindow = new google.maps.InfoWindow({
              content: `
              <h3>Dirección ${addressCounter}</h3>
              <p>${address.street}, ${address.suburb}</p>
              <p>${address.city}, ${address.state}, ${address.zip_code}</p>
              <p>${address.country}</p>
            `
            });

            marker.addListener('click', () => {
              infoWindow.open(this.map, marker);
            });

            addressCounter++;
          } else {
            console.error("No encontramos los campos latitud y longitud en la dirección del usuario.")
          }
        });
      },
      error: (error) => {
        this.error = 'Error al obtener los datos. Por favor intente nuevamente más tarde.';
        console.error("Error al obtener los datos. Por favor intente nuevamente más tarde." + error);
      }
    })

    this.fitBoundsToMarkers();
  }

  fitBoundsToMarkers(): void {
    if (this.markers.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      this.markers.forEach(marker => bounds.extend(marker.getPosition()));
      this.map.fitBounds(bounds);

      // Si solo hay un marcador, ajusta el zoom
      if (this.markers.length === 1) {
        const listener = this.map.addListener('idle', () => {
          this.map.setZoom(Math.min(15, this.map.getZoom()));
          google.maps.event.removeListener(listener);
        });
      }
    }
  }

  /* loadUserAddress(): void {
    this.apiService.getUserAddress().subscribe({
      next: (response: any) => {
        if (response.Addresses && response.Addresses.length > 0) {
          this.userAddress = response.Addresses;
        } else {
          this.userAddress = [];
        }
      },
      error: (err) => {
        this.error = err.error.message || 'Error al cargar la dirección del usuario';
        console.error('Error fetching user address', err);
      }
    });
  } */

}
