import {Transition} from "@headlessui/react";

const Notification = ({show=false,...props})=>{
    return(
        <Transition
            as='div'
            show={show}
            enter="transition-all duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-all duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            className=""
        >
            {
                (!props.type||props.type==='success')?
                    <div className="bg-green-50 text-center py-4 lg:px-4">
                        <div className="p-2 bg-green-200 items-center text-black leading-none rounded-full inline-flex" role="alert">
                            <span className="flex rounded-full bg-green-500 uppercase px-2 py-1 text-xs font-bold mr-3">success</span>
                            <span className="font-semibold mr-2 text-left flex-auto">{props.context}</span>
                        </div>
                    </div>
                    :
                    <div className="bg-red-300 text-center py-4 lg:px-4">
                        <div className="p-2 bg-red-400 items-center text-white leading-none rounded-full inline-flex" role="alert">
                            <span className="flex rounded-full bg-red-500 uppercase px-2 py-1 text-xs font-bold mr-3">Error</span>
                            <span className="font-semibold mr-2 text-left flex-auto">{props.context}</span>
                        </div>
                    </div>

            }
        </Transition>

    )
}

export default Notification
