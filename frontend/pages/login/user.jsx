import {useState} from "react";
import axios_instance from "app/axios";
import {useRouter} from "next/router";

export default function User(){
    const router = useRouter();
    const [show,setShow] = useState(false)

    function handleLogin(){
        const username = document.querySelector("#username").value;
        const password = document.querySelector("#password").value;
        axios_instance.post('/login',null,{params:{
            user_id:username,
            password:password
        }}).then((res) => {
            alert(res.data.msg)
        });
    }
    return(
        <>
            {/*<div className="fixed h-screen w-screen -z-10 overflow-hidden blur-sm">*/}
            {/*    <img className="fixed h-screen w-screen" src="https://www.pitt.edu/sites/default/files/styles/tier_one_hero/public/2021-07/mission-t1-cl-top-aerial.jpg?h=2c66ef4f&itok=YlGwAwOr"/>*/}
            {/*</div>*/}
            <div className="flex h-full min-h-screen flex-col items-center justify-center bg-gray-100 gap-y-4 py-4">
                <div className="flex w-80 flex-col items-center gap-y-2 rounded-lg bg-white py-2 pt-8 shadow">
                    <span className="font-bold text-2xl">Log in</span>
                    <form className="w-64">
                        <div className="">
                            <span className="px-1 text-sm text-gray-600">Username</span>
                            <input id="username" placeholder="Enter Username" type="text"
                                   className="placeholder-gray-400 text-md block px-3 py-2 rounded-lg w-full bg-white border-2 border-gray-300 shadow-md
                               focus:placeholder-gray-500
                               focus:bg-white
                               focus:border-gray-600
                               focus:outline-none
                               hover:border-gray-400"
                            />
                        </div>
                        <span className="px-1 text-sm text-gray-600">Password</span>
                        <div className="relative">
                            <input id="password" placeholder="Enter Password" type={!show ? 'password' : 'text'} className="text-md block px-3 py-2 rounded-lg w-full
                        bg-white border-2 border-gray-300 placeholder-gray-400 shadow-md
                        focus:placeholder-gray-500
                        focus:bg-white
                        focus:border-gray-600
                        focus:outline-none
                        hover:border-gray-400"/>
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
                                {
                                    show?
                                        <svg onClick={()=>setShow(!show)} viewBox="64 64 896 896" data-icon="eye-invisible" width="1em" height="1em" fill="currentColor" aria-hidden="true" focusable="false" className=""><path d="M942.2 486.2Q889.47 375.11 816.7 305l-50.88 50.88C807.31 395.53 843.45 447.4 874.7 512 791.5 684.2 673.4 766 512 766q-72.67 0-133.87-22.38L323 798.75Q408 838 512 838q288.3 0 430.2-300.3a60.29 60.29 0 0 0 0-51.5zm-63.57-320.64L836 122.88a8 8 0 0 0-11.32 0L715.31 232.2Q624.86 186 512 186q-288.3 0-430.2 300.3a60.3 60.3 0 0 0 0 51.5q56.69 119.4 136.5 191.41L112.48 835a8 8 0 0 0 0 11.31L155.17 889a8 8 0 0 0 11.31 0l712.15-712.12a8 8 0 0 0 0-11.32zM149.3 512C232.6 339.8 350.7 258 512 258c54.54 0 104.13 9.36 149.12 28.39l-70.3 70.3a176 176 0 0 0-238.13 238.13l-83.42 83.42C223.1 637.49 183.3 582.28 149.3 512zm246.7 0a112.11 112.11 0 0 1 146.2-106.69L401.31 546.2A112 112 0 0 1 396 512z"></path><path d="M508 624c-3.46 0-6.87-.16-10.25-.47l-52.82 52.82a176.09 176.09 0 0 0 227.42-227.42l-52.82 52.82c.31 3.38.47 6.79.47 10.25a111.94 111.94 0 0 1-112 112z"></path></svg>
                                        :
                                        <svg onClick={()=>setShow(!show)} viewBox="64 64 896 896" data-icon="eye" width="1em" height="1em" fill="currentColor" aria-hidden="true" focusable="false" className=""><path d="M942.2 486.2C847.4 286.5 704.1 186 512 186c-192.2 0-335.4 100.5-430.2 300.3a60.3 60.3 0 0 0 0 51.5C176.6 737.5 319.9 838 512 838c192.2 0 335.4-100.5 430.2-300.3 7.7-16.2 7.7-35 0-51.5zM512 766c-161.3 0-279.4-81.8-362.7-254C232.6 339.8 350.7 258 512 258c161.3 0 279.4 81.8 362.7 254C791.5 684.2 673.4 766 512 766zm-4-430c-97.2 0-176 78.8-176 176s78.8 176 176 176 176-78.8 176-176-78.8-176-176-176zm0 288c-61.9 0-112-50.1-112-112s50.1-112 112-112 112 50.1 112 112-50.1 112-112 112z"></path></svg>

                                }
                            </div>

                        </div>
                        <div className="my-6">
                            <button onClick={handleLogin} type="button" className="text-md text-white block px-3 py-2 rounded-lg w-full bg-blue-500 shadow-md
                        hover:bg-blue-600
                        focus:bg-blue-700">
                                <span>Log in</span>
                            </button>
                        </div>
                    </form>
                </div>
                <div className="flex w-80 flex-row justify-between gap-x-4">
                    <a href="/" className="flex items-center justify-center flex-1 space-x-1 rounded-lg bg-white py-4 text-center text-base font-bold shadow nuxt-link-active text-blue-500 hover:text-blue-700">
                        <svg viewBox="64 64 896 896" data-icon="home" width="1em" height="1em" fill="currentColor" aria-hidden="true" focusable="false" className="">
                            <path d="M946.5 505L560.1 118.8l-25.9-25.9a31.5 31.5 0 0 0-44.4 0L77.5 505a63.9 63.9 0 0 0-18.8 46c.4 35.2 29.7 63.3 64.9 63.3h42.5V940h691.8V614.3h43.4c17.1 0 33.2-6.7 45.3-18.8a63.6 63.6 0 0 0 18.7-45.3c0-17-6.7-33.1-18.8-45.2zM568 868H456V664h112v204zm217.9-325.7V868H632V640c0-22.1-17.9-40-40-40H432c-22.1 0-40 17.9-40 40v228H238.1V542.3h-96l370-369.7 23.1 23.1L882 542.3h-96.1z">
                            </path>
                        </svg>
                        <span>Home</span>
                    </a>
                    <a href="/register" className="flex items-center justify-center flex-1 space-x-1 rounded-lg bg-white py-4 text-center text-base font-bold shadow text-violet-500 hover:text-violet-700"><i aria-label="icon: user" className="anticon anticon-user">
                        <svg viewBox="64 64 896 896" data-icon="user" width="1em" height="1em" fill="currentColor" aria-hidden="true" focusable="false" className=""><path d="M858.5 763.6a374 374 0 0 0-80.6-119.5 375.63 375.63 0 0 0-119.5-80.6c-.4-.2-.8-.3-1.2-.5C719.5 518 760 444.7 760 362c0-137-111-248-248-248S264 225 264 362c0 82.7 40.5 156 102.8 201.1-.4.2-.8.3-1.2.5-44.8 18.9-85 46-119.5 80.6a375.63 375.63 0 0 0-80.6 119.5A371.7 371.7 0 0 0 136 901.8a8 8 0 0 0 8 8.2h60c4.4 0 7.9-3.5 8-7.8 2-77.2 33-149.5 87.8-204.3 56.7-56.7 132-87.9 212.2-87.9s155.5 31.2 212.2 87.9C779 752.7 810 825 812 902.2c.1 4.4 3.6 7.8 8 7.8h60a8 8 0 0 0 8-8.2c-1-47.8-10.9-94.3-29.5-138.2zM512 534c-45.9 0-89.1-17.9-121.6-50.4S340 407.9 340 362c0-45.9 17.9-89.1 50.4-121.6S466.1 190 512 190s89.1 17.9 121.6 50.4S684 316.1 684 362c0 45.9-17.9 89.1-50.4 121.6S557.9 534 512 534z">

                        </path>
                        </svg>
                    </i>
                        <span>Register</span>
                    </a>
                </div>
            </div>
        </>

    )
}