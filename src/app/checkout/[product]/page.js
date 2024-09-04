import CheckOutCARD from "@/app/components/checkoutCard";
import NOdatacard from "@/app/components/noDatacard";


export default function ProductCheckout({params}){

    return (
        <>
        {
            params === undefined ? <NOdatacard/> :
            (params.product === "productchekout" || params.product === "cartCheckout")  
            ? <CheckOutCARD stateToRead={params.product}/> :
            <NOdatacard text={"Error checking out please select some thing"}/>
        }
        </>
    )
}