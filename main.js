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

  const dbData = firebase.database().ref().once('value').then(function(snapshot) { // Retrieving values from DB
     let dbObject = snapshot.val();
  });

  const dbRef = database.ref();


  // Form setup
  const recipeForm          = document.querySelector('.add-recipes-form');
  const submitButton        = document.querySelector('#add-recipe');
  const addNewFields        = Array.from(document.querySelectorAll('.add-recipes-form__add-field'));

  function handleNewFieldAdding(event) { // For adding multiple ingredients we duplicate inputs
    let addToList = document.querySelector(`#${event.target.getAttribute(`data-add-new`)}`);
    let listItem  = addToList.querySelector(`li:first-child`);
    addToList.appendChild(listItem.cloneNode(true));
  }

  addNewFields.map((button) => {
    button.addEventListener("click", handleNewFieldAdding);
  });




  function handleAddRecipes() {
    let recipeName          = document.querySelector('#recipe-name').value;
    let ingredients         = Array.from(document.querySelectorAll('#ingredients li'));
    let cookingSteps        = Array.from(document.querySelectorAll('#cooking-steps li'));
    let ingredientsData     = [];
    let cookingStepsData    = [];

    ingredients.filter(function(item) {
      let ingredientName      = item.querySelector('[name="sastojak"]').value;
      let ingredientQuantity  = item.querySelector('[name="kolicina"]').value;
      // Extracting values from input and storing them into array
      ingredientsData.push({ingredientName, ingredientQuantity});
    });

    cookingSteps.filter(function(item) {
      let cookingStep      = item.querySelector('[name="korak-pripreme"]').value;
      cookingStepsData.push(cookingStep);
    });


    let recipe = {
      recipeName,
      ingredientsData,
      cookingStepsData,
    }


    dbRef.push().set(recipe, function(error) {
      if (error) {
        console.log(`Data could not be saved. ${error}`)
      } else {
        console.log("Data successfully saved");
        recipeForm.reset();
      }
    });

  }

  submitButton.addEventListener('click', handleAddRecipes);



}());