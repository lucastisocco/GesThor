export class Cliente{
  constructor(
    public id: number,
    public razon_social: string,
    public cuit: string,
    public tel: number,
    public email: string
  ){}
}