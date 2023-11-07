import {useState} from "react";

export default function TaskBar(){
    const [menu,setMenu] = useState(false)
    return(
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
                        <a href="/docs/help" className="block rounded-lg bg-gray-100 p-4 text-xl font-bold hover:bg-gray-200 hover:text-gray-600 text-gray-400">
                            ShoppingCart
                        </a>
                    </div>
                    <div>
                        <a href="/docs/about" className="block rounded-lg bg-gray-100 p-4 text-xl font-bold hover:bg-gray-200 hover:text-gray-600 text-gray-400">
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
                    <a href="/" aria-current="page" className="text-xl font-bold hover:text-gray-600 nuxt-link-exact-active nuxt-link-active text-gray-800">
                    Home
                    </a>
                    <a href="/docs/help" className="text-xl font-bold hover:text-gray-600 text-gray-400">
                    ShoppingCart
                    </a>

                </div>
                <div className="hidden md:flex md:flex-1 md:justify-end gap-x-2">
                    <a  className="rounded-lg px-4 py-2 ring-1 ring-gray-600
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
                    <a href="/login/user" className="whitespace-nowrap rounded-lg px-4 py-2 text-lg font-bold text-gray-600 ring-1 ring-gray-600
                    hover:text-gray-800
                    hover:ring-gray-800
                    hover:ring-2">
                        Log in
                    </a>
                </div>
            </div>
            {/*Login Button*/}

        </nav>
    )
}
