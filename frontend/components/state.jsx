import { create } from 'zustand'
import {createJSONStorage, persist} from "zustand/middleware";

export const useUserID = create(
    persist((set) => ({
        userID: 0,
        setUserID: (userID) => set((state)=>({userID: userID})),
        removeUserID: () => set({ userID: 0 }),
    }),
        {
            name: 'user-storage', // name of the item in the storage (must be unique)
            storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
        },
    )
)

export const useCart = create(
    persist((set,get) => ({
            items: [],
            amounts: [],
            addItem: (productID) => {
                let temp_amounts = get().amounts.map((x) => x)
                let temp_items = get().items.map((x) => x)
                if (temp_items.includes(productID)){
                    temp_amounts[temp_items.indexOf(productID)]+=1
                    set(state=>({
                        ...state,
                        amounts:temp_amounts
                    }))
                }
                else{
                    temp_amounts.push(1)
                    temp_items.push(productID)
                    set(state=>({
                        items:temp_items,
                        amounts:temp_amounts
                    }))
                }
            },
            reduceItem: (productID) => {
                let temp_amounts = get().amounts.map((x) => x)
                let temp_items = get().items.map((x) => x)
                if (temp_items.includes(productID)){
                    let index = temp_items.indexOf(productID)
                    temp_amounts[index]-=1
                    if(temp_amounts[index]<=0){
                        temp_amounts.splice(index,1)
                        temp_items.splice(index,1)
                    }
                    set(state=>({
                        items:temp_items,
                        amounts:temp_amounts
                    }))
                }
            },
        }),
        {
            name: 'cart-storage', // name of the item in the storage (must be unique)
            storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
        },
    )
)