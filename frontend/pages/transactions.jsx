import Head from "next/head";
import TaskBar from "../components/taskbar";
import {useEffect, useState} from "react";
import axios_instance from "../app/axios";
import useFromStore from "../components/store";
import {useUserID} from "../components/state";

export default function transactions(){
    const userID = useFromStore(useUserID,state => state.userID)
    const userType = useFromStore(useUserID,state => state.userType)

    const [transaction, setTransaction] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [productInfo, setProductInfo] = useState({})
    useEffect(() => {
        if(!userID||userID===0)return
        let url = '/query/transaction/customerID'
        if(userType!=='Customer'){
            url = '/query/transaction/salespersonID'
        }
        axios_instance.post(url,null,{params:{
                customer_id:userID,
                salesperson_id:userID
            }}).then((res)=>{
            setTransaction(res.data)
            let loaded = 0
            let total = 0
            res.data.map((tx)=>{
                tx['sub_transactions'].map((prd)=>{
                    total+=1;
                })
            })
            res.data.map((tx)=>{
                tx['sub_transactions'].map((prd)=>{
                    axios_instance.post('/query/productID',null,{params:{
                            product_id:prd['product_id']
                    }}).then((res) => {
                        productInfo[prd['product_id']] = res.data
                        setProductInfo(productInfo)
                        loaded+=1
                        if(loaded===total){
                            setIsLoading(false)
                        }
                    })
                })
            })
        })
    }, [userID]);
    return(
        <>
            <Head>
                <title>Transactions</title>
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

                <div className="text-4xl font-bold ml-10 mr-10">Order history</div>

                {isLoading?
                    <>
                        <div className="mt-16 ml-10 mr-10 grid grid-cols-1 gap-4">
                            {Array.apply(null, Array(8)).map((item)=>(
                                <div key={item}
                                     className="animate-pulse flex w-full rounded-lg bg-white bg-opacity-80 shadow-2xl p-4 mb-2">
                                    <div className="w-32 h-32 rounded-lg bg-slate-200"></div>
                                    <div className="flex flex-col ml-4 w-full">
                                        <div className="h-2 bg-slate-200 rounded"></div>
                                        <div className="mt-4 space-y-3">
                                            <div className="grid grid-cols-3 gap-4">
                                                <div className="h-2 bg-slate-200 rounded col-span-2"></div>
                                                <div className="h-2 bg-slate-200 rounded col-span-1"></div>
                                            </div>
                                            <div className="h-2 bg-slate-200 rounded"></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                    :
                    <div className="ml-10 mr-10 mt-16">
                        {
                            transaction.map((tx)=>(
                                <div className="mt-2 w-full rounded-lg border-2">
                                    <div className="flex flex-col justify-center">
                                        <div className="flex flex-row w-full p-2 gap-8 bg-gray-100 bg-opacity-80">
                                            <div className="flex flex-col">
                                                <div className="text-sm text-gray-800">
                                                    ORDER PLACED
                                                </div>
                                                <div className="text-md font-bold ">
                                                    {tx['date'].substring(0,transaction[0]['date'].indexOf('00'))}
                                                </div>
                                            </div>
                                            <div className="flex flex-col">
                                                <div className="text-sm text-gray-800">
                                                    CUSTOMER
                                                </div>
                                                <div className="text-md font-bold ">
                                                    {tx['customer_id']}
                                                </div>
                                            </div>
                                            <div className="flex flex-col">
                                                <div className="text-sm text-gray-800">
                                                    AUTHORIZED BY
                                                </div>
                                                <div className="text-md font-bold ">
                                                    {tx['salesperson_id']}
                                                </div>
                                            </div>
                                        </div>

                                        {
                                            tx['sub_transactions'].map((subTx)=>(
                                                <div className="flex flex-row bg-white opacity-80 p-2 border-b-2 gap-2">
                                                    <div className="flex w-24 h-24 rounded-lg">
                                                        <img className="rounded-lg w-24 h-24" src={productInfo[subTx['product_id']]?.avatar}/>
                                                    </div>
                                                    <div className="flex flex-col opacity-100">
                                                        <div className="font-bold ">
                                                            {productInfo[subTx['product_id']]?.name}
                                                        </div>
                                                        <div className="">
                                                            Unit Price: {productInfo[subTx['product_id']]?.price}
                                                        </div>
                                                        <div className="">
                                                            Quantity: {[subTx['quantity']]}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
                            ))
                        }
                    </div>}
            </div>
        </>
    )
}