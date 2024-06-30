export interface RegisterRequest {
    name:string,
    lastname:string,
    age:number,
    birthdate:Date,
    email:string,
    phone:string,
    nickname:string,
    password:string,
    confirmedPassword:string
    recaptchaToken: string; // nuevo campo para el token de reCAPTCHA
}