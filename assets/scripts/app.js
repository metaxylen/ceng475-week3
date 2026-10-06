//code_03_1-11
import { apiKey1 } from "./util.js";

//import apiKey from "./util.js";
import { apiKey, abc as content } from "./util.js";
import * as util from "./util.js";


console.log(apiKey);
console.log(util.default);
console.log(content);

// //code_03_13-18
// const userMessage = "Hello World!!!";

// console.log(userMessage);
// console.log(userMessage+'  CENG 475"');
// console.log(10 =='10')


//code_03_21-41

// const greet = () => {
//     console.log("Welcome to CENG 475! \nIs it cool?");
// };
  
// greet();

    
// function createGreeting(userName, message = "Hello!") {
// console.log(userName);
// console.log(message);
// return "Hi, I am " + userName + ". " + message;
// }

// const greeting1 = createGreeting("Student1 ");
// console.log(greeting1);


// const greeting2 = ("Student1", "Hello, what's up?");
// console.log(greeting2);


////code_03_44-54
// const hobbies = ["Sports", "Cooking", "Reading"];
// console.log(hobbies[0]);

// console.log(hobbies[1], typeof (hobbies[2]));
// hobbies.push(-4.003);
// console.log(hobbies);

// const index = hobbies.findIndex((item) => item === "Cooking");

// console.log(index);


//code_3_57-72
// const hobbies = [1234, 32.04, 'e', "Sports", "Cooking", "Reading"];
// console.log(hobbies[1], typeof (hobbies[1]));
// hobbies.push(-4.003);

// // hobbies.push("Working");
// // console.log(hobbies);
// const index1 = hobbies.entries();
// const index = hobbies.findIndex((item) => { return item == "32.04" });

// console.log(index);

// const editedHobbies1 = hobbies.map((item) => (" ! "+item));
// const editedHobbies = hobbies.map((item) => ({ text: item }));
// console.log(editedHobbies);
// console.log(editedHobbies1);

//code_3_74-80
// const school=['Cumhuriyet','Anatolian','Gazi']
// const highSchools = school.map(school => `${school} High School`);
// // Cumhuriyet High School
// // Anatolian High School
// // Gazi High School

// console.log(highSchools);

// code_3_83_90
// let obj=[11, 12, 13] ;
// function transformToObjects(numberArray) {
//     const obj = numberArray.map(( e1) => ({ val : e1 }));
//     return obj;
//  }
//  console.log(transformToObjects(obj));

// code_3_91_100
// const arr = [1, 2, 3];
// function transformToObjects(numberArray) {

//   // Return the result of calling `map` on the array
//   // (which is itself an array)
//   return numberArray.map(element => {
//     return { val: element };
//   });
// }

// console.log(transformToObjects(arr));


////code_03_56-67
// const hobbies = ["Sports", "Cooking", "Reading"];
// const editedHobbies = hobbies.map((item) => ({ text: item }));
// console.log(editedHobbies);

// const [firstName, lastName] = ["Ender ", "Sevinç"];

// //const firstName = userNameData[0];
// //const lastName = userNameData[1];

// console.log(firstName);
// console.log(lastName);

// code_69-82
// const { name: userName, age } = {
//   name: "Max",
//   age: 45
// };

