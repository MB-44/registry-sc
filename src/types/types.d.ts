declare module "bcrypt" {
    export function hash(data: string, saltOrRounds: number | string): Promise<string>;
    export function compare(data: string, encrypted: string): Promise<boolean>;
    export function genSalt(rounds?: number): Promise<string>;
  }
  
  declare module "jsonwebtoken" {
    export function sign(payload: string | object | Buffer, secretOrPrivateKey: string, options?: object): string;
    export function verify(token: string, secretOrPublicKey: string, options?: object): object | string;
    export function decode(token: string, options?: object): null | { [key: string]: any } | string;
  }
  