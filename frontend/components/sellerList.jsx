import {useEffect, useState} from "react";
import axios_instance from "../app/axios";

const sellerList = ({list,...props})=>{
    const [isLoading, setIsLoading] = useState(true)
    const [productInfo,setProductInfo] = useState({})
    useEffect(() => {
        let loaded = 0;
        if(!list||list.length===0){
            return
        }
        list?.map((item,index)=>(
            axios_instance.post('/query/productID',null,{params:{
                    product_id:item['product_id']
                }}).then((res) => {
                let temp_info = productInfo
                temp_info[item['product_id']] = res.data
                setProductInfo(temp_info)
                loaded+=1;
                if(loaded===list.length){
                    setIsLoading(false)
                }
            }))
        )
    }, []);

    return(
        <div className="flex flex-col gap-1 opacity-90">
            {
                isLoading?
                    Array.apply(null, Array(10)).map((item)=>(
                            <div key={item}
                                 className="animate-pulse flex w-full rounded-lg bg-white bg-opacity-80 shadow-2xl p-4 hover:bg-gray-100 mb-2">
                                <div className="w-32 h-32 rounded-lg bg-slate-200"></div>
                                <div className="flex flex-col ml-4 w-full">
                                    <div className="h-2 bg-slate-200 rounded"></div>
                                    <div className="mt-4 space-y-3">
                                        <div className="grid grid-cols-3 gap-4">
                                            <div className="h-2 bg-slate-200 rounded col-span-2"></div>
                                            <div class="h-2 bg-slate-200 rounded col-span-1"></div>
                                        </div>
                                        <div class="h-2 bg-slate-200 rounded"></div>
                                    </div>
                                </div>
                            </div>
                    )):
                    list.slice(0, 10).map((item,index)=>(
                            <div className="flex rounded-lg bg-slate-100 p-1 bg-opacity-80">
                                <div className="flex flex-row gap-2">
                                    <div className="text-xl font-bold w-8 h-full text-center">
                                        {index+1}
                                    </div>
                                    <div className="flex w-16 rounded-lg">
                                        <img className="rounded-lg" src={productInfo[item.product_id].avatar}/>
                                    </div>
                                    <div className="flex flex-col justify-between">
                                        <div className="flex flex-col">
                                            <div className="flex text-lg font-bold">
                                                {productInfo[item.product_id].name}
                                            </div>
                                            <div className="flex text-sm text-gray-400">
                                                {productInfo[item.product_id].category}
                                            </div>
                                            <div className="flex text-lg font-bold text-blue-500">
                                                Vol: {item.sales}
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                    ))
            }

        </div>
    )
}


export default sellerList