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

  checkStringArray(arr, varName, minLength) {
    //We will allow an empty array for this,
    //if it's not empty, we will make sure all tags are strings
    if (!arr || !Array.isArray(arr))
      throw `You must provide an array of ${varName}`;
    if(arr.length < minLength)
        throw `${varName} must have at least ${minLength} element(s)`;
    for (let i in arr) {
      if (typeof arr[i] !== 'string' || arr[i].trim().length === 0) {
        throw `One or more elements in ${varName} array is not a string or is an empty string`;
      }
      arr[i] = arr[i].trim();
    }

    return arr;
  },

  checkSex(sex, varName) {
    if (!sex) throw `Error: You must supply a ${varName}!`;
    if (typeof sex !== 'string') throw `Error: ${varName} must be a string!`;
    sex = sex.trim();
    sex = sex.toLowerCase();
    if (sex.length === 0)
      throw `Error: ${varName} cannot be an empty string or string with just spaces`;
    if (!isNaN(sex))
      throw `Error: ${sex} is not a valid value for ${varName} as it only contains digits`;
    if(sex !== "male" && sex !== "female")
        throw `Error: ${varName} must be either \'male\' or \'female\'`;
    return sex;
  },

  checkDogAge(age, varName) {
    if (!age) throw `Error: You must supply a ${varName}!`;
    if (typeof age !== 'number') throw `Error: ${varName} must be a number!`;
    if (age < 0 || age > 30)
      throw `Error: ${varName} cannot be less than 0 or greater than 30`;
    return age;
  },

  checkWeight(weight, varName) {
    if (!weight) throw `Error: You must supply a ${varName}!`;
    if (typeof weight !== 'number') throw `Error: ${varName} must be a number!`;
    if (weight < 0)
      throw `Error: ${varName} cannot be less than 0`;
    weight = weight.toFixed(1);
    return weight;
  },
};

export default exportedMethods;