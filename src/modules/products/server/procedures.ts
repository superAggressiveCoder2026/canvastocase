import { baseProcedure,createTRPCRouter } from "@/trpc/init";
import { z } from "zod";
import  type{ Sort, Where } from "payload";
import { Category, Media, Tenant } from "@/payload-types";
import { sortValues } from "../search-Params";
import { DEFAULT_LIMIT } from "@/constant";


export const productsRouter= createTRPCRouter({
    getMany:baseProcedure
    .input(
      z.object({
        cursor:z.number().default(1),
        limit:z.number().default(DEFAULT_LIMIT),
        category:z.string().nullable().optional(),
        minPrice:z.string().nullable().optional(),
        maxPrice:z.string().nullable().optional(),
        tags:z.array(z.string()).nullable().optional(),
        sort:z.enum(sortValues).nullable().optional(),
        tenantSlug:z.string().nullable().optional(),
      }),
    )
  .query(async({ctx,input})=>{   
    const where:Where  ={};
    let sort:Sort="-createdAt";

    if (input.sort ==="curated"){
      sort="createdAt";
    }

    if (input.sort ==="hot_and_new"){
      sort="-createdAt";}

    if (input.sort ==="trending"){
      sort="+createdAt";}
    

if (input.minPrice && input.maxPrice){
  where.price={
     greater_than_equal:input.minPrice,
    less_than_equal:input.maxPrice,
  }
}else if (input.minPrice){
  where.price={
     greater_than_equal:input.minPrice
  }
} else if (input.maxPrice){
  where.price={ 
    ...where.price,
    less_than_equal:input.maxPrice
  }
}
if(input.tenantSlug){
  where["tenant.slug"]={
    equals:input.tenantSlug,
  };
}


    if (input.category){
      const categoriesData=await ctx.db.find({
        collection:"categories",
        limit:1,
        depth:1,
        pagination:false,
        where:{
          slug:{
            equals:input.category,
          }
        }
      });
       const formattedData = categoriesData.docs.map((doc) => ({
            ...doc,
            subcategories: (doc.subcategories?.docs ?? []).map((doc) => ({
              ...(doc as Category),
              
            }))
          }));
      const subcategoriesSlugs=[];
      const parentCategory=formattedData[0];
      if (parentCategory){
        subcategoriesSlugs.push(...parentCategory.subcategories.map((subcategory)=>subcategory.slug))
        where["category.slug"]={
          in:[parentCategory.slug, ...subcategoriesSlugs]
        }
      }
    }

    if (input.tags && input.tags.length > 0 ){
      where["tags.name"]={
        in:input.tags,
      };
    }
  const data = await ctx.db.find({
    collection: "product",
    depth: 1,
    where,
    sort,
    page:input.cursor,
    limit:input.limit,
  });
  

        return{
          ...data,
          docs:data.docs.map((doc)=>({
            ...doc,
            image:doc.image as Media ||null, 
            tenant:doc.tenant as Tenant &{image:Media|null},
          }))
        }
    }),
});