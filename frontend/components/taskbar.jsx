import {useEffect, useState} from "react";
import {Transition} from "@headlessui/react";
import {useRouter} from "next/router";
import {useCart, useUserID} from "./state";
import useFromStore from "./store";
import axios_instance from "../app/axios";

const rec = ['iPhone 15','laptop','headphones']
export default function TaskBar(){
    const router = useRouter();
    const path = router.asPath
    const [menu,setMenu] = useState(false)
    const [searchPopup,setSearchPopup] = useState(false)
    const userID = useFromStore(useUserID,state => state.userID)
    const {amounts} = useCart()
    const [total,setTotal] = useState(0)
    const [infPopup, setInfPopup] = useState(false)
    const [isInfLoading, setIsInfLoading] = useState(true)
    const userType = useFromStore(useUserID,state => state.userType)
    const userInfo = useFromStore(useUserID,state => state.userInfo)
    const {removeAll} = useUserID()
    const [confirmShow,setConfirmShow] = useState(false)
    const [transaction, setTransaction] = useState([])
    const [firstTxInfo,setFirstTxInfo] = useState({})
    useEffect(() => {
        setTotal(amounts?.reduce((a, b) => {
            return a + b;
        },0));
    }, [amounts]);

    useEffect(() => {
        if(!userID||userID===0)return
        axios_instance.post('/query/transaction/customerID',null,{params:{
                customer_id:userID
        }}).then((res)=>{
            setTransaction(res.data)
            if(res.data.length>0){
                res.data[0]['sub_transactions'].map((item)=>{
                    axios_instance.post('/query/productID',null,{params:{
                            product_id:item['product_id']
                    }}).then((res) => {
                        firstTxInfo[item['product_id']] = res.data
                        setFirstTxInfo(firstTxInfo)
                    })
                })

            }

        })
    }, [userID]);

    const handleLoginClick = ()=>{
        if(userID===0){
            router.push("/login/user")
        }else{
            setInfPopup(true)
        }
    }

    const handleLogOut = () => {
        setInfPopup(false)
        setTimeout(function() {
            removeAll()
        }, 200);
    }

    return(
        <>
            <nav className="p-6 md:px-10">
                {/*Drawer*/}
                <div className="flex md:hidden">
                    <button type="button" className="inline-flex items-center justify-center text-gray-500 hover:text-gray-700" onClick={()=>setMenu(true)}>
                        <i aria-label="icon: menu" className="text-2xl anticon anticon-menu">
                            <svg viewBox="64 64 896 896" data-icon="menu" width="1em" height="1em" fill="currentColor" aria-hidden="true" focusable="false" className="">
                                <path d="M904 160H120c-4.4 0-8 3.6-8 8v64c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-64c0-4.4-3.6-8-8-8zm0 624H120c-4.4 0-8 3.6-8 8v64c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-64c0-4.4-3.6-8-8-8zm0-312H120c-4.4 0-8 3.6-8 8v64c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-64c0-4.4-3.6-8-8-8z">
                                </path>
                            </svg>
                        </i>
                    </button>
                </div>
                {/*Drawer Popup*/}
                <div className={menu?"fixed inset-0 z-10 h-full bg-white p-6":"hidden"}>
                    <div className="flex h-12 items-center justify-between sm:h-14">
                        <button type="button" className="inline-flex items-center justify-center text-gray-500 hover:text-gray-700" onClick={()=>setMenu(false)}>
                            <i aria-label="icon: close" className="text-2xl anticon anticon-close">
                                <svg viewBox="64 64 896 896" data-icon="close" width="1em" height="1em" fill="currentColor" aria-hidden="true" focusable="false" className="">
                                    <path d="M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9A7.95 7.95 0 0 0 203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z">
                                    </path>
                                </svg>
                            </i>
                        </button>
                    </div>
                    <div className="space-y-4"><div className="space-y-3 pt-6">
                        <div>
                            <a href="/" aria-current="page" className="block rounded-lg bg-gray-100 p-4 text-xl font-bold hover:bg-gray-200 hover:text-gray-600 nuxt-link-exact-active nuxt-link-active text-gray-800">
                                Home
                            </a>
                        </div>
                        <div>
                            <a href="/shoppingCart" className="block rounded-lg bg-gray-100 p-4 text-xl font-bold hover:bg-gray-200 hover:text-gray-600 text-gray-400">
                                ShoppingCart
                            </a>
                        </div>
                        <div>
                            <a onClick={()=>{setMenu(false);setSearchPopup(true)}} className="block rounded-lg bg-gray-100 p-4 text-xl font-bold hover:bg-gray-200 hover:text-gray-600 text-gray-400">
                                Search
                            </a>
                        </div>
                    </div>
                        <div className="pt-4"><a href="/login/user" className="block rounded-lg bg-gray-100 p-4 text-xl font-bold text-gray-600 hover:bg-gray-200 hover:text-gray-800">
                            Login
                        </a>
                        </div>
                    </div>
                </div>
                {/*Center Buttons*/}
                <div className="flex h-12 flex-1 items-center justify-between sm:h-14">
                    <div className="hidden md:flex md:flex-1  gap-12">
                        <a href="/home" className={(path==="/home"?"text-gray-800":"text-gray-400")+" text-xl font-bold hover:text-gray-600"}>
                            Home
                        </a>
                        <a href="/shoppingCart" className={(path==="/shoppingCart"?"text-gray-800":"text-gray-400")+" flex flex-row gap-2 text-xl font-bold hover:text-gray-600"}>
                            <div className="flex">
                                ShoppingCart
                            </div>
                            <div className="flex rounded-lg bg-gray-400 text-white w-min pl-1 pr-1">
                                {total}
                            </div>
                        </a>

                    </div>
                    <div className="hidden md:flex md:flex-1 md:justify-end gap-x-2">
                        <a  onClick={()=>setSearchPopup(true)} className="rounded-lg px-4 py-2 ring-1 ring-gray-600
                    hover:text-gray-800
                    hover:ring-gray-800
                    hover:ring-2">
                            <div className="flex flex-1 items-center justify-between md:gap-x-2">
                                <svg width="20" height="20" className="flex" viewBox="0 0 20 20">
                                    <path d="M14.386 14.386l4.0877 4.0877-4.0877-4.0877c-2.9418 2.9419-7.7115 2.9419-10.6533 0-2.9419-2.9418-2.9419-7.7115 0-10.6533 2.9418-2.9419 7.7115-2.9419 10.6533 0 2.9419 2.9418 2.9419 7.7115 0 10.6533z" stroke="currentColor" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round">
                                    </path>
                                </svg>
                                <span className="flex text-lg text-gray-600 whitespace-nowrap">Search products, stores....</span>
                            </div>
                        </a>

                        <div onClick={handleLoginClick} className="whitespace-nowrap rounded-lg px-4 py-2 text-lg font-bold text-gray-600 ring-1 ring-gray-600
                    hover:text-gray-800
                    hover:ring-gray-800
                    hover:ring-2">
                            {userID===0?"Log in":userID}
                        </div>
                    </div>
                </div>
                {/*Login Button*/}



            </nav>

            {/*Search Popup*/}
            <Transition
                as='div'
                show={searchPopup}
                appear={true}
                enter="transition-all duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-all duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
                className="absolute z-40 inset-0 min-h-screen w-full h-full bg-gray-800/20 backdrop-blur-sm flex items-center justify-center">
                <div className="flex w-3/4 flex-col items-center gap-y-2 rounded-lg bg-white pt-4 pb-4 shadow">
                    <div className="flex px-4 items-center w-full">
                        <input placeholder="Search" className="grow w-full h-8 hover:placeholder-black focus:outline-none"/>
                        <button type="button" className="flex-none inline-flex items-center justify-center text-gray-500 hover:text-gray-700" onClick={()=>setSearchPopup(false)}>
                            <i aria-label="icon: close" className="text-2xl anticon anticon-close">
                                <svg viewBox="64 64 896 896" data-icon="close" width="1em" height="1em" fill="currentColor" aria-hidden="true" focusable="false" className="">
                                    <path d="M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9A7.95 7.95 0 0 0 203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z">
                                    </path>
                                </svg>
                            </i>
                        </button>
                    </div>
                    <div className="border-gray-100 border-t-2 w-full p-4">
                        Recommend
                        <div className="flex gap-x-2 mt-2">
                            {rec.map((item=>(
                                <a href={"/search?keyword="+item.valueOf()} className="rounded-xl bg-blue-500/20 text-sm px-2 hover:bg-blue-500/60">
                                    {item}
                                </a>
                            )))}
                        </div>


                    </div>
                </div>
            </Transition>

            {/*Information Popup*/}
            <Transition
                as='div'
                show={infPopup}
                appear={true}
                enter="transition-all duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-all duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
                className="absolute z-40 inset-0 min-h-screen w-full h-full bg-gray-800/20 backdrop-blur-sm flex items-center justify-center">
                <div className="flex w-3/4 flex-col px-4 rounded-lg bg-white pt-4 pb-4 shadow">
                    <div className="flex items-center w-full justify-between">
                        <div className="flex text-lg font-bold text-left">Information</div>
                        <button type="button" className="flex-none inline-flex items-center justify-center text-gray-500 hover:text-gray-700" onClick={()=>setInfPopup(false)}>
                            <i aria-label="icon: close" className="text-2xl anticon anticon-close">
                                <svg viewBox="64 64 896 896" data-icon="close" width="1em" height="1em" fill="currentColor" aria-hidden="true" focusable="false" className="">
                                    <path d="M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9A7.95 7.95 0 0 0 203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z">
                                    </path>
                                </svg>
                            </i>
                        </button>
                    </div>


                    <div className="flex flex-row items-center gap-2">
                        <div className={"flex text-4xl font-bold"}>
                            {userID}
                        </div>
                        {userType==='customer'?
                            <div className={"rounded-xl bg-green-500 text-white text-sm pl-2 pr-2"}>Customer</div>
                            :
                            <div className={"rounded-xl bg-blue-500 text-white text-sm pl-2 pr-2"}>Salesperson</div>
                        }
                    </div>

                    <div onClick={()=>router.push("/transactions")} className="mt-4 flex flex-row gap-2 w-48 h-8 justify-between items-center bg-blue-500 text-white whitespace-nowrap rounded-lg pl-2 pr-2 hover:bg-blue-800">
                        <div>History Orders</div>
                        <div className="font-bold">
                            →
                        </div>
                    </div>

                    {
                        transaction.length===0?
                            <div className="mt-2 w-full h-16 rounded-lg border-2 flex flex-row items-center">
                                <div className="pl-4 flex">
                                    No history orders
                                </div>
                            </div>
                            :
                            <div className="mt-2 w-full h-48 rounded-lg border-2">
                                <div className="flex flex-col h-full justify-center">
                                    <div className="flex flex-row w-full p-2 gap-8">
                                        <div className="flex flex-col">
                                            <div className="text-sm text-gray-800">
                                                ORDER PLACED
                                            </div>
                                            <div className="text-md font-bold text-gray-600">
                                                {transaction[0]['date'].substring(0,transaction[0]['date'].indexOf('00'))}
                                            </div>
                                        </div>
                                        <div className="flex flex-col">
                                            <div className="text-sm text-gray-800">
                                                CUSTOMER
                                            </div>
                                            <div className="text-md font-bold text-gray-600">
                                                {transaction[0]['customer_id']}
                                            </div>
                                        </div>
                                        <div className="flex flex-col">
                                            <div className="text-sm text-gray-800">
                                                AUTHORIZED BY
                                            </div>
                                            <div className="text-md font-bold text-gray-600">
                                                {transaction[0]['salesperson_id']}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-row bg-gray-100 h-full overflow-x-hidden">
                                        {
                                            transaction[0]['sub_transactions'].map((item)=> (
                                                <div className=" flex flex-row gap-2 rounded-lg items-center bg-white bg-opacity-80 m-2 relative">
                                                    <div className="flex w-24 h-24 rounded-lg">
                                                        <img className="rounded-lg" src={firstTxInfo[item['product_id']]?.avatar}/>
                                                    </div>
                                                    <div className="absolute bottom-1 right-1 w-6 h-6 text-center rounded-full bg-blue-500 text-white">{item['quantity']}</div>
                                                </div>

                                            ))
                                        }
                                    </div>
                                </div>
                            </div>
                    }

                    <div onClick={()=>setConfirmShow(!confirmShow)} className="mt-4 flex flex-row gap-2 w-48 h-8 justify-between items-center bg-blue-500 text-white whitespace-nowrap rounded-lg pl-2 pr-2 hover:bg-blue-800">
                        <div>Personal Detail</div>
                        <div>
                            {
                                confirmShow?
                                    <svg viewBox="64 64 896 896" data-icon="eye-invisible" width="1em" height="1em" fill="currentColor" aria-hidden="true" focusable="false" className=""><path d="M942.2 486.2Q889.47 375.11 816.7 305l-50.88 50.88C807.31 395.53 843.45 447.4 874.7 512 791.5 684.2 673.4 766 512 766q-72.67 0-133.87-22.38L323 798.75Q408 838 512 838q288.3 0 430.2-300.3a60.29 60.29 0 0 0 0-51.5zm-63.57-320.64L836 122.88a8 8 0 0 0-11.32 0L715.31 232.2Q624.86 186 512 186q-288.3 0-430.2 300.3a60.3 60.3 0 0 0 0 51.5q56.69 119.4 136.5 191.41L112.48 835a8 8 0 0 0 0 11.31L155.17 889a8 8 0 0 0 11.31 0l712.15-712.12a8 8 0 0 0 0-11.32zM149.3 512C232.6 339.8 350.7 258 512 258c54.54 0 104.13 9.36 149.12 28.39l-70.3 70.3a176 176 0 0 0-238.13 238.13l-83.42 83.42C223.1 637.49 183.3 582.28 149.3 512zm246.7 0a112.11 112.11 0 0 1 146.2-106.69L401.31 546.2A112 112 0 0 1 396 512z"></path><path d="M508 624c-3.46 0-6.87-.16-10.25-.47l-52.82 52.82a176.09 176.09 0 0 0 227.42-227.42l-52.82 52.82c.31 3.38.47 6.79.47 10.25a111.94 111.94 0 0 1-112 112z"></path></svg>
                                    :
                                    <svg viewBox="64 64 896 896" data-icon="eye" width="1em" height="1em" fill="currentColor" aria-hidden="true" focusable="false" className=""><path d="M942.2 486.2C847.4 286.5 704.1 186 512 186c-192.2 0-335.4 100.5-430.2 300.3a60.3 60.3 0 0 0 0 51.5C176.6 737.5 319.9 838 512 838c192.2 0 335.4-100.5 430.2-300.3 7.7-16.2 7.7-35 0-51.5zM512 766c-161.3 0-279.4-81.8-362.7-254C232.6 339.8 350.7 258 512 258c161.3 0 279.4 81.8 362.7 254C791.5 684.2 673.4 766 512 766zm-4-430c-97.2 0-176 78.8-176 176s78.8 176 176 176 176-78.8 176-176-78.8-176-176-176zm0 288c-61.9 0-112-50.1-112-112s50.1-112 112-112 112 50.1 112 112-50.1 112-112 112z"></path></svg>
                            }
                        </div>
                    </div>
                    <div className="mt-2 grid grid-cols-2 p-2 rounded-lg border-2">
                        {confirmShow?Object.keys(userInfo)?.map((item)=>(
                            <div className="flex flex-row">
                                <div className="flex font-bold">
                                    {item}:
                                </div>
                                <div className="flex pl-2">
                                    {userInfo[item]}
                                </div>
                            </div>
                        )):(
                            <>
                                <div className="flex flex-row">
                                    <div className="flex font-bold">
                                        ****:
                                    </div>
                                    <div className="flex pl-2">
                                        *****
                                    </div>
                                </div>
                                <div className="flex flex-row">
                                    <div className="flex font-bold">
                                        ****:
                                    </div>
                                    <div className="flex pl-2">
                                        *****
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    <div className="flex flex-row justify-end mt-4">
                        <button onClick={handleLogOut} className="flex outline-none bg-red-500 text-white p-4 rounded-lg hover:bg-red-800">
                            Log out
                        </button>
                    </div>
                </div>
            </Transition>

        </>

    )
}
