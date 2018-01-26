"use strict";

(function() {

  // Initialize Firebase
  const config = {
    apiKey: "AIzaSyCJItlQ5Qo82r_0Z2XOObgKRHw4Sp4RnnQ",
    authDomain: "recepti-na-brzaka.firebaseapp.com",
    databaseURL: "https://recepti-na-brzaka.firebaseio.com",
    projectId: "recepti-na-brzaka",
    storageBucket: "gs://recepti-na-brzaka.appspot.com/",
    messagingSenderId: "839646076886"
  };
  firebase.initializeApp(config);

  const database = firebase.database();

  const dbData = firebase.database().ref().once('value').then(function(snapshot) {
     let dbObject = snapshot.val();
  });

  const dbRef = database.ref();

 

  const recipes    = document.querySelector('#recipes');
  const addRecipes = document.querySelector('#add-recipe');

  
  // Adding recipes 
  {// Needs to pickup ingretients from the form
    const recept = {
      ime : 'imetest',
      sastojci : ['sastojak1','sastojak2'],
      priprema : 'priprematest',
      masnoca : 'niska'
    }

    function handleAddRecipes() {
      dbRef.push().set(recept, function(error) {
        if (error) {
          console.log(`Data could not be saved. ${error}`)
        } else {
          console.log("Data successfully saved");
        }
      }); 
    }

    addRecipes.addEventListener('click', handleAddRecipes);
  }

  
}());