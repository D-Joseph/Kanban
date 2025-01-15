import React, { createContext, useContext, useState } from "react";

const GroupsContext = createContext();

export const GroupsProvider = ({ children, groups }) => {
  return (
    <GroupsContext.Provider value={groups}>
      {children}
    </GroupsContext.Provider>
  );
};

export const useGroups = () => useContext(GroupsContext);
