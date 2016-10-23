import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'CheckboxFilter'
})

export class CheckboxFilterPipe implements PipeTransform {
    transform(values: any[], args: any[]){
        return values.filter(value => {
            for (var arg in args){
                if (value.journeyDate === args[arg].journeyDate){
                    return value.journeyDate;
                }
            }
        });
    }
}