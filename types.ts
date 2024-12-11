export default interface State {
    id:number,
    name:string,
    abv:string,
    capital:string,
    largest_city:string,
    admitted_to_union:string,
    population:string,
    flag:string,
    latitude?:number,
    longitude?:number,
}
export type RootStackParamList = {
    Home: undefined;
    Details: { state: any }; // Hier specificeer je de `state` als parameter
    Map: { state: any };
  };
  