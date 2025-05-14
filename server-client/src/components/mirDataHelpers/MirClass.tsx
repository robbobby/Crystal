import { MirClass } from "../../model/serverStuff/mirClass";
import React from "react";

const MIR_CLASS_NAMES: Record<string, string> = {
  [MirClass.Warrior]: 'Warrior',
  [MirClass.Wizard]: 'Wizard',
  [MirClass.Taoist]: 'Taoist',
  [MirClass.Assassin]: 'Assassin',
  [MirClass.Archer]: 'Archer',
}

interface Props {
  children: MirClass;
}

export const MirClassDisplay: React.FC<Props> = ({ children }) => {
  return <>{MIR_CLASS_NAMES[children]}</>;
};
