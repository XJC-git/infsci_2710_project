import Head from "next/head";
import TaskBar from "../components/taskbar";
import Products from "../components/products";
import useFromStore from "../components/store";
import {useCart, useUserID} from "../components/state";
import {useEffect, useState} from "react";
import axios_instance from "../app/axios";
import {remove} from "next/dist/build/webpack/loaders/resolve-url-loader/lib/file-protocol";
import {useRouter} from "next/router";
import {Transition} from "@headlessui/react";
import Notification from "../components/notification";

export default function shoppingCart(){
    const router = useRouter()
    const items = useFromStore(useCart,state=>state.items)
    const amounts = useFromStore(useCart,state=>state.amounts)
    const [productInfo,setProductInfo] = useState({})
    const [isLoading, setIsLoading] = useState(true)
    const {addItem,reduceItem,removeItem,clearCart} = useCart()
    const [total,setTotal] = useState(0)
    const userID = useFromStore(useUserID,state => state.userID)
    const [showSubmitPopup, setShowSubmitPopup] = useState(false)
    const [isSubmitting,setIsSubmitting] = useState(false)
    const [showNotification,setShowNotification] = useState(false)
    const [typeNotification,setTypeNotification] = useState('success')
    const [contextNotification,setContextNotification] = useState('EMPTY MSG')
    const [mainTransactionID, setMainTransactionID] = useState(-1)
    useEffect(() => {
        let loaded = 0;
        if(items&&items.length===0){
            setIsLoading(false)
            return
        }
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
    }, [items?.length]);

    useEffect(() => {
        if(!isLoading){
            let temp_total = 0;
            items?.map((item,index)=>(
              temp_total+=amounts[index]*productInfo[item]['price']
            ))
            setTotal(temp_total.toFixed(2))
        }
    }, [amounts,isLoading]);

    const handleSubmit = ()=>{
        if(userID===0)router.push("/login/user")
        else{
            setShowSubmitPopup(true)
        }
    }

    const handleFinalSubmit = ()=>{
        setIsSubmitting(true)
        const today = new Date();
        const yyyy = today.getFullYear();
        let mm = today.getMonth() + 1;
        let dd = today.getDate();

        if (dd < 10) dd = '0' + dd;
        if (mm < 10) mm = '0' + mm;

        const formattedToday = yyyy+'-'+mm+'-'+dd;
        const salesperson = document.querySelector("#salespersonID").value;
        if(mainTransactionID===-1){
            axios_instance.post("/transaction",null,{params:{
                    date:formattedToday,
                    salesperson_id:salesperson,
                    customer_id:userID
                }}
            ).then((res) => {
                let transactionID = res.data['transaction_id']
                setMainTransactionID(transactionID)
                submitSubTransaction(transactionID)
            }).catch((error)=>{
                setIsSubmitting(false)
                if(error.response){
                    setTypeNotification('fail')
                    setContextNotification(error.response.data)
                    setShowNotification(true)
                    setTimeout(function() {
                        setShowNotification(false)
                    }, 2000);
                }
                else{
                    setTypeNotification('fail')
                    setContextNotification(error.message)
                    setShowNotification(true)
                    setTimeout(function() {
                        setShowNotification(false)
                    }, 2000);
                }

            });
        }
        else{
            submitSubTransaction(mainTransactionID)
        }

    }
    const submitSubTransaction = (transactionID)=>{
        axios_instance.post("/sub_transaction/"+transactionID,null,{params:{
                product_id:'['+items.toString()+']',
                quantity:'['+amounts.toString()+']'
            }}
        ).then((res) => {
            setIsSubmitting(false)
            setTypeNotification('success')
            setContextNotification(res.data)
            setShowNotification(true)
            setTimeout(function() {
                setShowNotification(false)
                clearCart()
                router.push("/home")
            }, 2000);
        }).catch((error)=>{
            setIsSubmitting(false)
            if(error.response){
                setTypeNotification('fail')
                setContextNotification(error.response.data)
                setShowNotification(true)
                setTimeout(function() {
                    setShowNotification(false)
                }, 2000);
            }
            else{
                setTypeNotification('fail')
                setContextNotification(error.message)
                setShowNotification(true)
                setTimeout(function() {
                    setShowNotification(false)
                }, 2000);
            }

        });
    }
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
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 ml-4 mr-4 ">
                            {Array.apply(null, Array(8)).map((item)=>(
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
                            ))}
                        </div>
                        :
                        items?.length==0?
                            <div className="flex flex-row h-screen items-center justify-center text-4xl font-bold w-full text-center bg-gradient-to-br from-fuchsia-600 to-sky-600 bg-clip-text text-transparent tracking-wide leading-tight">Shopping Cart is empty, go shopping</div>:
                        <>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 ml-4 mr-4 ">
                                {items?.map((item,index)=> {
                                    return (
                                        <div key={item}
                                             className="flex w-full rounded-lg bg-white bg-opacity-80 shadow-2xl p-4 hover:bg-gray-100 mb-2">
                                            <div className="">
                                                <img className="w-32 h-32 rounded-lg" src={productInfo[item]['avatar']}></img>
                                            </div>
                                            <div className="flex flex-col ml-4 w-full">
                                                <div className="flex font-bold text-lg">
                                                    {productInfo[item]['name']}
                                                </div>
                                                <div className="flex text-md text-gray-400">
                                                    {productInfo[item]['category']}
                                                </div>
                                                <div className="flex text-md text-blue-500">
                                                    Unit Price: {productInfo[item]['price']}
                                                </div>
                                                <div className="flex grow items-end">
                                                    <div className="flex flex-row justify-between w-full">
                                                        <div className="flex text-md text-orange-500">
                                                            Total Price: {(productInfo[item]['price']*amounts[index]).toFixed(2).replace(/[.,]00$/, "")}
                                                        </div>
                                                        <div className="flex flex-row items-center">
                                                            <button onClick={()=>removeItem(item)} className="w-8 h-8 outline-none bg-red-500 rounded-xl hover:bg-red-800 text-lg text-white text-center">
                                                                x
                                                            </button>
                                                            <button onClick={()=>reduceItem(item)} className="w-8 h-8 ml-2 outline-none bg-blue-500 rounded-xl hover:bg-blue-800 text-lg text-white text-center font-bold disabled:bg-gray-400" disabled={amounts[index]===1}>
                                                                -
                                                            </button>
                                                            <div className="flex test-lg font-bold text-center ml-4 mr-4">
                                                                {amounts[index]}
                                                            </div>
                                                            <button onClick={()=>addItem(item)} className="w-8 h-8 outline-none bg-blue-500 rounded-xl hover:bg-blue-800  text-lg text-white text-center font-bold">
                                                                +
                                                            </button>
                                                        </div>

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>

                            <div className="flex flex-row justify-end ml-4 mr-4 items-center">
                                <div className="flex font-bold text-xl rounded-lg mr-4">
                                    Total:
                                </div>
                                <div className="flex font-bold text-xl rounded-lg mr-4">
                                    {total}
                                </div>
                                <button onClick={handleSubmit} className="flex outline-none bg-blue-500 text-white p-4 rounded-lg hover:bg-blue-800">Submit Order</button>
                            </div>

                        </>
                }





                {/*Submit Popup*/}
                <Transition
                    as='div'
                    show={showSubmitPopup}
                    appear={true}
                    enter="transition-all duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="transition-all duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                    className="absolute z-40 inset-0 min-h-screen w-full h-full bg-gray-800/20 backdrop-blur-sm flex items-center justify-center">
                    <div className="flex w-3/4 flex-col gap-y-2 px-4 rounded-lg bg-white pt-4 pb-4 shadow">
                        <div className="flex items-center w-full justify-between">
                            <div className="flex text-lg font-bold text-left">One more step...</div>
                            <button type="button" className="flex-none inline-flex items-center justify-center text-gray-500 hover:text-gray-700" onClick={()=>setShowSubmitPopup(false)}>
                                <i aria-label="icon: close" className="text-2xl anticon anticon-close">
                                    <svg viewBox="64 64 896 896" data-icon="close" width="1em" height="1em" fill="currentColor" aria-hidden="true" focusable="false" className="">
                                        <path d="M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9A7.95 7.95 0 0 0 203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z">
                                        </path>
                                    </svg>
                                </i>
                            </button>
                        </div>
                        <div className="flex flex-col">
                            <div className="flex text-md">Items</div>
                            <div className="flex flex-col ml-4">
                                {isLoading?"":items?.map((item,index)=>(
                                    <div className="flex text-slate-600 text-sm">
                                        {productInfo[item]['name']} x{amounts[index]}
                                    </div>
                                ))}
                                <div className="flex text-sm">
                                    Total: $ {total}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center w-full">
                            <div className="text-md">Salesperson</div>
                            <input id="salespersonID" placeholder="Search salesperson" className="ml-4 grow w-full h-8 border-2 border-slate-400 rounded-lg pl-4 pr-4 outline-none
                            hover:placeholder-black hover:border-4 hover:border-slate-600"/>
                        </div>
                        <div className="flex text-sm text-slate-400">
                            We need salesperson to authorize this order.
                        </div>
                        <div className="flex flex-row justify-end">
                            <button onClick={handleFinalSubmit} className="flex outline-none bg-orange-500 text-white p-4 rounded-lg hover:bg-orange-800 disabled:bg-orange-800" disabled={isSubmitting}>
                                <svg className={isSubmitting?"animate-spin -ml-1 mr-3 h-5 w-5 text-white":"hidden"} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Confirm Submit
                            </button>
                        </div>
                        <Notification show={showNotification} context={contextNotification} type={typeNotification}></Notification>
                    </div>
                </Transition>

            </div>
        </>
    )
}