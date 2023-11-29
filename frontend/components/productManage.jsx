import {Transition} from "@headlessui/react";
import {useEffect, useState} from "react";
import axios_instance from "../app/axios";
import Notification from "./notification";

const ProductManage = ({id,show,setShow,...props})=>{
    const [isLoading, setIsLoading] = useState(true)
    useEffect(() => {
        if(show){
            axios_instance.post('/query/productID',null,{params:{
                    product_id:id
                }}).then((res) => {
                document.querySelector("#name").value=res.data.name;
                document.querySelector("#price").value=res.data.price;
                document.querySelector("#avatar").value=res.data.avatar;
                document.querySelector("#category").value=res.data.category;
                document.querySelector("#inventoryAmount").value=res.data.inventory_amount;
                setIsLoading(false)
            })
        }
    }, [id,show]);
    const handleChange = () =>{
        const name = document.querySelector("#name").value;
        const price =  document.querySelector("#price").value;
        const inventoryAmount = document.querySelector("#inventoryAmount").value;
        axios_instance.post('/product/change',null,{params:{
                product_id:id,
                name:name,
                price:price,
                inventory_amount:inventoryAmount
            }}).then((res) => {
            setTypeNotification('success')
            setContextNotification(res.data)
            setShowNotification(true)
            setTimeout(function() {
                setShowNotification(false)
                setShow(false)
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
    const handleDelete = ()=>{
        axios_instance.post('/delete/product',null,{params:{
                product_id:id
            }}).then((res) => {
            setShow(false)
            setTypeNotification('success')
            setContextNotification(res.data)
            setShowNotification(true)
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
        <Transition
            as='div'
            show={show}
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
                    <div className="flex text-lg font-bold text-left">Modify product</div>
                    <button type="button" className="flex-none inline-flex items-center justify-center text-gray-500 hover:text-gray-700" onClick={()=>setShow(false)}>
                        <i aria-label="icon: close" className="text-2xl anticon anticon-close">
                            <svg viewBox="64 64 896 896" data-icon="close" width="1em" height="1em" fill="currentColor" aria-hidden="true" focusable="false" className="">
                                <path d="M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9A7.95 7.95 0 0 0 203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z">
                                </path>
                            </svg>
                        </i>
                    </button>
                </div>
                <div className={isLoading?"hidden":"grid grid-cols-2 gap-x-4"}>
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
                        <input disabled={true} id="category" placeholder="" type="text"
                               className="text-gray-400 text-md block px-3 py-2 rounded-lg w-full bg-white border-2 border-gray-300 shadow-md
                                                       focus:placeholder-gray-500
                                                       focus:bg-white
                                                       focus:border-gray-600
                                                       focus:outline-none
                                                        "
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
                    <div className="col-span-2" >
                        <span className="px-1 text-sm text-gray-600">Avatar</span>
                        <input disabled={true} id="avatar" placeholder="" type="text"
                               className="text-gray-400 text-md block px-3 py-2 rounded-lg w-full bg-white border-2 border-gray-300 shadow-md
                                                       focus:placeholder-gray-500
                                                       focus:bg-white
                                                       focus:border-gray-600
                                                       focus:outline-none
                                                       "
                        />
                    </div>
                </div>
                <div className="flex flex-row justify-end mt-4 gap-x-4">
                    <button onClick={handleDelete} className="flex outline-none bg-red-500 text-white p-4 rounded-lg hover:bg-red-800">
                        Delete product
                    </button>
                    <button onClick={handleChange} className="flex outline-none bg-blue-500 text-white p-4 rounded-lg hover:bg-blue-800">
                        Confirm
                    </button>
                </div>
                <div className="h-full mt-4">
                    <Notification show={showNotification} context={contextNotification} type={typeNotification}></Notification>
                </div>
            </div>
        </Transition>

    )
}

export default ProductManage