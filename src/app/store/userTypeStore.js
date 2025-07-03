import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useUserTypeStore = create(persist(
  (set) => ({
    userId:null,
    userType: null, // 'Lawyer', 'Client', 'Admin'
    username: null, // Store the user's name from Clerk
    setUserType: (userType) => set({ userType }),
    setUsername: (username) => set({ username }),
    resetUser: () => set({ userType: null, username: null }),
    setUserId:(userId)=>set({userId})
  }),
  {
    name: 'user-type-storage', // name of item in storage
    partialize: (state) => ({ userType: state.userType, username: state.username ,userId:state.userId}),
  }
));

export default useUserTypeStore; 