/**
 * Created by Abhi on 6/11/16.
 */
export class ServiceProviderDetails{
    id: number;
    name: string;
    email: string;
    phone: number;
    currentAddress: {
        addressLine1: string;
        addressLine2: string;
        city: string;
        state: string;
        zip: number;
    };
    destinationAddress: {
        addressLine1: string;
        addressLine2: string;
        city: string;
        state: string;
        zip: number;
    };
    journeyDate: string;
    availabiliyTime: {
        from: string;
        to: string;
    };
    maxParcelWeigth: number;
    maxParcelHeight: number;
    maxParcelLength: number;
    maxParcelWidth: number;
    currentAddreddaddressLine1: string;
    currentAddreddaddressLine2: string;
    currentCity: string;
    currentState: string;
    currentZip: string;
    destinationAddreddaddressLine1: string;
    destinationAddreddaddressLine2: string;
    destinationCity: string;
    destinationState: string;
    destinationZip: string;
    itineraryCitiesToDestination : any;
    itineraryCitiesToCurrent : any;
    currentCityLat: any;
    currentCityLng: any;
    nearByCitiesArray: any;
}