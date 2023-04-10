// You can add and export any helper functions you want here - if you aren't using any, then you can just leave this file as is
import {ObjectId} from 'mongodb';


const exportedMethods = {
  checkId(id, varName) {
    if (!id) throw `Error: You must provide a ${varName}`;
    if (typeof id !== 'string') throw `Error:${varName} must be a string`;
    id = id.trim();
    if (id.length === 0)
      throw `Error: ${varName} cannot be an empty string or just spaces`;
    if (!ObjectId.isValid(id)) throw `Error: ${varName} invalid object ID`;
    return id;
  },

  checkString(strVal, varName) {
    if (!strVal) throw `Error: You must supply a ${varName}!`;
    if (typeof strVal !== 'string') throw `Error: ${varName} must be a string!`;
    strVal = strVal.trim();
    if (strVal.length === 0)
      throw `Error: ${varName} cannot be an empty string or string with just spaces`;
    if (!isNaN(strVal))
      throw `Error: ${strVal} is not a valid value for ${varName} as it only contains digits`;
    return strVal;
  },

  checkStringArray(arr, varName) {
    if (!arr || !Array.isArray(arr))
      throw `You must provide an array of ${varName}`;
    if (arr.length === 0) throw `Please pass more than 0 elements into the ${varName} array`;
    for (let i in arr) {
      if (typeof arr[i] !== 'string' || arr[i].trim().length === 0) {
        throw `One or more elements in ${varName} array is not a string or is an empty string`;
      }
      arr[i] = arr[i].trim();
    }

    return arr;
  },

  checkArrEqual(arr1, arr2){
    if(arr1.length !== arr2.length) return false;
    let sortedArr1 = arr1.sort();
    let sortedArr2 = arr2.sort();
    for (let i = 0; i < sortedArr1.length; i++){
      if (sortedArr1[i] !== sortedArr2[i]) return false;
    }
    return true;
  },

  checkAge(num){
    if(typeof num !== 'number') throw 'Age must be a number';
    if(!Number.isInteger(num)) throw 'Age must be an integer';
    if(num < 18 || num > 120) throw 'You are too young or have provided a fake age';
    return num;
  },

  checkEmail(email){
    if(typeof email !== 'string') throw 'Email must be a string';
    email = email.trim();
    if(email.length === 0) throw 'Email must be more than an empty string';
    let emailEnd = email.slice(-4);
    if (emailEnd !== '.com' && emailEnd !== '.net' && emailEnd !== '.edu' && emailEnd !== '.gov' && emailEnd !== '.org') throw 'You must provide a valid email';
    return email;
  }
};

export default exportedMethods;