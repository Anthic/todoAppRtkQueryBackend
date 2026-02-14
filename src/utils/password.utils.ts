import bcrypt from "bcrypt";

import { envVariable } from "../config/env.ts";

export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, Number(envVariable.SALT_ROUNDS));
};


export const comaprePassword = async(password: string, hashedPassword : string): Promise<boolean> =>{
 return await bcrypt.compare(password,hashedPassword )
}