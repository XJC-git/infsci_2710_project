import Head from "next/head";
import TaskBar from "../components/taskbar";
import Products from "../components/products";
import useFromStore from "../components/store";
import {useCart} from "../components/state";
import {useEffect, useState} from "react";
import axios_instance from "../app/axios";

export default function shoppingCart(){
    const items = useFromStore(useCart,state=>state.items)
    const amounts = useFromStore(useCart,state=>state.amounts)
    const [productInfo,setProductInfo] = useState({})
    const [isLoading, setIsLoading] = useState(true)
    useEffect(() => {
        let loaded = 0;
        items?.map((item,index)=>(
            axios_instance.post('/query/productID',null,{params:{
                    product_id:item
                }}).then((res) => {
                    let temp_info = productInfo
                    temp_info[item] = res.data
                    setProductInfo(temp_info)
                    loaded+=1;
                    if(loaded===items.length){
                        setIsLoading(false)
                    }
            }))
        )
    }, [items]);

    return(
        <>
            <Head>
                <title>Shopping Cart</title>
                <link rel="icon" href="/app/favicon.ico" />
            </Head>

            <div className="isolate h-full min-h-screen bg-white">
                {/*Background*/}
                <div className="fixed inset-x-0 top-32 -z-10 transform-gpu overflow-hidden bg-fixed blur-xl md:top-8">
                    <svg viewBox="0 0 1636 1030" xmlns="http://www.w3.org/2000/svg" overflow="hidden">
                        <defs>
                            <clipPath id="clip0"><rect x="0" y="0" width="1636" height="1030"/></clipPath>
                            <linearGradient x1="1642.81" y1="11.1518" x2="-6.81238" y2="1018.85" gradientUnits="userSpaceOnUse" spreadMethod="reflect" id="fill1"><stop offset="0" stopColor="#06B6D4"/><stop offset="0.21" stopColor="#06B6D4"/><stop offset="0.46" stopColor="#DAE3F3"/>
                                <stop offset="0.81" stopColor="#5785E5"/><stop offset="0.88" stopColor="#A855F7"/><stop offset="1" stopColor="#A855F7"/>
                            </linearGradient>
                        </defs>
                        <g clipPath="url(#clip0)">
                            <path d="M1300.24 1030 811.987 488.138 0 217.313C205.316 335.302-0.168834 204.552 183.36 596.554L650.416 155.7C652.569 373.801 748.624 818.133 899.443 793.626 1050.26 769.118 1435.99 74.2938 1555.33 8.65328 1674.67-56.9872 1630.56 268.125 1615.49 399.782L1224.91 224.8 1300.24 1030Z" fill="url(#fill1)" fillRule="evenodd"/>
                        </g>
                    </svg>
                </div>

                {/*TaskBar*/}
                <TaskBar/>
                {
                    isLoading?
                        <div>loading</div>
                        :
                        <>
                            <div className="flex flex-col ml-4 mr-4 ">
                                {items?.map((item,index)=> {
                                    return (
                                        <div key={item}
                                             className="flex w-full rounded-lg bg-white bg-opacity-80 shadow-2xl p-4 hover:bg-gray-100 mb-2">
                                            <div className="">
                                                <img className="w-32 h-32 rounded-lg" src={productInfo[item]['avatar']}></img>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>

                        </>
                }



            </div>
        </>
    )
}