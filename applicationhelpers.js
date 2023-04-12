export function inputChecker(input){
   if(!input) throw `Input is required`;
}
export function boolChecker(input){
   if(typeof input != 'boolean') throw `A boolean is required`;
}
export function numChecker(input){
   if(typeof input != 'number') throw `A number is required`;
   if(isNaN(input) === true) throw `A number is required`;
   if(input != Math.floor(input)) throw `Decimals are not valid`;
}
export function stringChecker(input){
   if(typeof input != 'string') throw `Input must be of type string`;
   if(input.trim().length === 0) throw `String cannot be empty`;
   input = input.trim();
   return input;
}


export function nameChecker(input){
   //allowed ascii codes: 32, 45, 65-90, 97-122
   for(let i = 0; i < input.length; i++){
       if((input.charCodeAt(input[i]) != 32 || input.charCodeAt(input[i]) != 45) && !(input.charCodeAt(input[i]) >= 65 && (input.charCodeAt(input[i]) <= 90)) && !(input.charCodeAt(input[i]) >= 97 && (input.charCodeAt(input[i]) <= 122))){
           throw `Invalid character present in name`;
       }
   }
}
export function arrayChecker(input){
   if(!Array.isArray(input)) throw `An array is required`;
}