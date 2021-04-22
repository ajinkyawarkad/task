import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search',
})
export class SearchPipe implements PipeTransform {
  
  transform(items: any[], terms: string): any[] {
    if(!items) return [];
    if(!terms) return items;
    terms = terms.toLowerCase();
    return items.filter( it => {
      return it.leads[0].action.toLowerCase().indexOf(terms.toLowerCase()) > -1 ||
             it.leads[1].action.toLowerCase().indexOf(terms.toLowerCase()) > -1  ||
             it.leads[2].action.toLowerCase().indexOf(terms.toLowerCase()) > -1 ||
             it.leads[3].action.toLowerCase().indexOf(terms.toLowerCase()) > -1 
            
            
    });
  }
}
