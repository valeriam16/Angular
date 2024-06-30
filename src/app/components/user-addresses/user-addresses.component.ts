import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserWithAddresses } from 'src/app/interfaces/userWithAddressesRequest';
import { ApiService } from 'src/app/services/api.service';
import { MapsService } from 'src/app/services/maps.service';

declare var google: any;

@Component({
  selector: 'app-user-addresses',
  templateUrl: './user-addresses.component.html',
  styleUrls: ['./user-addresses.component.scss']
})
export class UserAddressesComponent {
  usersWithAddresses: UserWithAddresses[] = [];
  error: string | null = null;
  loading = true;

  map: any;
  markers: any[] = [];

  constructor(
    private apiService: ApiService,
    private router: Router,
    private mapService: MapsService,
  ) { }

  ngOnInit(): void {
    this.apiService.getUser().subscribe({
      next: (user) => {
        if (user.role_id !== 1) {
          this.router.navigate(['/dashboard']);
          return;
        }
        this.fetchUsersWithAddresses();
      },
      error: () => {
        this.router.navigate(['/dashboard']);
      }
    });
  }

  ngAfterViewInit2() {
    this.apiService.getUser().subscribe({
      next: (user) => {
        if (user.role_id !== 1) {
          this.router.navigate(['/dashboard']);
          return;
        }
        this.fetchUsersWithAddresses();
      },
      error: () => {
        this.router.navigate(['/dashboard']);
      }
    });
  }

  ngAfterViewInit() {
    this.mapService.loadGoogleMaps(() => this.initMap());
  }

  /* initMap() {
    this.mapService.getCurrentPosition()
      .then(({ latitude, longitude }) => {
        this.map = this.mapService.createMap('map', latitude, longitude);
        this.marker = this.mapService.createMarker(this.map, latitude, longitude, true);

        google.maps.event.addListener(this.marker, 'dragend', (event: google.maps.KmlMouseEvent) => {
          if (event.latLng) {
            //this.updateMarkerPosition(event.latLng);
          }
        });

        this.map.addListener('click', (event: google.maps.KmlMouseEvent) => {
          if (event.latLng) {
            //this.updateMarkerPosition(event.latLng);
          }
        });
      })
      .catch((error) => console.error('Error getting current position:', error));
  } */

  initMap() {
    this.mapService.getCurrentPosition()
      .then(({ latitude, longitude }) => {
        this.map = this.mapService.createMap('map', latitude, longitude);

        // Si necesitas un marcador inicial
        /* const initialMarker = this.mapService.createMarker(this.map, latitude, longitude, true);
        this.markers.push(initialMarker); */

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

  fetchUsersWithAddresses(): void {
    this.apiService.getUsersWithAddresses().subscribe({
      next: (data: any) => {
        this.usersWithAddresses = data.UsersWithAddresses;
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
    if (!this.map || this.usersWithAddresses.length === 0) return;
    let addressCounter = 1;

    this.usersWithAddresses.forEach(user => {
      user.address.forEach(address => {
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
              <h3>${user.name} ${user.lastname} (${user.nickname})</h3>
              <p><b>Dirección ${addressCounter}</b></p>
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
          console.error("NO HAY LAT Y LONG REGISTARDAS.")
        }
      });
    });

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
}
