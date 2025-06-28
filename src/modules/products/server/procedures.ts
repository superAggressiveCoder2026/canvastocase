import { baseProcedure,createTRPCRouter } from "@/trpc/init";
import { z } from "zod";
import  type{ Where } from "payload";
import { Category } from "@/payload-types";

export const productsRouter= createTRPCRouter({
    getMany:baseProcedure
    .input(
      z.object({
        category:z.string().nullable().optional(),
        minPrice:z.string().nullable().optional(),
        maxPrice:z.string().nullable().optional(),

      }),
    )
  .query(async({ctx,input})=>{   
    const where:Where  ={};

if (input.minPrice){
  where.price={greater_than_equal:input.minPrice
  }

if (input.maxPrice){
  where.price={less_than_equal:input.maxPrice
  }
}
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
  const data = await ctx.db.find({
    collection: "product",
    depth: 1,
    where,
  });
  

        return data; 

    }),
});