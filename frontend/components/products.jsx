import axios_instance from "app/axios";
import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {useStore} from "zustand";
import {useCart} from "./state";
import useFromStore from "./store";
export default function Products(){
    const [products, setProducts] = useState([])
    useEffect(() => {
        axios_instance.get('/query/product',null,).then((res) => {
            console.table(res.data);
            setProducts(res.data);
        }).catch((error)=>{console.log(error)})
    }, []);
    const {addItem} = useCart()
    return(
        <>
            <div className="columns-3xs gap-y-4  ml-4 mr-4">
                {
                    products.map((product)=>(
                        <div key={product.product_id} className="w-full mb-4">
                            <div onClick={()=>{addItem(product.product_id)}} className="w-full rounded-lg bg-white bg-opacity-80 shadow-2xl p-4 hover:bg-gray-100">
                                <div className="flex flex-row gap-2">
                                    <div className="flex w-1/3 rounded-lg">
                                        <img className="rounded-lg" src={product.avatar}/>
                                    </div>
                                    <div className="flex flex-col justify-between">
                                        <div className="flex flex-col">
                                            <div className="flex text-lg font-bold">
                                                {product.name}
                                            </div>
                                            <div className="flex text-lg font-bold text-blue-500">
                                                $ {product.price}
                                            </div>
                                        </div>
                                        <div className="flex flex-row items-center whitespace-nowrap">
                                            {product.inventory_amount>0?
                                                <>
                                                    <svg className="text-green-500 w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" ><path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" ></path></svg>
                                                    <div className="text-green-500">
                                                        In Stock
                                                    </div>
                                                </>
                                                :
                                                <>
                                                    <svg className="text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z"></path></svg>
                                                    <div className="text-gray-400">
                                                        Not Available
                                                    </div>
                                                </>
                                            }
                                        </div>
                                    </div>

                                </div>

                            </div>
                        </div>
                    ))
                }
            </div>
        </>
    )
}