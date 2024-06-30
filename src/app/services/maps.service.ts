import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

declare var google: any;

interface AddressComponents {
  [key: string]: string;
}

@Injectable({
  providedIn: 'root'
})
export class MapsService {

  constructor() { }

  private scriptLoadedSubject = new Subject<void>();

  loadGoogleMaps(callback: () => void) {
    if (typeof google === 'object' && typeof google.maps === 'object') {
      callback();
      this.scriptLoadedSubject.next();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyBGZJalRCqLXpoessAe4eKkoMFG13k4MDU&libraries=places';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      console.log('Google Maps script loaded successfully.');
      callback();
      this.scriptLoadedSubject.next();
    };
    script.onerror = () => console.error('Error al cargar Google Maps');
    document.body.appendChild(script);
  }

  getIsGoogleMapsLoaded() {
    return this.scriptLoadedSubject.asObservable();
  }

  getCurrentPosition(): Promise<{ latitude: number, longitude: number }> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        }),
        (error) => reject(error)
      );
    });
  }

  createMap(elementId: string, latitude: number, longitude: number) {
    return new google.maps.Map(document.getElementById(elementId), {
      center: new google.maps.LatLng(latitude, longitude),
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });
  }

  createMarker(map: any, latitude: number, longitude: number, draggable: boolean) {
    return new google.maps.Marker({
      position: { lat: latitude, lng: longitude },
      map: map,
      draggable: draggable
    });
  }

  geocodePosition(latLng: google.maps.LatLng): Promise<AddressComponents> {
    return new Promise((resolve, reject) => {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ location: latLng }, (results: google.maps.GeocoderResult[], status: google.maps.GeocoderStatus) => {
        if (status === 'OK' && results[0]) {
          const addressComponents = results[0].address_components.reduce((acc: AddressComponents, component: google.maps.GeocoderAddressComponent) => {
            component.types.forEach(type => {
              acc[type] = component.long_name;
            });
            return acc;
          }, {} as AddressComponents);
          resolve(addressComponents);
        } else {
          reject(status);
        }
      });
    });
  }

  geocodeAddress(address: string): Promise<google.maps.LatLng> {
    return new Promise((resolve, reject) => {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ address: address }, (results: google.maps.GeocoderResult[], status: google.maps.GeocoderStatus) => {
        if (status === 'OK' && results[0]) {
          resolve(results[0].geometry.location);
        } else {
          reject(status);
        }
      });
    });
  }

}
