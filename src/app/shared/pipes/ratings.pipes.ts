import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'ratings',
    standalone: true
})

export class RatingPipes implements PipeTransform {
    transform(value: any, ...args: any[]): string {
        return `${value} ratings`;
    }
}