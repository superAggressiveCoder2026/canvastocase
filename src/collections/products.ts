import { CollectionConfig } from "payload";

export const Products:CollectionConfig ={
    slug:"product",
    fields:[
        {
            name:"name",
            type:"text",
            required:true,
        },
        {
            name:"description",
            type:"text",
        },
        {
            name:"price ",
            type:"number",
            required:true,
        },
        {
            name:"category",
            type:"relationship",
            relationTo:"categories",
            hasMany:false,
        },
        {
            name:"image",
            type:"upload",
            relationTo:"media",

        },
        {
            name:"refundPolicy",
            type:"select",
            options:["30-day","14-days","7-days","3-days","1-day","no-refunds"],
            defaultValue:"30-day",
        },
    ],
};