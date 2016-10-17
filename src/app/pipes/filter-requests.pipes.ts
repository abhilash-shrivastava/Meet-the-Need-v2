/**
 * Created by Abhi on 10/16/16.
 */
import { Pipe, PipeTransform } from '@angular/core';


@Pipe({ name: 'filterRequests' })
export class FilterRequestsPipe implements PipeTransform {
    transform(requests: [], journeyDate: string) {
        return requests.filter((req) => req.journeyDate == journeyDate );
    }
}