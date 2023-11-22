import axios_instance from "app/axios";
import {useEffect, useState} from "react";
import {useRouter} from "next/router";
export default function Products(){
    const [products, setProducts] = useState([])
    useEffect(() => {
        axios_instance.get('/query/product',null,).then((res) => {
            console.table(res.data);
            setProducts(res.data);
        }).catch((error)=>{console.log(error)})
    }, []);
    return(
        <>
            <div className="columns-3">
                {
                    products.map((product)=>(
                        <div key={product.id} className="w-full">
                            <div className="w-full rounded-lg bg-white bg-opacity-80 p-4 hover:bg-gray-100">
                                <div className="flex flex-row gap-2">
                                    <div className="flex w-1/3 rounded-lg">
                                        <img className="rounded-lg" src={product.avatar}/>
                                    </div>
                                    <div className="text-lg font-bold">
                                        {product.name}
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