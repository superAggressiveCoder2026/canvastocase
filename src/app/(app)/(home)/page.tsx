import { DEFAULT_LIMIT } from "@/constant";
import { loadProductFilters } from "@/modules/products/search-Params";
import { ProductListView } from "@/modules/products/ui/views/product-list-view";
import {  getQueryClient ,trpc} from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { SearchParams } from "nuqs/server";

interface Props{
    
  searchParams:Promise  <SearchParams>;
};
const Page =async({ searchParams}:Props) =>{
    const filters=await loadProductFilters(searchParams);
    
    const queryClient= getQueryClient();
    void queryClient.prefetchInfiniteQuery(trpc.products.getMany.infiniteQueryOptions({
        ...filters,
        limit:DEFAULT_LIMIT,
}));
    return(
        
            <HydrationBoundary state={dehydrate(queryClient)}>
               <ProductListView/>
            </HydrationBoundary>
        
    );
};
export default Page;