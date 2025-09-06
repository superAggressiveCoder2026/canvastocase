/*import { DEFAULT_LIMIT } from "@/constant";
import { loadProductFilters } from "@/modules/products/search-Params";
import { ProductListView } from "@/modules/products/ui/views/product-list-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { SearchParams } from "nuqs/server";

interface Props {
    searchParams:Promise<SearchParams>;
    params:Promise<{slug:string}>;
};
const Page=async({params,searchParams}:Props)=>{
const{slug}=await params;
const filters=await loadProductFilters(searchParams);
const queryClient= getQueryClient();
    void queryClient.prefetchInfiniteQuery(trpc.products.getMany.infiniteQueryOptions({
        ...filters,
        tenantSlug:slug,
        limit:DEFAULT_LIMIT,
}));
return(
    <HydrationBoundary state={dehydrate(queryClient)}>
               <ProductListView tenantSlug={slug} narrowView/>
            </HydrationBoundary>
        
);
}
export default Page;*/