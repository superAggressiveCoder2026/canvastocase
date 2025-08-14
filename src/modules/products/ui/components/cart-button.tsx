import { Button } from "@/components/ui/button";
import {useCart}from "@/modules/checkout/hooks/use-cart";
import{cn}from "@/lib/utils";

interface Props{
    tenantSlug:string;
    productId:string;
};

export const CartButton=({tenantSlug,productId}:Props)=>{
    const cart= useCart(tenantSlug);
    return(
         <Button
             variant="elevated"
             className={cn("flex-1 bg-pink-400",cart.isProductInCart(productId)&&"bg-white")}
             onClick={()=>cart.toggleProduct(productId)}
             >
             {cart.isProductInCart(productId)
             ?"Remove from the cart":
             "Add to cart"
             }
        </Button>
    );
};