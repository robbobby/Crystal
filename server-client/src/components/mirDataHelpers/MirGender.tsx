import React from 'react';
import { MirGender } from "../../model/serverStuff/mirGender";

const MIR_GENDER_NAMES: Record<MirGender, string> = {
  [MirGender.Male]: 'Male',
  [MirGender.Female]: 'Female',
};

interface Props {
  children: MirGender;
}

export const MirGenderDisplay: React.FC<Props> = ({ children }) => {
  return <>{MIR_GENDER_NAMES[children]}</>;
};
