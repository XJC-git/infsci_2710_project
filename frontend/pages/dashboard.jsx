import Head from "next/head";
import TaskBar from "../components/taskbar";
import {useEffect, useState} from "react";
import axios_instance from "../app/axios";
import SellerList from "../components/sellerList";
import {Transition} from "@headlessui/react";
import ProductManage from "../components/productManage";
import Notification from "../components/notification";

export default function dashboard(){
    const [overallList, setOverallList] = useState([])
    const [overallLoading, setOverallLoading] = useState(true)
    useEffect(() => {
        axios_instance.get('/product/with_transaction').then((res)=>{
            setOverallList(res.data)
            setOverallLoading(false)
        })
    }, []);
    const [addNewPopup, setAddNewPopup] = useState(false)
    const [managePopup, setManagePopup] = useState(false)
    const [searchLoading, setSearchLoading] = useState(false)
    const [products, setProducts] = useState([])
    const [mgID,setMgID] = useState(1)
    const handleSearch = (e)=>{
        if (e.key === 'Enter') {
            setSearchLoading(true)
            const keyword = document.querySelector("#searchProduct").value;
            if(!keyword||keyword.length<=0)return
            axios_instance.post('/search',null,{params:{
                    name:keyword
                }}).then((res) => {
                console.table(res.data);
                setProducts(res.data);
                setSearchLoading(false)
            }).catch((error)=>{console.log(error)})
        }
    }

    useEffect(() => {
        let tmp = {}
        tmp.key = 'Enter'
        handleSearch(tmp)
    }, [managePopup]);

    const handleAdd= ()=>{
        const name = document.querySelector("#name").value;
        const price =  document.querySelector("#price").value;
        const category =  document.querySelector("#category").value;
        const avatar =  document.querySelector("#avatar").value;
        const inventoryAmount = document.querySelector("#inventoryAmount").value;
        axios_instance.post('/product',null,{params:{
                name:name,
                price:price,
                inventory_amount:inventoryAmount,
                avatar:avatar,
                category:category
            }}).then((res) => {
            setTypeNotification('success')
            setContextNotification(res.data)
            setShowNotification(true)
            setTimeout(function() {
                setShowNotification(false)
                setAddNewPopup(false)
            }, 2000);
        }).catch((error)=>{
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

        })
    }

    const [showNotification,setShowNotification] = useState(false)
    const [typeNotification,setTypeNotification] = useState('success')
    const [contextNotification,setContextNotification] = useState('EMPTY MSG')

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

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 ml-4 mr-4">
                    {overallLoading?
                        <div className="col-span-2 animate-pulse flex w-full rounded-lg bg-white bg-opacity-80 shadow-2xl p-4 hover:bg-gray-100 mb-2">
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
                        </div>:
                        <div className="col-span-2 rounded-lg bg-white bg-opacity-80 shadow-2xl p-4">
                            <div className="text-xl font-bold mb-4">
                                Overall bestseller list
                            </div>
                            <SellerList list={overallList}></SellerList>
                        </div>
                    }
                    <div className="rounded-lg bg-white bg-opacity-80 shadow-2xl p-4">
                        <div className="flex flex-row justify-between items-center mb-4">
                            <div className="flex text-xl font-bold text-center">
                                Product Manage
                            </div>
                            <button onClick={()=>setAddNewPopup(true)} className="flex outline-none bg-blue-500 text-white p-4 pt-1.5 pb-1.5 rounded-lg hover:bg-blue-800">
                                Add New
                            </button>
                        </div>

                        <div className="rounded-lg px-4 py-2 ring-1 ring-gray-600
                    hover:text-gray-800
                    hover:ring-gray-800
                    hover:ring-2">
                            <div className="flex flex-1 items-center justify-start md:gap-x-2">
                                <svg width="20" height="20" className="flex" viewBox="0 0 20 20">
                                    <path d="M14.386 14.386l4.0877 4.0877-4.0877-4.0877c-2.9418 2.9419-7.7115 2.9419-10.6533 0-2.9419-2.9418-2.9419-7.7115 0-10.6533 2.9418-2.9419 7.7115-2.9419 10.6533 0 2.9419 2.9418 2.9419 7.7115 0 10.6533z" stroke="currentColor" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round">
                                    </path>
                                </svg>
                                <input id="searchProduct" onKeyDown={handleSearch} className="flex text-lg text-gray-600 whitespace-nowrap bg-transparent focus:outline-none" placeholder="Search product"></input>
                            </div>
                        </div>

                        <div className="flex flex-col gap-y-2 h-full mt-4">
                            {
                                products?.length>0?
                                    <div className="columns-3xs gap-y-4">
                                        {
                                            products.map((product)=>(
                                                <div key={product.product_id} className="w-full mb-2">
                                                    <div onClick={()=>{setMgID(product.product_id);setManagePopup(true)}} className="w-full rounded-lg bg-white bg-opacity-80 shadow-2xl p-4 hover:bg-gray-100">
                                                        <div className="flex flex-row gap-2">
                                                            <div className="flex w-24 rounded-lg">
                                                                <img className="rounded-lg" src={product.avatar}/>
                                                            </div>
                                                            <div className="flex flex-col justify-between">
                                                                <div className="flex flex-col">
                                                                    <div className="flex text-lg font-bold whitespace-nowrap">
                                                                        {product.name}
                                                                    </div>
                                                                    <div className="flex text-sm text-gray-400">
                                                                        {product.category}
                                                                    </div>
                                                                    <div className="flex text-lg font-bold text-blue-500">
                                                                        $ {product.price}
                                                                    </div>
                                                                </div>
                                                                <div className="flex flex-row items-center whitespace-nowrap">
                                                                    {product.inventory_amount} items remain
                                                                </div>
                                                            </div>



                                                        </div>

                                                    </div>
                                                </div>
                                            ))
                                        }
                                    </div>:
                                    <div className="flex flex-row h-full items-center justify-center text-xl font-bold w-full text-center ">No results</div>
                            }
                        </div>
                    </div>
                </div>

            </div>

            <Transition
                as='div'
                show={addNewPopup}
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
                        <div className="flex text-lg font-bold text-left">Add new product</div>
                        <button type="button" className="flex-none inline-flex items-center justify-center text-gray-500 hover:text-gray-700" onClick={()=>setAddNewPopup(false)}>
                            <i aria-label="icon: close" className="text-2xl anticon anticon-close">
                                <svg viewBox="64 64 896 896" data-icon="close" width="1em" height="1em" fill="currentColor" aria-hidden="true" focusable="false" className="">
                                    <path d="M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9A7.95 7.95 0 0 0 203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z">
                                    </path>
                                </svg>
                            </i>
                        </button>
                    </div>
                    <div className="grid grid-cols-2 gap-x-4">
                        <div className="">
                            <span className="px-1 text-sm text-gray-600">Product name</span>
                            <input id="name" placeholder="" type="text"
                                   className="placeholder-gray-400 text-md block px-3 py-2 rounded-lg w-full bg-white border-2 border-gray-300 shadow-md
                                                       focus:placeholder-gray-500
                                                       focus:bg-white
                                                       focus:border-gray-600
                                                       focus:outline-none
                                                       hover:border-gray-400"
                            />
                        </div>
                        <div className="">
                            <span className="px-1 text-sm text-gray-600">Category</span>
                            <input id="category" placeholder="" type="text"
                                   className="placeholder-gray-400 text-md block px-3 py-2 rounded-lg w-full bg-white border-2 border-gray-300 shadow-md
                                                       focus:placeholder-gray-500
                                                       focus:bg-white
                                                       focus:border-gray-600
                                                       focus:outline-none
                                                       hover:border-gray-400"
                            />
                        </div>
                        <div className="">
                            <span className="px-1 text-sm text-gray-600">Price</span>
                            <input id="price" placeholder="" type="text"
                                   className="placeholder-gray-400 text-md block px-3 py-2 rounded-lg w-full bg-white border-2 border-gray-300 shadow-md
                                                       focus:placeholder-gray-500
                                                       focus:bg-white
                                                       focus:border-gray-600
                                                       focus:outline-none
                                                       hover:border-gray-400"
                            />
                        </div>
                        <div className="">
                            <span className="px-1 text-sm text-gray-600">Inventory amount</span>
                            <input id="inventoryAmount" placeholder="" type="text"
                                   className="placeholder-gray-400 text-md block px-3 py-2 rounded-lg w-full bg-white border-2 border-gray-300 shadow-md
                                                       focus:placeholder-gray-500
                                                       focus:bg-white
                                                       focus:border-gray-600
                                                       focus:outline-none
                                                       hover:border-gray-400"
                            />
                        </div>
                        <div className="col-span-2">
                            <span className="px-1 text-sm text-gray-600">Avatar</span>
                            <input id="avatar" placeholder="" type="text"
                                   className="placeholder-gray-400 text-md block px-3 py-2 rounded-lg w-full bg-white border-2 border-gray-300 shadow-md
                                                       focus:placeholder-gray-500
                                                       focus:bg-white
                                                       focus:border-gray-600
                                                       focus:outline-none
                                                       hover:border-gray-400"
                            />
                        </div>
                    </div>
                    <div className="flex flex-row justify-end mt-4 gap-x-4">
                        <button onClick={handleAdd} className="flex outline-none bg-blue-500 text-white p-4 rounded-lg hover:bg-blue-800">
                            Add product
                        </button>
                    </div>
                    <div className="h-full mt-4">
                        <Notification show={showNotification} context={contextNotification} type={typeNotification}></Notification>
                    </div>
                </div>

            </Transition>
            <ProductManage id={1} show={managePopup} setShow={setManagePopup}></ProductManage>
        </>
    )
}