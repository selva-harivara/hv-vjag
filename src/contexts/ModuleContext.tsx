import React, { createContext, useContext, useState } from "react";

const modules = [
  "Organization",
  "Harivara",
  "E-Puja",
  "Temple Tour",
  "Temple Service",
];

type ModuleContextType = {
  selected: string;
  setSelected: (val: string) => void;
  modules: string[];
};

const ModuleContext = createContext<ModuleContextType>({
  selected: modules[0],
  setSelected: () => {},
  modules,
});

export const useModule = () => useContext(ModuleContext);

export const ModuleProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [selected, setSelected] = useState(modules[0]);
  return (
    <ModuleContext.Provider value={{ selected, setSelected, modules }}>
      {children}
    </ModuleContext.Provider>
  );
};
