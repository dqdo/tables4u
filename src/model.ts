/**
 * What you will find is that the Model class "vanishes" with your React application, and the
 * top-level React GUI object (i.e., the top-level boundary object) will maintain references
 * to the state that it works with.
 */

export class Restaurant {
    id:string
    name:string
    location:string
    status:string

    constructor(id:string, name:string, location:string, status:string) {
        this.name = name
        this.id=id
        this.location=location
        this.status=status
       
    }

   

    
}
